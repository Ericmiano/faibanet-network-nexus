
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone_number, message, payment_id } = await req.json();
    
    // For now, simulate SMS sending (replace with actual SMS provider)
    console.log(`Sending SMS to ${phone_number}: ${message}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update notification status
    if (payment_id) {
      await supabase
        .from("payment_notifications")
        .update({
          status: "sent",
          sent_at: new Date().toISOString()
        })
        .eq("payment_id", payment_id);
    }

    return new Response(
      JSON.stringify({ success: true, message: "SMS sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error sending SMS:", error);
    
    // Update notification status to failed
    const { payment_id } = await req.json().catch(() => ({}));
    if (payment_id) {
      await supabase
        .from("payment_notifications")
        .update({
          status: "failed",
          error_message: error.message
        })
        .eq("payment_id", payment_id);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

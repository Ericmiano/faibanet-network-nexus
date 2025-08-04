import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  phone: string;
  amount: number;
  account_reference: string;
  description: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { phone, amount, account_reference, description }: PaymentRequest = await req.json();

    // M-Pesa STK Push simulation
    const transactionId = `TXN${Date.now()}`;
    
    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        customer_id: user.id,
        transaction_type: 'payment',
        amount,
        currency: 'KES',
        status: 'processing',
        gateway_reference: transactionId,
        gateway_response: {
          phone,
          account_reference,
          description,
          initiated_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Simulate M-Pesa processing (in real implementation, integrate with Safaricom API)
    setTimeout(async () => {
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      await supabase
        .from('payment_transactions')
        .update({
          status: success ? 'completed' : 'failed',
          processed_at: new Date().toISOString(),
          failure_reason: success ? null : 'Payment timeout or insufficient funds'
        })
        .eq('id', transaction.id);

      // Send real-time notification
      await supabase
        .from('real_time_notifications')
        .insert({
          user_id: user.id,
          channel: 'payment',
          event_type: success ? 'payment_success' : 'payment_failed',
          title: success ? 'Payment Successful' : 'Payment Failed',
          message: success 
            ? `Your payment of KES ${amount} has been processed successfully.`
            : `Your payment of KES ${amount} failed. Please try again.`,
          data: { transaction_id: transactionId, amount },
          priority: success ? 'normal' : 'high'
        });
    }, 30000); // 30 seconds processing time

    return new Response(
      JSON.stringify({
        success: true,
        transaction_id: transactionId,
        message: "Payment initiated. You will receive an M-Pesa prompt shortly.",
        status: "processing"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
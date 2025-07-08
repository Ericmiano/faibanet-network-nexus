
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MpesaPayment {
  transaction_id: string;
  amount: number;
  phone_number: string;
  account_reference?: string;
  timestamp: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payment: MpesaPayment = await req.json();
    console.log("Processing payment:", payment);

    // Add to payment queue
    const { data: queueData, error: queueError } = await supabase
      .from("payment_queue")
      .insert({
        transaction_id: payment.transaction_id,
        amount: payment.amount,
        phone_number: payment.phone_number,
        account_reference: payment.account_reference,
        payment_source: "mpesa_api",
        raw_data: payment,
        status: "pending"
      })
      .select()
      .single();

    if (queueError) {
      console.error("Queue error:", queueError);
      throw queueError;
    }

    // Find matching customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("id, name, phone")
      .eq("phone", payment.phone_number)
      .single();

    if (customerError || !customer) {
      console.log("Customer not found for phone:", payment.phone_number);
      
      // Update queue status to failed
      await supabase
        .from("payment_queue")
        .update({ 
          status: "failed", 
          error_message: "Customer not found",
          processed_at: new Date().toISOString()
        })
        .eq("id", queueData.id);

      return new Response(
        JSON.stringify({ error: "Customer not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create payment record
    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .insert({
        customer_id: customer.id,
        amount: payment.amount,
        payment_method: "M-Pesa",
        transaction_id: payment.transaction_id,
        phone_number: payment.phone_number,
        mpesa_receipt_number: payment.transaction_id,
        account_reference: payment.account_reference,
        payment_source: "mpesa_api",
        status: "completed",
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment error:", paymentError);
      
      // Update queue status to failed
      await supabase
        .from("payment_queue")
        .update({ 
          status: "failed", 
          error_message: paymentError.message,
          processed_at: new Date().toISOString()
        })
        .eq("id", queueData.id);

      throw paymentError;
    }

    // Update queue status to completed
    await supabase
      .from("payment_queue")
      .update({ 
        status: "completed",
        processed_at: new Date().toISOString()
      })
      .eq("id", queueData.id);

    // Queue SMS notification
    const message = `Dear ${customer.name}, we've received your payment of KES ${payment.amount.toLocaleString()} on ${new Date().toLocaleDateString()}. Your internet service remains active. - Faibanet`;
    
    await supabase
      .from("payment_notifications")
      .insert({
        payment_id: paymentData.id,
        customer_id: customer.id,
        phone_number: payment.phone_number,
        message: message,
        status: "pending"
      });

    // Call SMS sending function
    const smsResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-sms`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone_number: payment.phone_number,
        message: message,
        payment_id: paymentData.id
      })
    });

    console.log("Payment processed successfully:", paymentData.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        payment_id: paymentData.id,
        customer: customer.name 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error processing payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

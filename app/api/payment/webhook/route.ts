import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

// Utility function to create HMAC using Web Crypto API
async function createHmac(secret: string, message: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  return await crypto.subtle.sign('HMAC', key, messageData);
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  console.log(`[Webhook ${requestId}] 🔄 Processing new webhook request`);
  
  try {
    const bodyText = await request.text();
    const headersList = headers();
    const payload = JSON.parse(bodyText);
    
    // Signature validation
    const sigString = headersList.get("x-signature");
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET as string;
    const hmacBuffer = await createHmac(secret, bodyText);
    const hmacArray = Array.from(new Uint8Array(hmacBuffer));
    const digest = hmacArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const signatureString = Array.isArray(sigString) ? sigString.join("") : sigString || "";

    if (digest !== signatureString) {
      console.error(`[Webhook ${requestId}] ❌ Invalid signature detected`);
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 });
    }

    console.log(`[Webhook ${requestId}] ✅ Signature verified successfully`);
    
    // Event processing
    const eventName = payload.meta.event_name;
    const productId = payload.data.attributes.first_order_item.product_id;
    const transactionType = productId === parseInt(process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRODUCT_DOWNLOAD_HIRES_ID as string)
      ? 'high_res_image'
      : 'generation_plan';

    console.log(`[Webhook ${requestId}] 📦 Event: ${eventName} | Transaction: ${transactionType}`);

    switch (eventName) {
      case "order_created":
        await handleOrderCreated(payload, transactionType, requestId);
        break;
      case "order_refunded":
        console.log(`[Webhook ${requestId}] ⚠️ Refund event received - handler not implemented`);
        break;
      case "order_failed":
        console.log(`[Webhook ${requestId}] ⚠️ Failed order event received - handler not implemented`);
        break;
      default:
        console.log(`[Webhook ${requestId}] ℹ️ Unhandled event type: ${eventName}`);
        break;
    }

    console.log(`[Webhook ${requestId}] ✨ Webhook processed successfully`);
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    console.error(`[Webhook ${requestId}] 🚨 Processing error:`, error);
    return NextResponse.json({ message: "Processing failed" }, { status: 500 });
  }
}

const handleOrderCreated = async (payload: any, transactionType: string, requestId: string) => {
  console.log(`[Order ${requestId}] 🛒 Processing new order`);
  
  if (transactionType === 'high_res_image') {
    await handleBuyHiresOrderCreated(payload, transactionType, requestId);
  } else if (transactionType === 'generation_plan') {
    await handleBuyCreditsOrderCreated(payload, transactionType, requestId);
  }
}

const handleBuyHiresOrderCreated = async (payload: any, transactionType: string, requestId: string) => {
  const supabase = await createClient();
  
  try {
    const customData = payload.meta.custom_data;
    const userId = customData?.user_id;
    const generationId = customData?.generation_id;
    const amount = payload.data.attributes.total_usd / 100;

    console.log(`[HiRes ${requestId}] 🎨 Processing high-res purchase:`, {
      userId,
      generationId,
      amount: `$${amount}`
    });

    // Update user_generations table
    const { error: generationUpdateError } = await supabase
      .from("user_generations")
      .update({
        is_high_res_purchased: true
      })
      .eq("id", generationId);

    if (generationUpdateError) {
      console.error(`[HiRes ${requestId}] ❌ Failed to update generation:`, generationUpdateError);
      throw generationUpdateError;
    }

    // Insert transaction record
    const { error: transactionInsertError } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        transaction_type: transactionType,
        amount: amount,
        generation_id: generationId,
        transaction_timestamp: new Date().toISOString(),
      });

    if (transactionInsertError) {
      console.error(`[HiRes ${requestId}] ❌ Failed to insert transaction:`, transactionInsertError);
      throw transactionInsertError;
    }

    console.log(`[HiRes ${requestId}] ✅ High-res purchase completed successfully`);

  } catch (error) {
    console.error(`[HiRes ${requestId}] 🚨 Error processing high-res purchase:`, error);
    throw error;
  }
};

const handleBuyCreditsOrderCreated = async (payload: any, transactionType: string, requestId: string) => {
  const supabase = await createClient();

  try {
    const customData = payload.meta.custom_data;
    const userId = customData?.user_id;
    const amount = payload.data.attributes.total_usd / 100;

    console.log(`[Credits ${requestId}] 💳 Processing credits purchase:`, {
      userId,
      amount: `$${amount}`
    });

    // Insert transaction record
    const { error: transactionInsertError } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        transaction_type: transactionType,
        amount: amount,
        transaction_timestamp: new Date().toISOString(),
      });

    if (transactionInsertError) {
      console.error(`[Credits ${requestId}] ❌ Failed to insert transaction:`, transactionInsertError);
      throw transactionInsertError;
    }

    // Update users table
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        purchased_generations_left: 10
      })
      .eq("id", userId);

    if (userUpdateError) {
      console.error(`[Credits ${requestId}] ❌ Failed to update user credits:`, userUpdateError);
      throw userUpdateError;
    }

    console.log(`[Credits ${requestId}] ✅ Credits purchase completed successfully`);

  } catch (error) {
    console.error(`[Credits ${requestId}] 🚨 Error processing credits purchase:`, error);
    throw error;
  }
}
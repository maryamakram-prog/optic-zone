const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envPath = '.env';
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  }
} catch (e) {
  console.error('Error reading .env:', e);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsertOrder() {
  try {
    // 1. Create a dummy order
    const orderPayload = {
      user_id: null,
      total_amount: 189.99,
      status: 'pending',
      shipping_address: '123 Test St, Boston, MA',
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '123-456-7890'
    };

    console.log('Inserting order...');
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    if (orderError) {
      console.error('Order insertion failed:', orderError.message, orderError.code, orderError.details);
      return;
    }

    console.log('Order inserted successfully! ID:', newOrder.id);

    // 2. Try inserting an order item using a test product ID (UUID or integer)
    // We will try an integer first (1) and see what happens, then we will try UUID.
    const itemPayloadInteger = {
      order_id: newOrder.id,
      product_id: 1, // integer
      quantity: 1,
      price_at_time: 189.99
    };

    console.log('Inserting order item with integer product_id (1)...');
    const { data: newItemInt, error: itemErrorInt } = await supabase
      .from('order_items')
      .insert([itemPayloadInteger])
      .select();

    if (itemErrorInt) {
      console.log('Integer product_id insertion failed:', itemErrorInt.message, itemErrorInt.code);
    } else {
      console.log('Integer product_id insertion succeeded:', newItemInt);
    }

    const itemPayloadUUID = {
      order_id: newOrder.id,
      product_id: 'a1111111-1111-1111-1111-111111111111', // UUID string
      quantity: 1,
      price_at_time: 189.99
    };

    console.log('Inserting order item with UUID product_id...');
    const { data: newItemUUID, error: itemErrorUUID } = await supabase
      .from('order_items')
      .insert([itemPayloadUUID])
      .select();

    if (itemErrorUUID) {
      console.log('UUID product_id insertion failed:', itemErrorUUID.message, itemErrorUUID.code);
    } else {
      console.log('UUID product_id insertion succeeded:', newItemUUID);
    }

    // Clean up test order
    console.log('Cleaning up test order...');
    await supabase.from('orders').delete().eq('id', newOrder.id);
  } catch (err) {
    console.error('Err:', err);
  }
}

testInsertOrder();

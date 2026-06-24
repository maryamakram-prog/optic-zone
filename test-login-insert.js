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

async function testAuthInsert() {
  try {
    console.log('Logging in as customer john@opticzone.com...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'john@opticzone.com',
      password: 'password123'
    });

    if (authError) {
      console.error('Auth failed:', authError.message);
      return;
    }

    console.log('Login successful! User ID:', authData.user.id);

    const orderPayload = {
      user_id: authData.user.id,
      total_amount: 189.99,
      status: 'pending',
      shipping_address: '123 Customer Ave, Boston, MA',
      customer_name: 'John Doe',
      customer_email: 'john@opticzone.com',
      customer_phone: '123-456-7890'
    };

    console.log('Inserting order for logged-in customer...');
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    if (orderError) {
      console.error('Authenticated order insertion failed:', orderError.message, orderError.code);
    } else {
      console.log('Authenticated order inserted successfully! ID:', newOrder.id);
      // Clean up
      await supabase.from('orders').delete().eq('id', newOrder.id);
    }
  } catch (err) {
    console.error('Err:', err);
  }
}

testAuthInsert();

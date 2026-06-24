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

async function checkOrders() {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)');
    
    if (error) {
      console.log('Error fetching orders:', error.message);
    } else {
      console.log(`Found ${orders.length} orders in the database.`);
      console.log(JSON.stringify(orders, null, 2));
    }
  } catch (err) {
    console.error('Err:', err);
  }
}

checkOrders();

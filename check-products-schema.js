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

async function check() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
      console.log('Error querying products:', error.message);
    } else {
      console.log('Sample product:', data[0]);
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

check();

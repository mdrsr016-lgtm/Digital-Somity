import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  const { data, error } = await supabase
    .from('users')
    .select('login_id, name, roles(name_en)')
    .eq('login_id', 'adm00')
    .single();

  if (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Connection successful!');
  console.log('Admin User Found:', data.name, `(${data.login_id})`);
  console.log('Role:', data.roles.name_en);
}

testConnection();

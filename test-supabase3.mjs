import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udfbawtsfqvrxuyzahfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZmJhd3RzZnF2cnh1eXphaGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTE4MTIsImV4cCI6MjA4OTc2NzgxMn0.avEL0g9y2qLmz54NQ1uhf0_hW-mq-Sjm4V648x6ysVk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const userDetailsRes = await supabase.from('user_details').select('*');
  console.log('user_details count:', userDetailsRes.data?.length);
  
  const rolesRes = await supabase.from('roles').select('*');
  console.log('roles count:', rolesRes.data?.length);

  // Maybe the table is named differently in plural/singular?
  const wsRes = await supabase.from('workspaces').select('*');
  console.log('workspaces count:', wsRes.data?.length);

  const uRes = await supabase.from('users').select('*');
  console.log('users count:', uRes.data?.length);
}

test();

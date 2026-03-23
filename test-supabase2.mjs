import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udfbawtsfqvrxuyzahfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZmJhd3RzZnF2cnh1eXphaGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTE4MTIsImV4cCI6MjA4OTc2NzgxMn0.avEL0g9y2qLmz54NQ1uhf0_hW-mq-Sjm4V648x6ysVk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const selectRes = await supabase.from('workspaces').select('*').limit(1);
  if (selectRes.data && selectRes.data.length > 0) {
    const id = selectRes.data[0].id;
    console.log('Testing Workspace Update for ID:', id);
    const updateRes = await supabase.from('workspaces').update({ status: 'removed' }).eq('id', id).select();
    console.log('Update Result Error:', updateRes.error);
    console.log('Update Result Data:', updateRes.data);
  } else {
    console.log('No workspaces found to update.');
  }

  const userRes = await supabase.from('users').select('*').limit(1);
  if (userRes.data && userRes.data.length > 0) {
    const id = userRes.data[0].login_id;
    console.log('Testing User Update for ID:', id);
    const updateRes = await supabase.from('users').update({ status: 'suspended' }).eq('login_id', id).select();
    console.log('Update Result Error:', updateRes.error);
    console.log('Update Result Data:', updateRes.data);
  } else {
    console.log('No users found to update.');
  }
}

test();

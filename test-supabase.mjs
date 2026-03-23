import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udfbawtsfqvrxuyzahfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkZmJhd3RzZnF2cnh1eXphaGZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTE4MTIsImV4cCI6MjA4OTc2NzgxMn0.avEL0g9y2qLmz54NQ1uhf0_hW-mq-Sjm4V648x6ysVk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Workspace Insert...');
  const { data, error } = await supabase.from('workspaces').insert([{
    name: 'Test Workspace ' + Date.now(),
    type_en: 'Monthly',
    type_bn: 'মাসিক',
    status: 'active'
  }]).select();
  
  console.log('Insert Result DataType:', data ? typeof data : 'null');
  console.log('Insert Result Data:', data);
  console.log('Insert Result Error:', error);
  
  if (data && data[0]) {
    console.log('Testing Workspace Update...');
    const updateRes = await supabase.from('workspaces').update({ status: 'removed' }).eq('id', data[0].id).select();
    console.log('Update Result Error:', updateRes.error);
    console.log('Update Result Data:', updateRes.data);
  }
}

test();

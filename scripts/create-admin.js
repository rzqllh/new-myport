require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase URL or Service Key in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  const email = 'hafizh@example.com';
  const password = 'AdminPassword123!';

  console.log(`Creating admin user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating user:', error);
    }
  } else {
    console.log('Successfully created admin user!');
    console.log('Email:', email);
    console.log('Password:', password);
  }
}

createAdmin();

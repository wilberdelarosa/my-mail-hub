const { createClient } = require('@supabase/supabase-js');

async function checkUser() {
    const supabase = createClient(
        'http://localhost:54321',
        'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz' // Using the key from identity-service/.env
    );

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'admin@alitogroup.com')
        .single();

    if (error) {
        console.error('Error fetching user:', error.message);
    } else {
        console.log('User found:', data);
    }
}

checkUser();

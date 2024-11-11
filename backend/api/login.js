// api/login.js
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');  // If using bcrypt for password comparison

// Initialize Supabase client (make sure to set your own Supabase URL and key)
const supabase = createClient('your-supabase-url', 'your-supabase-key');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Fetch user from custom_users table using the provided username (email)
    const { data: user, error } = await supabase
      .from('custom_users')
      .select('*')
      .eq('email', username)
      .single(); // Make sure to fetch a single user

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If user exists, verify the password (using bcrypt to compare hashed password)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Return the authenticated user's data (excluding sensitive data like password)
    res.status(200).json({ user: { email: user.email, name: user.name } });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });  // Handle non-POST requests
  }
};

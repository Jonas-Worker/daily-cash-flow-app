const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Endpoint to login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    // Perform authentication logic here
    const { data: user, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', username)
        .single();

    if (error || !user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ user: user.email });
});
// Insert cash flow data
app.post("/insert", authenticateJWT, async (req, res) => {
  const { cash_in, cash_out, date } = req.body;

  const { data, error } = await supabase
    .from("cash_flows")
    .insert([{ cash_in, cash_out, date }]);

  if (error) {
    return res.status(400).json(error);
  }
  res.json(data);
});

// Fetch cash flow data
app.get("/cashflows", authenticateJWT, async (req, res) => {
  const { data, error } = await supabase.from("cash_flows").select("*");
  if (error) {
    return res.status(400).json(error);
  }
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

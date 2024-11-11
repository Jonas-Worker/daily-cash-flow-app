// api/login.js
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');  // If using bcrypt for password comparison
import supabase from '../../frontend/supabaseClient'; 


module.exports = async (req, res) => {
    if (req.method === 'POST') {
      const { username, password } = req.body;
      
      // 在 custom_users 表中查找该用户
      const { data: user, error } = await supabase
        .from('custom_users')
        .select('*')
        .eq('email', username)
        .single();
    
      if (error || !user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    
      // 使用 bcrypt 比对密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
    
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    
      // 登录成功，返回用户数据
      return res.status(200).json({ user: user.email });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  };
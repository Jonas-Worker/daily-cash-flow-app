import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import supabase from '../supabaseClient'; 

const LoginScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://daily-cash-flow-app.vercel.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
  
      // 检查响应状态
      if (!response.ok) {
        console.log('Server returned an error:', response.status, response.statusText);
        setError('Invalid login credentials or server error.');
        return;
      }
  
      const result = await response.json();
      if (result.error) {
        setError(result.message || 'Invalid login credentials');
        return;
      }
  
      // 登录成功，跳转到主页面
      navigation.navigate('MainPage', { user: result.user });
    } catch (err) {
      console.log('Error during login:', err); // 打印详细错误信息
      setError('An error occurred during login.');
    }
  };
  
  
  return (
    <View>
      <TextInput
        placeholder="Username (Email)"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default LoginScreen;

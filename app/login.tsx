import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // ナビゲーションフックをインポート
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ナビゲーションルート型を定義
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

export default function LoginScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const route = useRoute();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleLogin = async () => {
    setMessage(''); // メッセージをリセット

    try {
      const response = await fetch('http://192.168.3.160:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text(); // JSONじゃなくても確認できるようにする
      console.log('Raw response:', text);

      if (response.ok) {
        const data = JSON.parse(text);
        setMessage('Login successful!');
        await AsyncStorage.setItem('token', data.token);
        console.log('Token:', data.token); // トークンを保存（例: ローカルストレージ）

        // ダッシュボード画面に遷移
        navigation.replace('dashboard');
      } else {
        const error = await response.json();
        setMessage(error.message || 'Login failed!');
      }
    } catch (err) {
      console.error('Error during login:', err); 
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  message: {
    marginTop: 10,
    color: 'red',
  },
});

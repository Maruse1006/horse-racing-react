import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setMessage(`User registered: ${userCredential.user.email}`);
      })
      .catch((error) => setMessage(error.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setMessage(`Welcome, ${userCredential.user.email}`);
      })
      .catch((error) => setMessage(error.message));
  };

  return (
    <View>
      <TextInput 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
        style={{ margin: 10, borderWidth: 1, padding: 5 }}
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        onChangeText={setPassword} 
        value={password} 
        style={{ margin: 10, borderWidth: 1, padding: 5 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Login" onPress={handleLogin} />
      <Text style={{ margin: 10 }}>{message || ''}</Text>
    </View>
  );
};

export default LoginScreen;

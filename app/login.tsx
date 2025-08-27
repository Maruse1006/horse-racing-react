import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../src/context/AuthContext";

type RootStackParamList = { Login: undefined; Dashboard: undefined };

const TOKEN_KEY = "accessToken"; 
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen(): JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");

    try {
      if (!API_URL) {
        console.log("Login: API_URL is undefined");
        Alert.alert("設定エラー", "EXPO_PUBLIC_API_URL が設定されていません。");
        return;
      }

      console.log("Login: POST", `${API_URL}/api/login`);
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const raw = await res.text(); 
      console.log("Login: raw response:", raw);

      if (!res.ok) {
        setMessage(() => {
          try {
            const j = JSON.parse(raw);
            return j.message || `HTTP ${res.status}`;
          } catch {
            return `HTTP ${res.status}`;
          }
        });
        return;
      }

      let token: string | null = null;
      try {
        const j = JSON.parse(raw);
        token = j?.access_token || j?.token || null; 
      } catch {
 
      }

      if (!token) {
        console.log("Login: token not found in response");
        setMessage("Token not found");
        return;
      }

      console.log("Login: token length =", token.length);
      await AsyncStorage.setItem(TOKEN_KEY, token); // ★ await する

      // AuthContext のAPIに合わせる
      if (auth?.login) {
        // 多くの実装は login(token)
        await auth.login(token as any);
      }

      setMessage("Login successful!");

    } catch (err: any) {
      console.log("Login: exception:", String(err));
      setMessage("An error occurred. Please try again later.");
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
  container: { padding: 20, flex: 1, justifyContent: "center" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 5 },
  message: { marginTop: 10, color: "red" },
});

import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard(){
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("トークンがありません。ログインしてください。");
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/api/bet-summary", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSummary(data);
        console.log("取得したデータ:", data);
      } catch (error) {
        console.error("エラーが発生しました:", error);
        Alert.alert("バックエンドへのリクエストに失敗しました。");
      }
    };

    fetchHorses();
  }, []);

  return (
    <View style={styles.container}>
      
    </View>
  );
};
const styles = StyleSheet.create({

});
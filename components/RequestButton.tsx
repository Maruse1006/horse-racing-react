// RequestButton.tsx
import React from 'react';
import { Button, Alert } from 'react-native';
import axios from 'axios';

type RequestButtonProps = {
  onFetchData: (data: any) => void;
};

const RequestButton: React.FC<RequestButtonProps> = ({ onFetchData }) => {
  const handlePress = async () => {
    try {
      const response = await axios.get('http://192.168.3.160:8000/api');
      Alert.alert("Success", "データを取得しました！", [{ text: "OK" }]);
      onFetchData(response.data); // 取得したデータを親コンポーネントに渡す
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "データ取得に失敗しました。");
    }
  };

  return (
    <Button title="データを取得" onPress={handlePress} />
  );
};

export default RequestButton;

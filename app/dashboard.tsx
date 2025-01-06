import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

const Dashboard = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Dashboard'>>();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed, redirecting to Login.');

      // ログイン画面に遷移
      navigation.navigate("Login");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;

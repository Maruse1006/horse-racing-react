// app/_layout.tsx
import { Stack } from "expo-router";
// app/_layout.tsx の一番上
import 'react-native-gesture-handler';


export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

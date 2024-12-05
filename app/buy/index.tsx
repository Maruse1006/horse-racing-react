import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function BuyPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>買い目ページ</Text>
      <Button title="ホームに戻る" onPress={() => router.push("/")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

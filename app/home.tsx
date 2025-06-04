import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();  // Navigationの呼び出しを修正

  const menuItems = [
    { id: "1", title: "血統検索", icon: "📋", screen: "Blood" },
    { id: "2", title: "収支登録", icon: "📈", screen: "RaceSelection" },
    { id: "3", title: "レーシングカレンダー", icon: "📅" },
    { id: "4", title: "レース結果", icon: "🏆" },
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.screen) {
          // navigation.navigate(item.screen);
          navigation.navigate("MainStack", {
            screen: item.screen
          });
        }
      }}
    >
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/back.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>競馬ラボ</Text>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.menuContainer}
            scrollEnabled={false}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#008000",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  menuContainer: {
    flexGrow: 0,
    justifyContent: "space-between",
  },
  menuItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008000",
  },
});

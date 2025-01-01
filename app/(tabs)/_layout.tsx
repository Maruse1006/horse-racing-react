import React, { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity } from "react-native";

export default function Layout() {
  const [pedigreeData, setPedigreeData] = useState([]);

  // メニューのデータ
  const menuItems = [
    { id: "1", title: "血統検索", icon: "📋" },
    { id: "2", title: "収支登録", icon: "📈" },
    { id: "3", title: "レーシングカレンダー", icon: "📅" },
    { id: "4", title: "レース結果", icon: "🏆" },
  ];

  const renderMenuItem = ({ item }: { item: { title: string; icon: string } }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuIcon}>{item.icon}</Text>
      <Text style={styles.menuText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/back.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover" // 必要に応じて "contain" に変更
      >
        <View style={styles.content}>
          <Text style={styles.title}>中央競馬研究アプリ</Text>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            numColumns={2} // 2列で表示
            contentContainerStyle={styles.menuContainer}
            scrollEnabled={false} // スクロールを無効に設定
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1, // 画面全体を埋める
  },
  backgroundImage: {
    flex: 1,
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
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
    flexGrow: 0, // 高さを内容に合わせる
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

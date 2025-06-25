import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute} from "@react-navigation/native";

const options = [
  { id: "1", label: "フォーメーション", screen: "QuinellaFormation" },
  { id: "2", label: "ボックス",screen: "TrioBox" },
  { id: "3", label: "軸 1 頭流し",screen: "quinella_single_axis" },
];

export default function QuinellaBeddingType() {
  const navigation = useNavigation();
  const route = useRoute();
  const { year,round, place, race,dayCount } = route.params || {}; 
  React.useEffect(() => {
      console.log("Received parameters:", { dayCount, place, race });
    }, [dayCount, place, race]);

  const handlePress = (option) => {
  console.log(`選択されたオプション: ${option.label}`);
  console.log(`選択されたオプション: ${option.screen}`);
  if (option.screen) {
    navigation.navigate("MainStack", {
      screen: option.screen,
      params: {
        year,
        round,
        place,
        race,
        dayCount,
      },
    });
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>馬連式別</Text>
      <Text>選択した情報: 日付={dayCount}, 場所={place}, レース番号={race}</Text>
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.itemText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  title: {
    backgroundColor: "#228B22",
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const options = [
  { id: "1", label: "フォーメーション", screen: "ExactaFormation" },
  { id: "2", label: "ボックス", screen: "ExactaBox" },
  { id: "3", label: "軸 1 頭流し", screen: "ExactaSingleAxisScreen" },
];

export default function ExactaBeddingType() {
  const navigation = useNavigation();
  const route = useRoute();
  const { year, round, place, race, dayCount } = route.params || {};
  React.useEffect(() => {
    console.log("Received parameters:", { dayCount, place, race });
  }, [year, dayCount, place, race]);

  const handlePress = (option) => {
    console.log(`選択されたオプション: ${option.label}`);
    console.log(`選択されたオプション: ${option.screen}`);
    if (option.screen) {
      navigation.navigate(option.screen, {
        year,
        round,
        place,
        race,
        dayCount,
      });
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>馬単式別</Text>
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
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>戻る</Text>
      </TouchableOpacity>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: "right",
    fontSize: 16,
  },
  backButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  }



});

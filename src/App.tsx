import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 各画面をインポート
import RaceSelectionScreen from "../app/buy/index"; // ①のファイルをインポート
import BettingOptionsScreen from "../app/bettingTypePage";
import TrifectaBeddingType from "../app/trifecta/trifectaBeddingType";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RaceSelection">
        {/* レース選択画面 */}
        <Stack.Screen
          name="RaceSelection"
          component={RaceSelectionScreen}
          options={{ title: "レース選択" }}
        />
        {/* 式別画面 */}
        <Stack.Screen
          name="bettingTypePage"
          component={BettingOptionsScreen}
          options={{ title: "式別" }}
        />
        {/* 三連複画面 */}
        <Stack.Screen
          name="trifectaBeddingType"
          component={TrifectaBeddingType}
          options={{ title: "三連複" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

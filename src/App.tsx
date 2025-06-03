import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 各画面をインポート
import LoginScreen from "../app/login";
import Dashboard from "../app/dashboard";
import Blood from "../app/blood/index";
import RaceSelectionScreen from "../app/buy/index";
import WinBet from "../app/winBet";
import PlaceBet from "../app/placeBet";
import TrifectaBeddingType from "../app/trifecta/trifectaBeddingType";
import ExactaBeddingType from "../app/exacta_betting_type";
import wideQuinellaBettingType from "../app/wideQuinellaBettingType";
import TrioSecondKeyScreen from "../app/trifectaSecondKey";
import TrioThirdKeyScreen from "../app/trifectaThirdKey";
import TrioFirstKeyScreen from "../app/trifectaFirstkey";
import TrioBoxScreen from "../app/quinella_box";
import TricastBettingType from "../app/tricastFormation";
import TricastBeddingType from "../app/tricastBettingType";
import QuinellaSingleAxisScreen from "../app/quinella_single_axis";
import TrifectaBettingType from "../app/trifectaBettingType";
import QuinellaFormationScreen from "../app/quinella_formation_bet";
import ExactaBox from "../app/exacta_box";
import ExactaFormationScreen from "../app/exacta_formation";
import QuinellaBeddingType from "../app/quinellaBeddingType";
import BettingOptionsScreen from "../app/betting_type_page";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ StackNavigator（画面遷移用）※ヘッダーは表示しない
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RaceSelection" component={RaceSelectionScreen} />
      <Stack.Screen name="WinBet" component={WinBet} />
      <Stack.Screen name="PlaceBet" component={PlaceBet} />
      <Stack.Screen name="TrifectaBeddingType" component={TrifectaBeddingType} />
      <Stack.Screen name="ExactaBeddingType" component={ExactaBeddingType} />
      <Stack.Screen name="WideQuinella" component={wideQuinellaBettingType} />
      <Stack.Screen name="TrioSecondKey" component={TrioSecondKeyScreen} />
      <Stack.Screen name="TrioThirdKey" component={TrioThirdKeyScreen} />
      <Stack.Screen name="TrioFirstKey" component={TrioFirstKeyScreen} />
      <Stack.Screen name="TrioBox" component={TrioBoxScreen} />
      <Stack.Screen name="TricastBetting" component={TricastBettingType} />
      <Stack.Screen name="TricastBeddingType" component={TricastBeddingType} />
      <Stack.Screen name="QuinellaSingleAxis" component={QuinellaSingleAxisScreen} />
      <Stack.Screen name="TrifectaBettingType" component={TrifectaBettingType} />
      <Stack.Screen name="QuinellaFormation" component={QuinellaFormationScreen} />
      <Stack.Screen name="ExactaBox" component={ExactaBox} />
      <Stack.Screen name="ExactaFormation" component={ExactaFormationScreen} />
      <Stack.Screen name="QuinellaBeddingType" component={QuinellaBeddingType} />
      <Stack.Screen name="betting_type_page" component={BettingOptionsScreen} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="MainStack"
        screenOptions={{
          headerShown: true, // ← ヘッダー表示ON
          headerTitle: "メインメニュー", // ← ヘッダー中央のタイトル
          headerTitleAlign: "center", // ← 中央揃え
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "bold",
          },
          drawerType: "slide",
          drawerStyle: {
            width: 240,
            backgroundColor: "#fff",
          },
        }}
      >
        <Drawer.Screen
          name="MainStack"
          component={MainStack}
          options={{ title: "メインメニュー" }} // Drawerラベルにも表示
        />
        <Drawer.Screen
    name="Login"
    component={LoginScreen}
    options={{ title: "ログイン" }}
  />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

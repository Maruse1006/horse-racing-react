import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// 画面コンポーネントのインポート
import Register from "../app/register";
import Dashboard from "../app/dashboard";
import Home from "../app/home";
import LoginScreen from "../app/login";
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
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// ログイン後の画面をまとめたStack Navigator
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboad" component={Dashboard} />
      <Stack.Screen name="Blood" component={Blood} />
      <Stack.Screen name="Home" component={Home} />
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

// ログイン済みのDrawer構成
function LoggedInDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerStyle: {
          width: 240,
          backgroundColor: "#fff",
        },
        headerTitleAlign: "center",
        headerTitle: "horse",
        headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} options={{ title: "メインメニュー" }} />
      <Drawer.Screen name="Home" component={Home} options={{ title: "ホーム" }} />
    </Drawer.Navigator>
  );
}

// 未ログイン時のDrawer構成
function AuthDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerStyle: {
          width: 240,
          backgroundColor: "#fff",
        },
        headerTitleAlign: "center",
        headerTitle: "horse",
        headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
      }}
    >
      <Drawer.Screen name="Login" component={LoginScreen} options={{ title: "ログイン" }} />
      <Drawer.Screen name="Register" component={Register} options={{ title: "登録" }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    // ローディング中は画面を表示しない
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInDrawer /> : <AuthDrawer />}
    </NavigationContainer>
  );
}

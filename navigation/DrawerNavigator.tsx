import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Layout from "../src/Layout";  // パスを適宜修正
import RaceSelectionScreen from "../app/buy";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Layout} />
        <Drawer.Screen name="Race Selection" component={RaceSelectionScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

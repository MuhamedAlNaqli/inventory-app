import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {

  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#FAFAF9" },
          headerTitleStyle: { color: "#0C0A09", fontWeight: "600" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#FAFAF9" },
        }}
        initialRouteName="login"
      >
        <Stack.Screen name="inventory/index" options={{ title: "Inventories" }} />
        <Stack.Screen
          name="inventory/new"
          options={{ title: "New inventory", presentation: "modal" }}
        />
        <Stack.Screen
          name="inventory/[id]/index"
          options={{ title: "Inventory" }}
        />
        <Stack.Screen
          name="inventory/[id]/edit"
          options={{ title: "Edit inventory", presentation: "modal" }}
        />
        <Stack.Screen
          name="inventory/[id]/item/new"
          options={{ title: "New item", presentation: "modal" }}
        />
        <Stack.Screen
          name="inventory/[id]/item/[itemId]"
          options={{ title: "Edit item", presentation: "modal" }}
        />
        <Stack.Screen
          name="login"
          options={{headerShown: false}}
          />
      </Stack>
    </>
  );
}
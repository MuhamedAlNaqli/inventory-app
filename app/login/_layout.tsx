import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Stack } from 'expo-router'

export default function RootLayout() {

  return (
    <View style={{ flex: 1 }}>
        <Stack screenOptions={{
        headerStyle: { backgroundColor: "#FAFAF9" },
        headerTitleStyle: { color: "#0C0A09", fontWeight: "600" },
        headerShadowVisible: false,
        contentStyle: { 
            backgroundColor: "#FAFAF9",
            paddingLeft: 16,
            paddingRight: 16,
         },
        }}>
            <Stack.Screen name="index" options={{ title: "Login" }} />
        </Stack>
    </View>
  )
}

const styles = StyleSheet.create({})
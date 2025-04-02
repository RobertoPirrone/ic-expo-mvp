import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import LoggedIn from "../../auth/LoggedIn";
import LoggedOut from "../../auth/LoggedOut";
import { styles } from "../../auth/Styles";
import { useAuth } from "../../auth/useAuth";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({ duration: 1000, fade: true, });

export default function TabLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { identity, isReady, logout } = useAuth();

  useEffect(() => {
    if (identity)
      setIsLoggedIn(true);
    else
      setIsLoggedIn(false);
  }, [identity]);

  if (!isReady) return null;
  SplashScreen.hide();

  return isLoggedIn ? (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      />
    </Tabs>
  ) : (
    <LoggedOut />
  );
}

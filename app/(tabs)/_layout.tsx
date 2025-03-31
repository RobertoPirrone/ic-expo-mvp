import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import LoggedIn from "../../components/LoggedIn";
import LoggedOut from "../../components/LoggedOut";
import { styles } from "../../components/Styles";
import { useAuth } from "../../hooks/useAuth";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({ duration: 1000, fade: true, });

export default function TabLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const value = useAuth();
  console.log("index useAuth(): ", value);
  const { identity, isReady, logout } = useAuth();

  const triggerLogout = () => {
    setIsLoggedIn(false);
    logout();
  };

  useEffect(() => {
    if (identity) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [identity]);

  console.log("TabLayout isReady: ", isReady);
  if (!isReady) return null;
  SplashScreen.hide();
  console.log("TabLayout isLoggedIn: ", isLoggedIn);
  console.log("TabLayout identity: ", identity);

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

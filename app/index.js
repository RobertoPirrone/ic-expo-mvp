import "react-native-get-random-values";
import "react-native-polyfill-globals/auto";
import * as SplashScreen from 'expo-splash-screen';
globalThis.TextEncoder = TextEncoder;
window.TextEncoder = TextEncoder;
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TextEncoder } from "text-encoding";
import LoggedOut from "../components/LoggedOut";
import LoggedIn from "../components/LoggedIn";
import { useAuth } from "../hooks/useAuth";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({ duration: 1000, fade: true, });


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { identity, isReady, logout } = useAuth();

  const triggerLogout = () => {
    setIsLoggedIn(false);
    logout();
  };

  useEffect(() => {
    if (identity) {
      setIsLoggedIn(true);
    }
  }, [identity]);

  if (!isReady) return null;
  SplashScreen.hide();

  return (
    <View style={styles.container} accessible={true}>
      {isLoggedIn ? <LoggedIn logout={triggerLogout} /> : <LoggedOut />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;

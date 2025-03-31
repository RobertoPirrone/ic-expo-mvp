import React from "react";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { baseTextStyles, buttonStyles, buttonTextStyles, containerStyles, disabledButtonStyles, headerStyles, subheaderStyles } from "./KaiaStyles";

import { Principal } from "@dfinity/principal";
function LoggedIn({ logout }) {
  const { backendActor, hostPath, whoami } = useAuth();
  const [principal, setPrincipal] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const whoamiFromBackend = async () => {
    if (!backendActor) return;
    const response = await backendActor.whoami();
    return response;
  };

  return (
    <View style={containerStyles}>
      <>
        <Text style={headerStyles}>Hi everyone!</Text>
        <Text style={subheaderStyles}>You are authenticated!</Text>
        <Text style={baseTextStyles}>URI {hostPath} </Text>
        <Text style={baseTextStyles}>To see how a canister views you, click this button!</Text>
        <Pressable
          style={busy ? disabledButtonStyles : buttonStyles}
          accessibilityRole="button"
          disabled={busy}
          accessibilityState={{ busy }}
          title="whoami"
          onPress={() => {
            setBusy(true);
            whoamiFromBackend().then((principal) => {
              setPrincipal(Principal.from(principal).toString());
              setBusy(false);
            });
          }}
        >
          <Text style={buttonTextStyles}>whoami</Text>
        </Pressable>
        {principal && whoami && (
          <Text style={baseTextStyles}>
            Principal: {principal}, from useAuth: {whoami}{" "}
          </Text>
        )}
        <Pressable
          title="logout"
          style={busy ? disabledButtonStyles : buttonStyles}
          accessibilityRole="button"
          disabled={busy}
          accessibilityState={{ busy }}
          onPress={() => {
            logout();
          }}
        >
          <Text style={buttonTextStyles}>Log out</Text>
        </Pressable>
      </>
    </View>
  );
}

export default LoggedIn;

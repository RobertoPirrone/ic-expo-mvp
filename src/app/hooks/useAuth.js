/*
 * hides all the II setup phase
 * imports idl definitions from the backend declarations directory
 * canisterId instead is derived from the expo environment, the declarations value is based on process.env
 * application code will be given, among other things, an Actor
 * @example
 * import { useAuth } from "../hooks/useAuth";
 * const { backendActor, whoami} = useAuth();
 * 
 **/

import { useState, useEffect } from "react";
import { toHex } from "@dfinity/agent";
import {
  Ed25519KeyIdentity,
  DelegationChain,
  DelegationIdentity,
  isDelegationValid,
} from "@dfinity/identity";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { blsVerify } from "@dfinity/bls-verify";
import * as WebBrowser from "expo-web-browser";
import { useURL } from "expo-linking";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { canisterId, idlFactory } from "../../declarations/backend";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export function useAuth() {
  const [baseKey, setBaseKey] = useState();
  const [isReady, setIsReady] = useState(false);
  const [backendActor, setBackendActor] = useState(null);
  const [whoami, setWhoami] = useState(null);
  const url = useURL();
  /**
   * @type {[DelegationIdentity | null, React.Dispatch<DelegationIdentity | null>]} state
   */
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    (async () => {
      const storedKey = await SecureStore.getItemAsync("baseKey");
      if (storedKey) {
        setBaseKey(Ed25519KeyIdentity.fromJSON(storedKey));
      } else {
        if (Platform.OS === "ios")  {
          const key = Ed25519KeyIdentity.generate(null);
      } else {
          // seed needed on Android 
          const seed = new Uint8Array(new Array(32).fill(0));
          const key = Ed25519KeyIdentity.generate(seed);
        }
        setBaseKey(key);
        await save("baseKey", JSON.stringify(key.toJSON()));
      }

      const storedDelegation = await AsyncStorage.getItem("delegation");
      if (storedDelegation) {
        const chain = DelegationChain.fromJSON(JSON.parse(storedDelegation));
        if (isDelegationValid(chain)) {
          const id = new DelegationIdentity(
            Ed25519KeyIdentity.fromJSON(storedKey),
            DelegationChain.fromJSON(JSON.parse(storedDelegation))
          );
          setIdentity(id);
        } else {
          await SecureStore.deleteItemAsync("delegation");
        }
      }
      setIsReady(true);
    })();
  }, []);

  useEffect(() => {
    // If we have an identity, we don't need to do anything
    if (identity) return;

    const search = new URLSearchParams(url?.split("?")[1]);
    const delegation = search.get("delegation");
    if (delegation) {
      const chain = DelegationChain.fromJSON(
        JSON.parse(decodeURIComponent(delegation))
      );
      AsyncStorage.setItem("delegation", JSON.stringify(chain.toJSON()));
      /**
       * @type {DelegationIdentity}
       */
      const id = DelegationIdentity.fromDelegation(baseKey, chain);
      setIdentity(id);

      WebBrowser.dismissBrowser();
    }
  }, [url]);

  useEffect(() => {
    if (!identity) return;
    if (backendActor) return;
    // delegation ok, ready to build the agent and then the actor
    const agent = new HttpAgent({
      identity,
      host: "https://icp-api.io",
      fetchOptions: {
        reactNative: {
          __nativeResponseType: "base64",
        },
      },
      blsVerify,
      verifyQuerySignatures: true,
      callOptions: {
        reactNative: {
          textStreaming: true,
        },
      },
    });
    const old_idlFactory = ({ IDL }) => {
      return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ["query"]) });
    };
      console.log("canisterId:", canisterId);
      console.log("canisterId EXPO_PUBLIC_BACKEND_ID :", process.env.EXPO_PUBLIC_BACKEND_ID);
    const actor = Actor.createActor(idlFactory, {
      agent,
      // canisterId: "ivcos-eqaaa-aaaab-qablq-cai",
      canisterId: process.env.EXPO_PUBLIC_BACKEND_ID,
    });
      setBackendActor(actor);
      const principal = identity.getPrincipal();
      setWhoami(principal.toText());
      console.log("whoami useAuth:", principal.toText());
  }, [identity]);


  // Function to handle login and update identity based on base key
  const login = async () => {
    const derKey = toHex(baseKey.getPublicKey().toDer());
    // const url = new URL("https://tdpaj-biaaa-aaaab-qaijq-cai.icp0.io/");
    const url = new URL(process.env.EXPO_PUBLIC_II_INTEGRATION_URL);
    // url.searchParams.set("redirect_uri", encodeURIComponent(redirect));
    url.searchParams.set(
      "redirect_uri",
      // encodeURIComponent(`com.anonymous.ic-expo://expo-development-client`)
      encodeURIComponent(process.env.EXPO_PUBLIC_DEEP_LINK)
    );

    url.searchParams.set("pubkey", derKey);
    return await WebBrowser.openBrowserAsync(url.toString());
  };

  // Clear identity on logout
  const logout = async () => {
    setIdentity(null);
    await AsyncStorage.removeItem("delegation");
  };

  return {
    baseKey,
    setBaseKey,
    identity,
    isReady,
    login,
    logout,
    whoami,
    backendActor
  };
};

export default useAuth;

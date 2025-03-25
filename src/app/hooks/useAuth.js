/*
 * hides all the II setup phase
 * imports idl definitions from the backend declarations directory
 * canisterId instead is derived from the expo environment, the declarations value is based on process.env
 * basically the first two useEffect() will compute the key and the deepLink
 * login() will call the II_integration Web page, with the above variables in the search string
 * the third useEffect 
 * the caller code will be given, among other things, an Actor
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
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { canisterId, idlFactory } from "../../declarations/whoami";

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

  // we can already have a key in the Storage, otherwise get it
  useEffect(() => {
    if (identity) return;
    (async () => {
        let key = null;
        let storedKey = null;
        // getItemAsync may crash on reinstall
        try {
          storedKey = await SecureStore.getItemAsync('baseKey');
        } catch (e) {
          console.error("deleting secureStore baseKey");
          await SecureStore.deleteItemAsync('baseKey');
        }
        if (storedKey) {
          console.error("storedKey null ,setBaseKey");
          setBaseKey(Ed25519KeyIdentity.fromJSON(storedKey));
        } else {
          // generate() without a seed hangs
          const seed = new Uint8Array(new Array(32).fill(0));
          key = Ed25519KeyIdentity.generate(seed);
          console.log("useEffect setBaseKey:", JSON.stringify(key));
          setBaseKey(key);
          await save("baseKey", JSON.stringify(key.toJSON()));
        }
        const storedDelegation = await AsyncStorage.getItem("delegation");

      // a valid delegation can be used to set the identity
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
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.EXPO_PUBLIC_BACKEND_ID,
    });
      setBackendActor(actor);
      const principal = identity.getPrincipal();
      setWhoami(principal.toText());
      console.log("whoami useAuth:", principal.toText());
  }, [identity]);


  // after the II phase, ii_integration will redirect to the deeplink URI, inside the app, that may vary
  const getDeepLink = () => {
      let deepLink = "";
      //production/release
      if (Constants.executionEnvironment === ExecutionEnvironment.Standalone) {
        // scheme does not work, use platform variables instead
        deepLink = `${Constants.expoConfig.scheme}://`;
        if (Platform.OS === "ios")
          deepLink = `${Constants.ios.bundleIdentifier}://`;
          else
          deepLink = `${Constants.android.package}://`;

      } else
        // expo go, development build, usually "exp://127.0.0.1:8081/--/"
        deepLink = process.env.EXPO_PUBLIC_DEEP_LINK;

      return deepLink;
  }

  // Function to handle login and update identity based on base key:
  // Opens the II_integration Web page, that will interact with II
  // the actual Web URL will contain the redirect address (deep link) to go back to the app
  const login = async () => {
    // Object.entries(Constants).forEach((e) => { console.log(e); });
    const derKey = toHex(baseKey.getPublicKey().toDer());
    // const url = new URL("https://tdpaj-biaaa-aaaab-qaijq-cai.icp0.io/");
    const url = new URL(process.env.EXPO_PUBLIC_II_INTEGRATION_URL);
    console.log("login2, scheme: ",Constants.expoConfig.scheme);
    let deepLink = getDeepLink();
    url.searchParams.set( "redirect_uri", encodeURIComponent(deepLink));
    console.log("login deepLink: ", deepLink);
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

# Welcome to your Expo app 👋

Changes to Kaia's repo needed for Expo SDK52 (cli 0.22.20)

This repo is still in its early stage, tested only on the iOS simulator. 

No changes to the canisters stuff, I use the ones provided by Kaia

Basically:
- updated package versions
- the content of App.js now is src/app/index.tsx
- the URL of the deep link contains the string *redirect*, so a redirect.tsx is needed under src/app
- deep link URL is taken from the environment (EXPO_PUBLIC_DEEP_LINK)
- I used Expo Go, so the deep link url has a *exp:* scheme: exp://127.0.0.1:8081/--/

## Get started

1. Install dependencies (both standard expo stuff and the IC libraries), and build the ios and android environment

   ```bash
   npm install
   expo prebuild
   ```

2. Start the app in Expo Go

   ```bash
    npx expo start
   ```

    type "i" for the iOS emulator, or "a" for Android (or point the QR code from a real device)
    
    On the iOS Simulator the fingerprint is under *Features/TouchId*, you may need to deselect and select again the *Enrolled* entry, then you can use the *Matching Touch* entry

3. Production builds

    Follow the usual steps (either EAS or XCode/ bundletool) for building and publishing of a Release package

    Local Build in production mode (w/o signing):

   ```bash
    expo run:android --variant release # https://docs.expo.dev/more/expo-cli/#compiling-android
    expo run:ios --configuration Release # https://docs.expo.dev/more/expo-cli/#compiling-ios
   ```

    Example for EAS:

   ```bash
    eas login
    eas init
    eas build:configure
    eas build # Answer All for both platforms)
    eas submit --platform ios 


   ```


## Deep Link

After the Authentication phase, control is transfered back to the mobile app, using a **Deep Link**. This kind of link changes from development to production. 

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Dfinity forum post](https://forum.dfinity.org/t/internet-identity-with-react-native/15682): News about the II on React Native
- [Kaia Peacock blog](https://kaipeacock.com/blog/dfinity/ic-expo/): Kaia Peacock blog post about his POC
- [Kaia Peacock MVP Code](https://github.com/krpeacock/ic-expo-mvp): Kaia Peacock Code on GitHub
- [Deep Link](https://docs.expo.dev/linking/into-your-app/#test-a-link-using-expo-go): Deep Links in Expo
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


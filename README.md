# Welcome to your Expo app 👋

Changes to Kaia's repo needed for Expo SDK52 (cli 0.22.20)

This repo is still in its early stage, but has been used in *Expo Go* and as a real app, iOS and Android.

Changes are only on the React Native code, there are no changes to the canisters stuff, I use the ones provided by Kaia

Basically:
- updated package versions
- the content of App.js now is src/app/index.tsx
- the URL of the deep link contains the string *redirect*, so a redirect.tsx is needed under src/app
- deep link URL is taken from the environment (EXPO_PUBLIC_DEEP_LINK, should be "exp://127.0.0.1:8081/--/") for *Expo go*, or from the *scheme* variable in production builds
- Standard Expo/ React Native Directory structure
- Internet Computer stuff moved in a separate directory

## Get started

1. Install dependencies (both standard expo stuff and the IC libraries)

   ```bash
   npm install
   ```

2. Create icons

You may have a almost square image that you want to use both for the splashscreen (that need the the white converted in alpha channel) and for the app icon (no alpha)
   ```bash
   magick almost_square.png -resize 1024x1024! icon.png
   magick logo.png  -transparent  white splash-icon.png
   mkdir -p assets/images
   mv icon.png splash-icon.png assets/images
   ``
`
3. Start the app in Expo Go

   ```bash
    npx expo start
   ```
    Type "i" for the iOS emulator, or "a" for Android (or point the QR code from a real device)
    
    The fastest way to try the code is to run in *Expo Go*, no compilation required. If you added the package *expo-dev-client*, remember to type **s** to switch from devel server to Expo Go
    
    On the iOS Simulator the fingerprint is under *Features/TouchId*, you may need to deselect and select again the *Enrolled* entry, then you can use the *Matching Touch* entry

4. Production builds

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

5. Run a production build (iOS)

You can either use TestFlight or you can also compile locally and install on a specific device (choosing from a list):

   ```bash
    expo run:ios --configuration Release --device
   ```

6. Run a production build (Android)

If you want to try a build on a given device, without using the play store, you can use bundletool (brew install bundletool). download the .aab file produced by *expo build*, and run:

   ```bash
    bundletool build-apks --bundle=app-release.aab --output=app-release.apks
    bundletool install-apks --apks=app-release.apks --device-id=ZY224GSPM9
   ```

# How it works

This is a Expo application. With the help of some dfinity libraries, the JS code will interact with the Internet Identity auth and backend containers. II cannot be accessed directly from the React Native code, we use a Web container acting as a proxy, that will receive a Ed25519 key, and produce a a *delegation*

After the Authentication phase, control is transfered back to the mobile app, using a **Deep Link**. This kind of link changes from development to production. 

The **declarations** directory will hold the backend interface (i.e. the files created by *dfx generate*), that are used by the hook (useAuth) to give an *Actor* able to interact with the backend canisters

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Dfinity forum post](https://forum.dfinity.org/t/internet-identity-with-react-native/15682): News about the II on React Native
- [Kaia Peacock blog](https://kaipeacock.com/blog/dfinity/ic-expo/): Kaia Peacock blog post about his POC
- [Kaia Peacock MVP Code](https://github.com/krpeacock/ic-expo-mvp): Kaia Peacock Code on GitHub
- [Deep Link](https://docs.expo.dev/linking/into-your-app/#test-a-link-using-expo-go): Deep Links in Expo
- [Expo Authentication](https://docs.expo.dev/router/advanced/authentication/): Auth in Expo
- [Expo Tabbed Navigation](https://docs.expo.dev/router/advanced/tabs/): Tab Bar at the Bottom 
- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


# Welcome to your Expo app 👋

Starting from a clean, up to date [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app), we have integrated the Internet Identity MVP developed by Kaia Peacock

This repo is a first attempt, still in its early stage, tested only on a simulator


## Get started

1. Install dependencies (both standard expo stuff and the IC libraries)

   ```bash
   npm install
   bash add_extra_packages.sh
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Get a fresh project

If you see a proper expo demo app in the simulator, you can clean the code, 

```bash
npm run reset-project
git add app-example
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.


## Integrate the MVP code

The code from the GitHub repo contains both the canister related stuff (ii_integration, identity canister, backend canister implementing a whoami call) and the React Native Code (under src/app). As a first step I took andantage of the existing MainNet canisters for Internet Identity and II_integration), and simply adapted the RN code to the current Expo standards:
    * *App.js* renamed to *src/app/index.tsx*
    * directories *components* and *hooks* in src/app
    * changed a few hardwired strings in the code using the EXPO_PUBLIC_* variables in .env

## Deep Link

After the Authentication phase, control is transeffered back to the mobile app, using a **Deep Link**. This kind of link changes from development to production. 

## Run the MVP

It has been tested only with the iOS Simulator, using *Expo Go*, so the deep link must follow the *exp:27.0.0.1:8081* scheme

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


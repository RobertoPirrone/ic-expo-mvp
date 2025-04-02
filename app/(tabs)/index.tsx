import { Redirect } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import LoggedIn from "../../auth/LoggedIn";
import { styles } from "../../auth/Styles";
import { useAuth } from "../../auth/useAuth";

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <LoggedIn logout={logout} />
    </SafeAreaView>
  );
}

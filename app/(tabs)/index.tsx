import { Redirect } from "expo-router";
import { SafeAreaView, Text } from "react-native";
import LoggedIn from "../../components/LoggedIn";
import { styles } from "../../components/Styles";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { logout } = useAuth();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <LoggedIn logout={logout} />
    </SafeAreaView>
  );
}

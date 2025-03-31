import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView, Text } from "react-native";
import { Collapsible } from "../..//components/Collapsible";
import { styles } from "../../components/Styles";

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Collapsible title="File-based routing">
        <Text>This app has two screens</Text>
      </Collapsible>
    </SafeAreaView>
  );
}

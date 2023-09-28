import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { RootStackParamList } from "../../types/routes";

const LandingScreen = (
  props: NativeStackScreenProps<RootStackParamList, "landing">
) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 24,
        flex: 1,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", marginRight: 32 }}>
        <Text
          variant="headlineSmall"
          style={{ color: theme.colors.onPrimaryContainer, marginBottom: 8 }}
        >
          Selamat Datang di
        </Text>
        <Image
          source={require("../../../assets/KasirPOP-primary.png")}
          style={{ marginBottom: 40 }}
        />
        <Text
          variant="bodyLarge"
          style={{ color: theme.colors.onPrimaryContainer, marginBottom: 40 }}
        >
          Untuk lanjut menggunakan aplikasi ini, harap mengisi informasi toko
          Anda terlebih dahulu.
        </Text>
        <Button
          mode="contained"
          style={{ alignSelf: "flex-start" }}
          onPress={() => props.navigation.replace("initialSetup")}
        >
          Isi Informasi Toko
        </Button>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          flex: 1,
          borderRadius: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../../assets/Landing-1.png")}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default LandingScreen;

import {
  Image,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Button, Card, MD3Theme, Text, useTheme } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";

const placeholderImage = require("../../assets/image-placeholder.png");

type InputImagePickerProp = {
  imgUri?: string | null;
  onRemoveImage: () => void;
  onSelectImage: (uri: string) => void;
  resize: { width: number; height: number };
  base64?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  saveFormat?: SaveFormat.JPEG | SaveFormat.PNG;
  allowsEditing?: boolean;
};
const InputImagePicker = ({
  imgUri,
  onRemoveImage,
  onSelectImage,
  resize,
  base64 = false,
  style,
  contentStyle,
  saveFormat = SaveFormat.JPEG,
}: InputImagePickerProp) => {
  const theme = useTheme();
  const displayedImage = imgUri ? { uri: imgUri } : placeholderImage;

  const pickImage = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: Platform.OS == "ios" ? false : true,
      aspect: [resize.width, resize.height],
    });

    if (!result.cancelled) {
      const processedImg = await manipulateAsync(result.uri, [{ resize }], {
        base64: base64,
        format: saveFormat,
      });

      const uri = base64
        ? `data:image/jpeg;base64,${processedImg.base64}`
        : processedImg.uri;

      onSelectImage(uri);
    }
  }, [onSelectImage]);

  return (
    <Card
      mode="outlined"
      style={[styles(theme).card, style]}
      contentStyle={[styles(theme).cardContent, contentStyle]}
    >
      <View style={styles(theme).leftContainer}>
        <Image source={displayedImage} style={styles(theme).displayImage} />
        <Text variant="bodySmall" style={styles(theme).label}>
          {imgUri ? "Gambar berhasil dipilih" : "Belum ada gambar terpilih"}
        </Text>
      </View>
      {imgUri ? (
        <Button
          mode="text"
          icon={"trash-can-outline"}
          onPress={onRemoveImage}
          textColor={theme.colors.error}
        >
          Hapus Foto
        </Button>
      ) : (
        <Button mode="text" icon={"plus"} onPress={pickImage}>
          Unggah Foto
        </Button>
      )}
    </Card>
  );
};

export default InputImagePicker;

const styles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: { borderRadius: 4, backgroundColor: "transparent" },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
    },
    leftContainer: { flexDirection: "row", alignItems: "center" },
    displayImage: { width: 56, height: 56 },
    label: { marginLeft: 8 },
  });

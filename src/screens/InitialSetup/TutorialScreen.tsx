import { useRef, useState } from "react";
import { Dimensions, Image, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import Row from "../../components/Row";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/routes";
import { ScrollView } from "react-native-gesture-handler";

const TutorialScreen = (
  props: NativeStackScreenProps<RootStackParamList, "tutorial">
) => {
  const data = [
    {
      image: require("../../../assets/Tutorial-1.png"),
      description: "1. Tambahkan Barang di Inventori",
    },
    {
      image: require("../../../assets/Tutorial-2.png"),
      description: "2. Hubungkan printer dan atur struk di Pengaturan",
    },
    {
      image: require("../../../assets/Tutorial-3.png"),
      description: "3. Lakukan transaksi di Kasir",
    },
    {
      image: require("../../../assets/Tutorial-4.png"),
      description: "4. Lihat pendapatan di Riwayat Transaksi",
    },
  ];
  const width = Dimensions.get("window").width;
  const carouselRef = useRef<ICarouselInstance>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingHorizontal: 32,
        paddingBottom: 32,
      }}
    >
      <Carousel
        ref={carouselRef}
        loop={false}
        width={width}
        height={width / 2}
        data={data}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={item.image}
              resizeMode="contain"
              style={{ height: "85%", marginBottom: 16 }}
            />
            <Text variant="headlineSmall" style={{ textAlign: "center" }}>
              {item.description}
            </Text>
          </View>
        )}
      />
      <Row style={{ justifyContent: "space-between" }}>
        <Button
          mode="outlined"
          onPress={() => {
            carouselRef.current?.prev();
            setCurrentIndex((state) => state - 1);
          }}
          style={[
            currentIndex == 0 && { opacity: 0 },
            { alignSelf: "flex-start" },
          ]}
          disabled={currentIndex == 0}
        >
          Kembali
        </Button>
        <Button
          mode="contained"
          onPress={() => {
            if (currentIndex == data.length - 1) {
              props.navigation.replace("home");
            } else {
              carouselRef.current?.next();
              setCurrentIndex((state) => state + 1);
            }
          }}
          style={{ alignSelf: "center" }}
        >
          {currentIndex == data.length - 1 ? "Selesai Tutorial" : "Selanjutnya"}
        </Button>
      </Row>
    </ScrollView>
  );
};

export default TutorialScreen;

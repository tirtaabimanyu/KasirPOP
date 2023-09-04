import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

interface AsyncStorageData {
  key: string;
  value: any;
}

export default function Page() {
  const [activeProfile, setActiveProfile] = useState<string>("");
  const [newProfile, setNewProfile] = useState<string>("");
  const [profiles, setProfiles] = useState<string[]>([]);

  const createProfile = useCallback(async () => {
    const newData = {
      key: "profiles",
      value: [...profiles, newProfile],
    };
    await storeData(newData);
    setProfiles(newData.value);
    setNewProfile("");
  }, [newProfile]);

  const storeData = async (data: AsyncStorageData) => {
    try {
      const jsonValue = JSON.stringify(data.value);
      await AsyncStorage.setItem(data.key, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData("profiles").then((profiles) => {
      profiles ??= [];
      setProfiles(profiles);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.newTodoContainer}>
        <TextInput
          style={styles.newTodoInput}
          value={newProfile}
          onChangeText={(e) => setNewProfile(e)}
        />
        <Button color={"red"} title="Create" onPress={createProfile} />
      </View>
      <View style={styles.todosContainer}>
        {profiles.map((profile, idx) => (
          <Text key={idx}>{profile}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },

  newTodoContainer: {},

  newTodoInput: {
    height: 48,
    marginBottom: 20,

    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#aaa",

    paddingHorizontal: 16,

    fontSize: 20,
  },

  todosContainer: {
    flex: 1,
  },

  button: {
    backgroundColor: "red",
  },
});

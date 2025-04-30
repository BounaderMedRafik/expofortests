import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export type User = {
  uuid: string;
  name: string;
  age: string;
  email: string;
  password: string;
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    uuid: "",
    name: "",
    age: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await SecureStore.getItemAsync("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Navigate to login page if no session
          router.replace("/");
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
  }, []);

  const handleSignOut = async () => {
    try {
      // Remove the user data from SecureStore
      await SecureStore.deleteItemAsync("user");

      // Navigate to login page after sign out
      router.replace("/");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user.name}!</Text>
      <Text>Email: {user.email}</Text>
      <Text>Age: {user.age}</Text>

      {/* Sign Out Button */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  signOutButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

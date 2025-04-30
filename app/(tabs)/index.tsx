import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { checkForUserInDB } from "@/hooks/auth/useCheckForUserInDB";
import { signUpUser } from "@/hooks/auth/signUpUser";
import { loginUser } from "@/hooks/auth/useLoginUser";

export default function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Function to check for saved session
  const checkForUserSession = async () => {
    try {
      const userData = await SecureStore.getItemAsync("user");
      if (userData) {
        const user = JSON.parse(userData);
        router.replace({
          //@ts-ignore
          pathname: "profile",
          params: { user },
        });
      }
    } catch (err) {
      console.error("Error checking user session:", err);
    }
  };

  useEffect(() => {
    checkForUserSession(); // Check if the user is already logged in on app load
  }, []);

  const handleAuth = async () => {
    if (!email || !password || (isSignup && (!name || !age))) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userExists = await checkForUserInDB(email);

      if (isSignup) {
        if (userExists) {
          Alert.alert("User already exists", "Try logging in instead.");
          return;
        }

        await signUpUser({ name, age, email, password });

        Alert.alert("Signed up successfully", "You can now log in.");
        setIsSignup(false);
        setName("");
        setAge("");
        setPassword("");
      } else {
        if (!userExists) {
          Alert.alert("User not found", "Please sign up first.");
          return;
        }

        const user = await loginUser({ email, password });

        Alert.alert(
          "Login successful",
          `Welcome ${user.name}!\nEmail: ${user.email}\nAge: ${user.age}`
        );

        // Save user data in SecureStore
        await SecureStore.setItemAsync("user", JSON.stringify(user));

        // Navigate to Profile screen and pass user data
        router.replace({
          //@ts-ignore
          pathname: "profile",
          params: { user },
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        style={styles.logo}
      />

      <View style={styles.form}>
        {isSignup && (
          <>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Age"
              value={age}
              onChangeText={setAge}
              style={styles.input}
              keyboardType="numeric"
            />
          </>
        )}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.toggleText}>
            {isSignup
              ? "Already have an account? Log in"
              : "Don't have an account sir? Sign up"}
          </Text>
        </TouchableOpacity>

        {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 32,
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleText: {
    color: "#007AFF",
    marginTop: 8,
  },
});

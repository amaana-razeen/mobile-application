import axios from "axios";
import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const BASE_URL = "http://192.168.8.131:5000";

export default function SendNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const sendNotification = async () => {
    try {
      await axios.post(`${BASE_URL}/notifications`, {
        title,
        message,
      });

      Alert.alert("Success", "Notification sent.");

      setTitle("");
      setMessage("");
    } catch (error) {
      Alert.alert("Error", "Failed to send notification.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Notification Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Notification Message"
        value={message}
        onChangeText={setMessage}
        style={[styles.input, { height: 120 }]}
        multiline
      />

      <Button
        title="Send Notification"
        onPress={sendNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
});
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import useNotesStore from "../store/noteStore"; 
import useAuthStore from "../store/authStore";

export default function CreateNoteScreen() {
  const addNote = useNotesStore((s) => s.addNote);
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const save = async () => {
    if (!user) {
      alert("No user");
      return;
    }
    await addNote(user.id, { title, body, imageUri });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create note</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Body" value={body} onChangeText={setBody} style={[styles.input, styles.textarea]} multiline />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.img} /> : null}
      <TouchableOpacity onPress={pickImage} style={styles.btn}><Text style={styles.btnText}>Pick image</Text></TouchableOpacity>
      <TouchableOpacity onPress={save} style={[styles.btn, styles.saveBtn]}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  input: { padding: 12, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 8, marginBottom: 12, backgroundColor: "#fff" },
  textarea: { height: 120, textAlignVertical: "top" },
  img: { height: 180, width: "100%", borderRadius: 8, marginBottom: 12 },
  btn: { padding: 12, backgroundColor: "#444", borderRadius: 8, alignItems: "center", marginBottom: 8 },
  btnText: { color: "#fff" },
  saveBtn: { backgroundColor: "#0b8f6b" },
});

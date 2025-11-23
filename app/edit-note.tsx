// app/edit-note.tsx
// Simple edit screen that loads note by id from notes store, allows editing & saving.

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useNotesStore from "../store/noteStore";
import useAuthStore from "../store/authStore";

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams(); // params: ?id=<noteId>
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const notes = useNotesStore((s) => s.notes);
  const updateNote = useNotesStore((s) => s.updateNote);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    const note = notes.find((n) => n.id === (id as string));
    if (note) {
      setTitle(note.title);
      setBody(note.body);
      setImageUri(note.imageUri ?? null);
    }
    setLoaded(true);
  }, [id, user, notes]);

  const onSave = async () => {
    if (!user || !id) return;
    // note shape requires id + timestamps are handled by store
    await updateNote(user.id, {
      id: id as string,
      title,
      body,
      imageUri,
      createdAt: Date.now(),   // updateNote ignores createdAt but the type expects it; store uses existing createdAt
      updatedAt: Date.now(),
    } as any); // small type relaxation; store will copy fields and override updatedAt
    router.back();
  };

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit note</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Body" value={body} onChangeText={setBody} style={[styles.input, styles.textarea]} multiline />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.img} /> : null}
      <TouchableOpacity onPress={onSave} style={[styles.btn, styles.saveBtn]}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
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
  saveBtn: { backgroundColor: "#0b8f6b" },
  btnText: { color: "#fff" },
});

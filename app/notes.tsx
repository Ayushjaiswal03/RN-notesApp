// app/notes.tsx
// Notes list screen: shows current user's notes, with search & sort.
// Allows navigation to create/edit (create/edit screens are not included in this set
// but you can create them similarly to the patterns used earlier).

import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "../store/authStore";
import useNotesStore, { Note } from "../store/noteStore";
import Card from "../components/Card";
import Colors from "../constants/colors";
import Spacing from "../constants/spacing";

// sort modes
type SortMode = "updated_desc" | "updated_asc" | "title_asc" | "title_desc";

export default function NotesScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);           // current user
  const loadNotes = useNotesStore((s) => s.loadNotesForUser);
  const notes = useNotesStore((s) => s.notes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const loading = useNotesStore((s) => s.loading);
  const logout = useAuthStore((s) => s.logout);

  const [query, setQuery] = useState("");             // search query
  const [sortMode, setSortMode] = useState<SortMode>("updated_desc"); // default sort

  // load notes when user becomes available
  useEffect(() => {
    if (user) loadNotes(user.id);
  }, [user, loadNotes]);

  // filter + sort notes derived from raw notes
  const displayed = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = notes.filter((n) => {
      if (!q) return true;
      return (n.title + " " + n.body).toLowerCase().includes(q);
    });

    // sort
    switch (sortMode) {
      case "updated_desc":
        filtered.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case "updated_asc":
        filtered.sort((a, b) => a.updatedAt - b.updatedAt);
        break;
      case "title_asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    return filtered;
  }, [notes, query, sortMode]);

  // handle delete with confirmation
  const handleDelete = async (noteId: string) => {
    Alert.alert("Delete", "Delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          await deleteNote(user.id, noteId);
        },
      },
    ]);
  };

  // render a single note row
  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity onPress={() => router.push({ pathname: "/edit-note", params: { id: item.id } })}>
      <Card>
        <View style={styles.row}>
          {/* thumbnail (if present) */}
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.preview} numberOfLines={2}>{item.body}</Text>
            <View style={styles.meta}>
              <Text style={styles.metaText}>{new Date(item.updatedAt).toLocaleString()}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  // early return if no user
  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No user found. Redirecting to login...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* header with actions */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Notes</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.push("/create-note")}>
            <Text style={styles.headerBtnText}>+ New</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.headerBtn, { backgroundColor: Colors.danger }]} onPress={async () => { await logout(); }}>
            <Text style={styles.headerBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* search input */}
      <View style={{ paddingHorizontal: Spacing.md }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search title or body..."
          style={styles.search}
        />
      </View>

      {/* sort controls */}
      <View style={styles.sortRow}>
        <TouchableOpacity onPress={() => setSortMode(sortMode === "updated_desc" ? "updated_asc" : "updated_desc")}>
          <Text style={styles.sortBtn}>Updated {sortMode.includes("desc") ? "↓" : "↑"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSortMode(sortMode === "title_asc" ? "title_desc" : "title_asc")}>
          <Text style={styles.sortBtn}>Title {sortMode.includes("asc") ? "A→Z" : "Z→A"}</Text>
        </TouchableOpacity>
      </View>

      {/* list */}
      <FlatList
        data={displayed}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: Spacing.md }}
        ListEmptyComponent={() => (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: "center", color: Colors.muted }}>{notes.length === 0 ? "No notes yet. Tap + New to create." : "No results."}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { padding: Spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "700" },
  headerButtons: { flexDirection: "row", gap: 8 },
  headerBtn: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },
  headerBtnText: { color: "#fff", fontWeight: "600" },
  search: { backgroundColor: "#fff", marginVertical: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb" },
  sortRow: { flexDirection: "row", justifyContent: "space-evenly", paddingHorizontal: Spacing.md, paddingBottom: 8 },
  sortBtn: { color: Colors.primaryDark, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "flex-start" },
  thumb: { width: 80, height: 80, borderRadius: 8 },
  thumbPlaceholder: { width: 80, height: 80, borderRadius: 8, backgroundColor: "#eef2f3" },
  title: { fontWeight: "700", fontSize: 16 },
  preview: { color: Colors.muted, marginTop: 4 },
  meta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  metaText: { color: Colors.muted, fontSize: 12 },
  delete: { color: Colors.danger, marginLeft: 12, fontWeight: "600" },
});

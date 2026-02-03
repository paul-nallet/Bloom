import { ScrollView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import { useJournalStore } from "../store/journalStore";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function JournalScreen() {
  const entries = useJournalStore((s) => s.entries);
  const addEntry = useJournalStore((s) => s.addEntry);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleAdd = () => {
    addEntry({ title, text });
    setTitle("");
    setText("");
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="p-5 gap-4">
      <View className="gap-2">
        <Text className="text-xl text-textPrimary">Journal</Text>
        <Text className="text-base text-textSecondary">
          Un espace calme pour déposer ce qui vient.
        </Text>
      </View>

      <Card title="Écrire">
        <View className="gap-2">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titre (optionnel)"
            placeholderTextColor="#7A6C5F"
            className="bg-surface border border-border rounded-2xl p-3 text-textPrimary"
          />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Quelques lignes, si tu veux."
            placeholderTextColor="#7A6C5F"
            multiline
            className="min-h-[120px] bg-surface border border-border rounded-2xl p-3 text-textPrimary"
          />
          <Button label="Ajouter au journal" onPress={handleAdd} />
        </View>
      </Card>

      {entries.length ? (
        <View className="gap-3">
          {entries.map((entry) => (
            <Card key={entry.id} title={entry.title ?? formatDate(entry.createdAt)}>
              <Text className="text-xs text-textSecondary mb-2">
                {formatDate(entry.createdAt)}
              </Text>
              <Text className="text-sm text-textSecondary">{entry.text}</Text>
            </Card>
          ))}
        </View>
      ) : (
        <Card title="Souvenir doux">
          <Text className="text-sm text-textSecondary">
            Tu peux revenir ici quand tu veux.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}

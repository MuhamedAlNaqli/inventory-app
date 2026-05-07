import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { createInventory } from "@/lib/db";

export default function NewInventoryScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    try {
      await createInventory(trimmed, location.trim() || null);
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, gap: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <Field
        label="Name"
        placeholder="e.g. Main Warehouse"
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (error) setError(null);
        }}
        autoFocus
        error={error ?? undefined}
      />
      <Field
        label="Location"
        hint="Optional"
        placeholder="e.g. Berlin, Aisle 3"
        value={location}
        onChangeText={setLocation}
      />
      <View className="mt-2 gap-2">
        <Button title={saving ? "Saving..." : "Save"} onPress={onSave} disabled={saving} />
        <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

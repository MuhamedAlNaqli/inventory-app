import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { getInventory, updateInventory } from "@/lib/db";

export default function EditInventoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inventoryId = Number(id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const inv = await getInventory(inventoryId);
      if (inv) {
        setName(inv.name);
        setLocation(inv.location ?? "");
      }
      setLoaded(true);
    })();
  }, [inventoryId]);

  async function onSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateInventory(inventoryId, trimmed, location.trim() || null);
      router.back();
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return <View className="flex-1 bg-bg" />;

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerStyle={{ padding: 16, gap: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <Field
        label="Name"
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

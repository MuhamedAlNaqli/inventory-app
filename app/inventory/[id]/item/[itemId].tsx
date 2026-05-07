import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { deleteItem, getItem, updateItem } from "@/lib/db";

export default function EditItemScreen() {
  const { itemId } = useLocalSearchParams<{ id: string; itemId: string }>();
  const id = Number(itemId);
  const router = useRouter();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    sku?: string;
    quantity?: string;
  }>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const item = await getItem(id);
      if (item) {
        setName(item.name);
        setSku(item.sku);
        setQuantity(String(item.quantity));
      }
      setLoaded(true);
    })();
  }, [id]);

  async function onSave() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!sku.trim()) next.sku = "SKU is required";
    const q = Number(quantity);
    if (!Number.isInteger(q) || q < 0) next.quantity = "Must be 0 or greater";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setSaving(true);
    try {
      await updateItem(id, name.trim(), sku.trim(), q);
      router.back();
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete() {
    Alert.alert("Delete item?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteItem(id);
          router.back();
        },
      },
    ]);
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
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        error={errors.name}
      />
      <Field
        label="SKU"
        value={sku}
        onChangeText={(v) => {
          setSku(v);
          if (errors.sku) setErrors({ ...errors, sku: undefined });
        }}
        autoCapitalize="characters"
        error={errors.sku}
      />
      <Field
        label="Quantity"
        value={quantity}
        onChangeText={(v) => {
          setQuantity(v);
          if (errors.quantity) setErrors({ ...errors, quantity: undefined });
        }}
        keyboardType="number-pad"
        error={errors.quantity}
      />
      <View className="mt-2 gap-2">
        <Button title={saving ? "Saving..." : "Save"} onPress={onSave} disabled={saving} />
        <Button title="Delete item" variant="danger" onPress={confirmDelete} />
        <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { createItem } from "@/lib/db";

export default function NewItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inventoryId = Number(id);
  const router = useRouter();
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [errors, setErrors] = useState<{
    name?: string;
    sku?: string;
    quantity?: string;
  }>({});
  const [saving, setSaving] = useState(false);

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
      await createItem(inventoryId, name.trim(), sku.trim(), q);
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
        placeholder="e.g. Cardboard box"
        value={name}
        onChangeText={(v) => {
          setName(v);
          if (errors.name) setErrors({ ...errors, name: undefined });
        }}
        autoFocus
        error={errors.name}
      />
      <Field
        label="SKU"
        placeholder="e.g. CB-001"
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
        <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

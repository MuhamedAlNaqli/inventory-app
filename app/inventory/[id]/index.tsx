import {
  Link,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Empty } from "@/components/Empty";
import {
  deleteInventory,
  getInventory,
  listItems,
  type Inventory,
  type Item,
} from "@/lib/db";

export default function InventoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const inventoryId = Number(id);
  const router = useRouter();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [items, setItems] = useState<Item[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [inv, list] = await Promise.all([
          getInventory(inventoryId),
          listItems(inventoryId),
        ]);
        if (cancelled) return;
        if (!inv) {
          router.back();
          return;
        }
        setInventory(inv);
        setItems(list);
      })();
      return () => {
        cancelled = true;
      };
    }, [inventoryId, router]),
  );

  function confirmDelete() {
    Alert.alert(
      "Delete inventory?",
      "This will also delete all of its items. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteInventory(inventoryId);
            router.back();
          },
        },
      ],
    );
  }

  if (!inventory || items === null) {
    return <View className="flex-1 bg-bg" />;
  }

  return (
    <View className="flex-1 bg-bg">
      <Stack.Screen
        options={{
          title: inventory.name,
          headerRight: () => (
            <Link href={`/inventory/${inventoryId}/edit`} asChild>
              <Pressable className="px-2 py-1 active:opacity-60">
                <Text className="text-accent font-medium">Edit</Text>
              </Pressable>
            </Link>
          ),
        }}
      />

      <View className="px-4 pt-3 pb-2">
        {inventory.location ? (
          <Text className="text-sm text-muted">{inventory.location}</Text>
        ) : null}
      </View>

      {items.length === 0 ? (
        <View className="flex-1">
          <Empty
            title="No items yet"
            body="Add your first item to this inventory."
          />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(r) => String(r.id)}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <Link
              href={`/inventory/${inventoryId}/item/${item.id}`}
              asChild
            >
              <Pressable className="rounded-2xl border border-border bg-surface p-4 active:opacity-70 flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-ink">
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-xs text-muted">
                    SKU {item.sku}
                  </Text>
                </View>
                <View className="rounded-lg bg-bg px-3 py-1.5 border border-border">
                  <Text className="text-sm font-semibold text-ink">
                    × {item.quantity}
                  </Text>
                </View>
              </Pressable>
            </Link>
          )}
        />
      )}

      <View className="px-4 pb-6 pt-2 gap-2">
        <Button
          title="Add item"
          onPress={() => router.push(`/inventory/${inventoryId}/item/new`)}
        />
        <Button title="Delete inventory" variant="ghost" onPress={confirmDelete} />
      </View>
    </View>
  );
}

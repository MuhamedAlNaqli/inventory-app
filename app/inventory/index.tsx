import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Empty } from "@/components/Empty";
import { listInventories, type Inventory } from "@/lib/db";

type Row = Inventory & { item_count: number };

export default function InventoriesScreen() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const inventories = await listInventories();
        const { countItems } = await import("@/lib/db");
        const withCounts = await Promise.all(
          inventories.map(async (inv) => ({
            ...inv,
            item_count: await countItems(inv.id),
          })),
        );
        if (!cancelled) setRows(withCounts);
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  if (rows === null) {
    return <View className="flex-1 bg-bg" />;
  }

  if (rows.length === 0) {
    return (
      <View className="flex-1 bg-bg">
        <Empty
          title="No inventories yet"
          body="Create your first inventory to start tracking items."
        />
        <View className="px-6 pb-8">
          <Button
            title="Create inventory"
            onPress={() => router.push("/inventory/new")}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <Link href={`/inventory/${item.id}`} asChild>
            <Pressable className="rounded-2xl border border-border bg-surface p-4 active:opacity-70">
              <Text className="text-base font-semibold text-ink">
                {item.name}
              </Text>
              {item.location ? (
                <Text className="mt-0.5 text-sm text-muted">
                  {item.location}
                </Text>
              ) : null}
              <Text className="mt-2 text-xs text-muted">
                {item.item_count} {item.item_count === 1 ? "item" : "items"}
              </Text>
            </Pressable>
          </Link>
        )}
      />
      <View className="px-4 pb-6 pt-2">
        <Button
          title="New inventory"
          onPress={() => router.push("/inventory/new")}
        />
      </View>
    </View>
  );
}
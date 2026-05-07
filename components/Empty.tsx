import { Text, View } from "react-native";

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-surface border border-border mb-4">
        <Text className="text-2xl">📦</Text>
      </View>
      <Text className="text-lg font-semibold text-ink mb-1">{title}</Text>
      <Text className="text-center text-sm text-muted">{body}</Text>
    </View>
  );
}

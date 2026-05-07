import { Pressable, Text, type PressableProps } from "react-native";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = PressableProps & {
  title: string;
  variant?: Variant;
};

const base = "rounded-xl px-4 py-3 items-center justify-center";
const styles: Record<Variant, { box: string; text: string }> = {
  primary: { box: "bg-ink active:opacity-80", text: "text-white font-semibold" },
  secondary: {
    box: "bg-surface border border-border active:opacity-80",
    text: "text-ink font-semibold",
  },
  danger: {
    box: "bg-danger active:opacity-80",
    text: "text-white font-semibold",
  },
  ghost: { box: "active:opacity-60", text: "text-muted font-medium" },
};

export function Button({ title, variant = "primary", ...rest }: Props) {
  const s = styles[variant];
  return (
    <Pressable className={`${base} ${s.box}`} {...rest}>
      <Text className={s.text}>{title}</Text>
    </Pressable>
  );
}

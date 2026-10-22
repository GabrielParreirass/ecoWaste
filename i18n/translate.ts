import en from "./en";

export type Language = "pt" | "en";
export type TranslationValues = Record<string, string | number | null | undefined>;
export interface TranslationMessage {
  key: string;
  values?: TranslationValues;
}
export type Message = string | TranslationMessage;
export type Translatable = Message | number | null | undefined;

export function translate(message: Translatable, language: Language, values?: TranslationValues): string {
  const descriptor = typeof message === "object" && message !== null;
  const key = descriptor ? message.key : String(message ?? "");
  const params = descriptor ? message.values : values;
  const translated = language === "en" ? en[key.trim()] : undefined;
  const source = translated === undefined ? key
    : (key.match(/^\s*/)?.[0] ?? "") + translated + (key.match(/\s*$/)?.[0] ?? "");

  // Replace placeholders once so user-provided content is never interpreted as a key.
  return source.replace(/\{\{(\w+)\}\}/g, (placeholder, name: string) =>
    params?.[name] == null ? placeholder : String(params[name])
  );
}

import React, { useState } from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Platform, TextInput } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LanguageProvider, useLanguage, LANGUAGE_STORAGE_KEY } from "../contexts/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import CustomModal from "../app/components/popUps/CustomModal";

jest.mock("expo-secure-store", () => ({ getItemAsync: jest.fn(), setItemAsync: jest.fn() }));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: require("react-native").View,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

global.IS_REACT_ACT_ENVIRONMENT = true;
// React Native lazily loads native component mocks during the first render.
jest.setTimeout(30000);
let current;
let renderer;
let mounts;
function Page() {
  current = useLanguage();
  const [input, setInput] = useState(() => { mounts++; return "Ana"; });
  return <>
    <LanguageSwitcher />
    <TextInput value={input} onChangeText={setInput} placeholder={current.t("Nome")} />
    <CustomModal visible onClose={() => {}} message={{ key: "Sua chave de cobrança é: {{recipient}}\nEla será enviada para: {{payer}}\nNo valor de: E${{amount}},00", values: { recipient: "ana@example.com", payer: "bob@example.com", amount: 10 } }} />
  </>;
}
async function mount() {
  await act(async () => { renderer = TestRenderer.create(<LanguageProvider><Page /></LanguageProvider>); });
}
beforeEach(() => {
  jest.clearAllMocks();
  mounts = 0;
  SecureStore.getItemAsync.mockResolvedValue(null);
  SecureStore.setItemAsync.mockResolvedValue(undefined);
  Platform.OS = "android";
});
afterEach(async () => { if (renderer) await act(async () => renderer.unmount()); renderer = undefined; });

test("switches from PT to EN and back without remounting a form, including an open modal", async () => {
  await mount();
  const savedCallback = current.t;
  await act(async () => renderer.root.findByType(TextInput).props.onChangeText("Ana Silva"));
  await act(async () => renderer.root.findAllByProps({ accessibilityLabel: "English" })[0].props.onPress());
  expect(renderer.root.findByType(TextInput).props).toMatchObject({ value: "Ana Silva", placeholder: "Name" });
  expect(savedCallback("Voltar")).toBe("Back");
  expect(JSON.stringify(renderer.toJSON())).toContain("Your payment request key is: ana@example.com");
  await act(async () => current.setLanguage("pt"));
  expect(renderer.root.findByType(TextInput).props).toMatchObject({ value: "Ana Silva", placeholder: "Nome" });
  expect(JSON.stringify(renderer.toJSON())).toContain("Sua chave de cobrança é: ana@example.com");
  expect(mounts).toBe(1);
  expect(SecureStore.setItemAsync).toHaveBeenLastCalledWith(LANGUAGE_STORAGE_KEY, "pt");
});

test("restores a saved language and ignores invalid saved values", async () => {
  SecureStore.getItemAsync.mockResolvedValue("en");
  await mount();
  expect(current.language).toBe("en");
  await act(async () => renderer.unmount());
  SecureStore.getItemAsync.mockResolvedValue("fr");
  await mount();
  expect(current.language).toBe("pt");
});

test("a delayed restore never overwrites a language the user already selected", async () => {
  let finishRestore;
  SecureStore.getItemAsync.mockImplementation(() => new Promise(resolve => { finishRestore = resolve; }));
  await mount();
  await act(async () => current.setLanguage("en"));
  await act(async () => finishRestore("pt"));
  expect(current.language).toBe("en");
});

test("switching works when storage fails", async () => {
  SecureStore.getItemAsync.mockRejectedValue(new Error("Unavailable"));
  SecureStore.setItemAsync.mockRejectedValue(new Error("Unavailable"));
  await mount();
  await act(async () => current.setLanguage("en"));
  expect(current.t("Voltar")).toBe("Back");
});

test("rapid language changes are persisted in selection order", async () => {
  const finishes = [];
  SecureStore.setItemAsync.mockImplementation(() => new Promise(resolve => finishes.push(resolve)));
  await mount();
  await act(async () => { current.setLanguage("en"); current.setLanguage("pt"); current.setLanguage("en"); });
  expect(current.language).toBe("en");
  expect(SecureStore.setItemAsync.mock.calls.map(call => call[1])).toEqual(["en"]);
  for (let i = 0; i < 3; i++) await act(async () => finishes[i]());
  expect(SecureStore.setItemAsync.mock.calls.map(call => call[1])).toEqual(["en", "pt", "en"]);
});

test("web restores and persists language using local storage", async () => {
  Platform.OS = "web";
  const storage = { getItem: jest.fn(() => "en"), setItem: jest.fn() };
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  await mount();
  expect(current.language).toBe("en");
  await act(async () => current.setLanguage("pt"));
  expect(storage.setItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, "pt");
  expect(SecureStore.setItemAsync).not.toHaveBeenCalled();
  delete globalThis.localStorage;
});

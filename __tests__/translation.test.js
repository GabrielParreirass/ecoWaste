import fs from "fs";
import path from "path";
import ts from "typescript";
import en from "../i18n/en";
import { translate } from "../i18n/translate";

test("translates both ways, preserves spacing, and falls back for unknown server text", () => {
  expect(translate("Voltar", "en")).toBe("Back");
  expect(translate("Voltar", "pt")).toBe("Voltar");
  expect(translate("Perfil de ", "en")).toBe("Profile of ");
  expect(translate("A new server message", "en")).toBe("A new server message");
  expect(translate(undefined, "en")).toBe("");
  expect(translate(2, "en")).toBe("2");
});

test("a stored payment message changes language without modifying its values", () => {
  const message = {
    key: "Sua chave de cobrança é: {{recipient}}\nEla será enviada para: {{payer}}\nNo valor de: E${{amount}},00",
    values: { recipient: "Voltar@example.com", payer: "{{amount}}", amount: 10 },
  };
  expect(translate(message, "en")).toBe("Your payment request key is: Voltar@example.com\nIt will be sent to: {{amount}}\nAmount: E$10.00");
  expect(translate(message, "pt")).toContain("No valor de: E$10,00");
  expect(message.values.amount).toBe(10);
});

test("all translations retain the same interpolation fields", () => {
  const fields = (text) => [...text.matchAll(/\{\{(\w+)\}\}/g)].map(match => match[1]).sort();
  for (const [key, value] of Object.entries(en)) {
    expect({ key, fields: fields(value) }).toEqual({ key, fields: fields(key) });
  }
});

test("every static translation key used by the app has an English translation", () => {
  const missing = [];
  function inspect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { inspect(file); continue; }
      if (!/\.tsx?$/.test(file)) continue;
      const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      function visit(node) {
        const call = ts.isCallExpression(node) && node.expression.getText(source) === "t";
        const descriptor = ts.isPropertyAssignment(node) && node.name.getText(source) === "key";
        const key = call ? node.arguments[0] : descriptor ? node.initializer : undefined;
        if (key && ts.isStringLiteral(key) && !Object.hasOwn(en, key.text.trim())) missing.push(`${file}: ${key.text}`);
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
  ["app", "contexts", "components"].forEach(inspect);
  expect(missing).toEqual([]);
});

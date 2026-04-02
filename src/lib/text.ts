import { Locale } from "@/types/domain";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function formatList(locale: Locale, values: string[]) {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  const connector = locale === "es" ? " y " : " and ";
  return `${values.slice(0, -1).join(", ")}${connector}${values.at(-1)}`;
}

export function formatDate(locale: Locale, value: string) {
  const formatter = new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    dateStyle: "medium"
  });

  return formatter.format(new Date(value));
}

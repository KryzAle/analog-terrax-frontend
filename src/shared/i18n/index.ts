import { en, type Messages } from "./en";

export type Locale = "en";

const catalogs: Record<Locale, Messages> = { en };

export const getMessages = (locale: Locale = "en"): Messages => catalogs[locale];

export const t = getMessages();

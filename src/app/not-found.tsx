import Link from "next/link";
import { t } from "@/shared/i18n";

const NotFound = () => (
  <main className="mx-auto max-w-md px-6 py-24 text-center">
    <h2 className="text-2xl font-bold">{t.errors.notFoundTitle}</h2>
    <p className="mt-2 text-sm text-text-muted">{t.errors.notFoundBody}</p>
    <Link
      href="/"
      className="mt-6 inline-block rounded-full bg-lime px-4 py-2 text-xs font-semibold text-space"
    >
      {t.errors.backHome}
    </Link>
  </main>
);

export default NotFound;

"use client";

import { ExternalLink, FlaskConical, ListOrdered, type LucideIcon, Orbit } from "lucide-react";
import { useEffect, useRef } from "react";
import { appConfig } from "@/shared/config/app-config";
import { t } from "@/shared/i18n";
import { EarthLimitsNote } from "@/shared/ui/earth-limits-note";

type IntroDialogViewProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STEPS: readonly { id: keyof typeof t.intro.steps; icon: LucideIcon }[] = [
  { id: "target", icon: Orbit },
  { id: "activity", icon: FlaskConical },
  { id: "compare", icon: ListOrdered },
];

export const IntroDialogView = ({ isOpen, onClose }: IntroDialogViewProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="intro-title"
      aria-describedby="intro-description"
      closedby="any"
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-card border border-line bg-surface-solid/95 p-0 text-text shadow-[0_24px_64px_rgb(0_0_0/0.6)] backdrop-blur-xl backdrop:bg-space/70 backdrop:backdrop-blur-sm open:motion-safe:animate-[preview-in_200ms_ease-out]"
    >
      <div className="space-y-5 p-6">
        <header className="space-y-2">
          <p className="text-[11px] font-semibold tracking-widest text-lime uppercase">{t.intro.eyebrow}</p>
          <h2 id="intro-title" className="text-2xl leading-tight font-bold tracking-tight text-balance">
            <a
              href={appConfig.pitchDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline decoration-lime/40 decoration-2 underline-offset-4 transition-colors duration-200 hover:text-lime hover:decoration-lime"
            >
              {t.intro.title}
              <ExternalLink className="ml-1.5 inline size-5 align-baseline text-lime" strokeWidth={2} aria-hidden />
              <span className="sr-only"> {t.intro.pitchDeckHint}</span>
            </a>
          </h2>
          <p id="intro-description" className="text-sm leading-relaxed text-text-muted">
            {t.intro.description}
          </p>
        </header>

        <ol className="space-y-3">
          {STEPS.map(({ id, icon: Icon }, index) => (
            <li key={id} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-lime/15 text-lime" aria-hidden>
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <p className="text-sm leading-snug">
                <span className="font-semibold">
                  {index + 1}. {t.intro.steps[id].title}
                </span>
                <span className="block text-text-muted">{t.intro.steps[id].body}</span>
              </p>
            </li>
          ))}
        </ol>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-lime">{t.intro.candidateNote}</p>
          <EarthLimitsNote />
        </div>

        <form method="dialog">
          <button
            type="submit"
            autoFocus
            className="min-h-11 w-full rounded-tile bg-lime px-4 font-semibold text-space transition duration-200 ease-out hover:brightness-110"
          >
            {t.intro.ok}
          </button>
        </form>
      </div>
    </dialog>
  );
};

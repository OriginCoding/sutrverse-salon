"use client";

import { useEffect, useState } from "react";

import { nextThirtyMinuteStartsAt } from "@/lib/next-slot";

type Stylist = { id: string; name: string; email: string | null };

export default function StylistWalkInPage() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedStylist, setSelectedStylist] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stylists");
        const data = (await res.json()) as { stylists?: Stylist[] };
        if (!cancelled && res.ok) {
          setStylists(Array.isArray(data.stylists) ? data.stylists : []);
        }
      } catch {
        if (!cancelled) setStylists([]);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function addWalkIn() {
    setMessage(null);
    if (!selectedStylist) {
      setMessage({ type: "err", text: "Select a stylist first." });
      return;
    }

    const startsAt = nextThirtyMinuteStartsAt();

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylistId: selectedStylist,
          startsAt: startsAt.toISOString(),
          customerName: "Walk-in",
          customerPhone: "N/A",
          service: "Walk-in",
        }),
      });
      const data = (await res.json()) as { error?: string; appointment?: { id: string } };
      if (res.ok && data.appointment) {
        setMessage({
          type: "ok",
          text: `Walk-in booked for ${startsAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}.`,
        });
      } else {
        setMessage({ type: "err", text: data.error ?? "Could not save walk-in." });
      }
    } catch {
      setMessage({ type: "err", text: "Network error." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:py-16">
      <div className="mx-auto max-w-md space-y-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Walk-in
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Book the next 30-minute slot from now.
          </p>
        </header>

        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="space-y-2">
            <label htmlFor="stylist-walkin" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Stylist
            </label>
            <select
              id="stylist-walkin"
              value={selectedStylist}
              onChange={(e) => {
                setSelectedStylist(e.target.value);
                setMessage(null);
              }}
              disabled={loadingList}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="">{loadingList ? "Loading…" : "Select stylist"}</option>
              {stylists.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={addWalkIn}
            disabled={submitting || !selectedStylist}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Saving…" : "Add Walk-in"}
          </button>

          {message ? (
            <p
              role="status"
              className={`text-sm ${
                message.type === "ok"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {message.text}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

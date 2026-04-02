"use client";

import { FormEvent, useEffect, useState } from "react";

type Stylist = {
  id: string;
  name: string;
  email: string | null;
};

type Slot = { startsAt: string };

function formatSlotLabel(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function todayYmd() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isSlotInPast(startsAtIso: string) {
  return new Date(startsAtIso).getTime() < Date.now();
}

export function BookingForm() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedStylist, setSelectedStylist] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingStylists, setLoadingStylists] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsTick, setSlotsTick] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const isToday = date === todayYmd();

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
        if (!cancelled) setLoadingStylists(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedStylist || !date) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    setSelectedSlot(null);

    const q = new URLSearchParams({ stylistId: selectedStylist, date });
    (async () => {
      try {
        const res = await fetch(`/api/availability?${q}`);
        const data = (await res.json()) as { slots?: string[]; error?: string };
        if (cancelled) return;
        if (res.ok && Array.isArray(data.slots)) {
          setSlots(data.slots.map((startsAt) => ({ startsAt })));
        } else {
          setSlots([]);
          if (data.error) {
            setFeedback({ type: "error", message: data.error });
          }
        }
      } catch {
        if (!cancelled) {
          setSlots([]);
          setFeedback({ type: "error", message: "Could not load availability." });
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedStylist, date, slotsTick]);

  const canSubmit =
    Boolean(selectedStylist) &&
    Boolean(date) &&
    selectedSlot !== null &&
    Boolean(name.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(service.trim());

  function refetchSlots() {
    setSlotsTick((t) => t + 1);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!canSubmit || !selectedSlot) {
      setFeedback({ type: "error", message: "Fill in stylist, date, time, and your details." });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stylistId: selectedStylist,
          startsAt: selectedSlot.startsAt,
          customerName: name.trim(),
          customerPhone: phone.trim(),
          service: service.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string; appointment?: { id: string } };

      if (res.ok && data.appointment) {
        setFeedback({ type: "success", message: "Your appointment is booked." });
        setSelectedSlot(null);
        setName("");
        setPhone("");
        setService("");
        refetchSlots();
      } else {
        setFeedback({
          type: "error",
          message: data.error ?? "Booking failed. Please try again.",
        });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }
  
function groupSlots(slots: Slot[]) {
  const morning: Slot[] = [];
  const afternoon: Slot[] = [];
  const evening: Slot[] = [];

  slots.forEach((slot) => {
    const hour = new Date(slot.startsAt).getHours();

    if (hour < 12) morning.push(slot);
    else if (hour < 17) afternoon.push(slot);
    else evening.push(slot);
  });

  return { morning, afternoon, evening };
}
  return (
    <form onSubmit={onSubmit} className="relative z-10 flex flex-col gap-8">
      <div className="space-y-2">
        <label htmlFor="stylist" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Stylist
        </label>
        <select
          id="stylist"
          value={selectedStylist}
          onChange={(e) => {
            setSelectedStylist(e.target.value);
            setFeedback(null);
          }}
          className="pointer-events-auto w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm outline-none ring-zinc-400 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          disabled={loadingStylists}
        >
          <option value="">{loadingStylists ? "Loading…" : "Select a stylist"}</option>
          {stylists.map((stylist) => (
            <option key={stylist.id} value={stylist.id}>
              {stylist.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Date
        </label>
        <input
          id="date"
          type="date"
          min={todayYmd()}
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setFeedback(null);
          }}
          className="pointer-events-auto w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm outline-none ring-zinc-400 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      <div className="space-y-3" aria-busy={loadingSlots}>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Available times</p>
        {loadingSlots ? (
          <div className="space-y-2">
            <div className="h-10 max-w-xs animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-11 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
            <p className="text-sm text-zinc-500">Loading slots…</p>
          </div>
        ) : !selectedStylist || !date ? (
          <p className="text-sm text-zinc-500">Select a stylist and date to see times.</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-zinc-500">No open slots on this day.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((slot) => {
              const selected = selectedSlot?.startsAt === slot.startsAt;
              const past = isToday && isSlotInPast(slot.startsAt);
              return (
                <button
                  key={slot.startsAt}
                  type="button"
                  disabled={past}
                  onClick={() => {
                    if (past) return;
                    setSelectedSlot(slot);
                    setFeedback(null);
                  }}
                  className={`pointer-events-auto rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                    past
                      ? "cursor-not-allowed border-zinc-100 bg-zinc-50 text-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
                      : selected
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-zinc-500"
                  }`}
                >
                  {formatSlotLabel(slot.startsAt)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Your details</p>
        <div className="space-y-2">
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pointer-events-auto w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none ring-zinc-400 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="sr-only">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pointer-events-auto w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none ring-zinc-400 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="service" className="sr-only">
            Service
          </label>
          <input
            id="service"
            type="text"
            placeholder="Service (e.g. haircut, color)"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="pointer-events-auto w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 shadow-sm outline-none ring-zinc-400 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>

      {feedback ? (
        <div
          role="status"
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
              : "bg-red-50 text-red-800 dark:bg-red-950/50 dark:text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting || !canSubmit}
        className="pointer-events-auto w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {submitting ? "Booking…" : "Confirm booking"}
      </button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";

type StylistUtil = { stylistId: string; stylistName: string; bookingCount: number };

type AppointmentRow = {
  id: string;
  startsAt: string;
  customerName: string | null;
  stylist: { id: string; name: string; email: string | null };
};

type DashboardData = {
  totalBookings: number;
  revenue: number;
  stylistUtilization: StylistUtil[];
  appointments: AppointmentRow[];
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function OwnerPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/owner");
        const json = (await res.json()) as DashboardData & { error?: string };
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error ?? "Could not load dashboard");
          return;
        }
        setData({
          totalBookings: json.totalBookings,
          revenue: json.revenue,
          stylistUtilization: json.stylistUtilization ?? [],
          appointments: json.appointments ?? [],
        });
      } catch {
        if (!cancelled) setError("Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeStylists = data?.stylistUtilization.length ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Owner dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Today&apos;s snapshot</p>
        </header>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}

        {!data && !error ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : null}

        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total bookings</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {data.totalBookings}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Revenue</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  ${data.revenue.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-zinc-500">$300 × bookings</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Active stylists</p>
                <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {activeStylists}
                </p>
                <p className="mt-1 text-xs text-zinc-500">With bookings today</p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Stylist utilization
              </h2>
              {data.stylistUtilization.length === 0 ? (
                <p className="text-sm text-zinc-500">No bookings yet today.</p>
              ) : (
                <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                  {data.stylistUtilization.map((row) => (
                    <li
                      key={row.stylistId}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span className="text-zinc-900 dark:text-zinc-100">{row.stylistName}</span>
                      <span className="font-medium text-zinc-600 dark:text-zinc-400">
                        {row.bookingCount} booking{row.bookingCount === 1 ? "" : "s"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Today&apos;s appointments
              </h2>
              {data.appointments.length === 0 ? (
                <p className="text-sm text-zinc-500">No appointments scheduled for today.</p>
              ) : (
                <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                  {data.appointments.map((a) => (
                    <li key={a.id} className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {a.customerName ?? "—"}
                        </span>
                        <span className="text-zinc-500">{formatTime(a.startsAt)}</span>
                      </div>
                      <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{a.stylist.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

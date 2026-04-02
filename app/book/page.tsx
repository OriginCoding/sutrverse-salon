import { BookingForm } from "@/components/booking-form";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-zinc-950 sm:py-16">
      <div className="mx-auto max-w-md">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Book an appointment
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Pick a stylist, date, and time. We&apos;ll confirm your slot.
          </p>
        </header>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}

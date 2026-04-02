export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* HERO */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Salon Management System
          </h1>
          <p className="text-gray-400">
            Book appointments, manage stylists, and track your business — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <a href="/book" className="px-6 py-3 bg-white text-black rounded-lg font-medium">
              Book Appointment
            </a>
            <a href="/stylist" className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800">
              Walk-in (Staff only)
            </a>
            <a href="/owner" className="px-6 py-3 border border-gray-600 rounded-lg hover:bg-gray-800">
              Owner Dashboard (Demo only)
            </a>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            How it works
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 border border-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">1. Choose Stylist</h3>
              <p className="text-gray-400 text-sm">
                Select your preferred stylist based on availability.
              </p>
            </div>

            <div className="p-4 border border-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">2. Pick Time Slot</h3>
              <p className="text-gray-400 text-sm">
                View real-time availability and choose a suitable slot.
              </p>
            </div>

            <div className="p-4 border border-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">3. Confirm Booking</h3>
              <p className="text-gray-400 text-sm">
                Enter your details and confirm your appointment instantly.
              </p>
            </div>
          </div>
        </section>

        {/* USER FLOWS */}
        <section className="grid md:grid-cols-3 gap-6">

          {/* CUSTOMER */}
          <div className="p-6 border border-gray-800 rounded-xl space-y-3">
            <h3 className="text-lg font-semibold">For Customers</h3>
            <p className="text-gray-400 text-sm">
              Book appointments quickly by selecting a stylist and available time slot.
            </p>
            <a href="/book" className="text-sm underline">
              Go to booking →
            </a>
          </div>

          {/* STYLIST */}
          <div className="p-6 border border-gray-800 rounded-xl space-y-3">
            <h3 className="text-lg font-semibold">For Stylists</h3>
            <p className="text-gray-400 text-sm">
              Add walk-in customers instantly and manage your schedule.
            </p>
            <a href="/stylist" className="text-sm underline">
              Add walk-in →
            </a>
          </div>

          {/* OWNER */}
          <div className="p-6 border border-gray-800 rounded-xl space-y-3">
            <h3 className="text-lg font-semibold">For Owners</h3>
            <p className="text-gray-400 text-sm">
              Track bookings, revenue, and stylist performance in real time.
            </p>
            <a href="/owner" className="text-sm underline">
              View dashboard →
            </a>
          </div>

        </section>

      </div>
    </main>
  );
}
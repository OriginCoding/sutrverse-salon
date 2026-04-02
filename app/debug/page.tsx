import { prisma } from "@/lib/prisma";

export default async function DebugPage() {
  const appointments = await prisma.appointment.findMany({
    include: { stylist: true },
    orderBy: { startsAt: "desc" },
  });

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-xl mb-4">Appointments (Debug View)</h1>

      <pre className="text-xs overflow-auto">
        {JSON.stringify(appointments, null, 2)}
      </pre>
    </div>
  );
}
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Choose a stylist, date, and time for your salon visit.",
};

export default function BookLayout({ children }: { children: ReactNode }) {
  return children;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Walk-in",
};

export default function StylistLayout({ children }: { children: ReactNode }) {
  return children;
}

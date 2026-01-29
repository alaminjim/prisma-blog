import { Navbar } from "@/components/layouts/Navbar";
import { ReactNode } from "react";

export default function DashboardLayouts({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

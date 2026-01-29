import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div>
        <Button>
          <Link href={"/dashboard/analytics/weekly"}>Weekly</Link>
        </Button>
        <Button>
          <Link href={"/dashboard/analytics/monthly"}>Monthly</Link>
        </Button>
      </div>

      {children}
    </div>
  );
}

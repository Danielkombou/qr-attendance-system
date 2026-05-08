import { CircleCheckBig, Clock3, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PanelCard } from "@/components/dashboard/panel-card";

export default function CheckInPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.03em]">Check In/Out</h1>
        <p className="text-muted-foreground">Scan QR code or use quick check-in</p>
      </header>
      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <PanelCard title="QR Code" rightSlot={<QrCode className="h-5 w-5 text-muted-foreground" />}>
          <div className="flex flex-col items-center">
            <div className="rounded-2xl border border-border bg-background p-8">
              <div className="h-44 w-44 rounded-md bg-[linear-gradient(90deg,#000_50%,transparent_50%),linear-gradient(#000_50%,transparent_50%)] bg-[length:24px_24px] bg-repeat opacity-90" />
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Your Code</p>
            <p className="text-[2rem] font-semibold tracking-[0.04em]">USER-12345</p>
          </div>
        </PanelCard>
        <div className="space-y-4">
          <PanelCard title="Current Status">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <Clock3 className="h-4 w-4" /> Current Time
              </p>
              <p className="text-[1.9rem] font-semibold">02:30:22 PM</p>
              <p className="inline-flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> Location
              </p>
              <p className="text-[1.5rem] font-medium">Office - Floor 3</p>
            </div>
          </PanelCard>
          <PanelCard title="Quick Actions">
            <Button className="h-12 w-full gap-2 text-base">
              <CircleCheckBig className="h-4 w-4" />
              Check In Now
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Scan your QR code at the office scanner or use quick check-in.
            </p>
          </PanelCard>
        </div>
      </section>
    </div>
  );
}

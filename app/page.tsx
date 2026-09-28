import AddressConverter from "@/components/AddressConverter";

export default function Home() {
  return (
    <main className="h-[100dvh] flex flex-col md:items-center md:justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decorations - radial gradients instead of blur filters,
          which iOS WebKit re-rasterizes when a <select> picker opens (freezes the UI) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.10),transparent_320px),radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.10),transparent_320px)]" />

      <AddressConverter />
    </main>
  );
}

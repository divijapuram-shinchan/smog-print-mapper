import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POLLUSCAN — Live Pollution Fingerprint" },
      {
        name: "description",
        content:
          "Live pollution fingerprint dashboard: sensor readings, source-match breakdown, event timeline and a zone fingerprint map.",
      },
      { property: "og:title", content: "POLLUSCAN — Live Pollution Fingerprint" },
      {
        property: "og:description",
        content:
          "Detect pollution events, generate a fingerprint and see the likely source pattern by zone and time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Sensor = {
  icon: string;
  value: string;
  label: string;
  pct: number;
  track: string;
  bar: string;
};

const SOURCES = [
  { icon: "🚗", name: "Traffic-like", pct: 82, bar: "bg-gradient-to-r from-coral to-butter", chip: "bg-coral/20" },
  { icon: "🏗️", name: "Dust-like", pct: 11, bar: "bg-butter", chip: "bg-butter/30" },
  { icon: "🏭", name: "Industrial-like", pct: 7, bar: "bg-sky", chip: "bg-sky/30" },
];

const STAGES = [
  { label: "Normal", h: "h-[30%]", color: "bg-mint/50", active: false },
  { label: "Rising", h: "h-[48%]", color: "bg-butter/70", active: false },
  { label: "Peak", h: "h-full", color: "bg-coral", active: true },
  { label: "Falling", h: "h-[42%]", color: "bg-peach/70", active: false },
  { label: "Normal", h: "h-[28%]", color: "bg-mint/50", active: false },
];

const ZONES = [
  { icon: "🚗", name: "Zone A", desc: "Traffic · rush hour", pct: 82, wrap: "bg-coral/10", chip: "bg-coral/25", pctColor: "text-coral" },
  { icon: "🏗️", name: "Zone B", desc: "Construction dust", pct: 64, wrap: "bg-butter/15", chip: "bg-butter/40", pctColor: "text-inksoft" },
  { icon: "🏭", name: "Zone C", desc: "Industrial-like", pct: 57, wrap: "bg-sky/15", chip: "bg-sky/30", pctColor: "text-inksoft" },
];

function useLiveSensors(): Sensor[] {
  const base = useMemo<Sensor[]>(
    () => [
      { icon: "🌫️", value: "84", label: "PM2.5 · µg/m³", pct: 70, track: "bg-coral/15", bar: "bg-coral" },
      { icon: "🟢", value: "14", label: "CO · ppm", pct: 55, track: "bg-mint/30", bar: "bg-mint" },
      { icon: "🟡", value: "52", label: "NO₂ · ppb", pct: 48, track: "bg-butter/30", bar: "bg-butter" },
      { icon: "🌡️", value: "29°", label: "Temp", pct: 40, track: "bg-sky/30", bar: "bg-sky" },
      { icon: "💧", value: "41%", label: "Humidity", pct: 41, track: "bg-lilac/40", bar: "bg-lilac" },
      { icon: "🔊", value: "78", label: "Noise · dB", pct: 78, track: "bg-coral/15", bar: "bg-coral" },
    ],
    [],
  );

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  if (tick === 0) return base;
  return base.map((s, i) => {
    const drift = Math.sin(tick * 0.9 + i) * 4;
    const pct = Math.max(8, Math.min(96, Math.round(s.pct + drift)));
    const numeric = parseFloat(s.value);
    const suffix = s.value.replace(/^[\d.]+/, "");
    const value = Number.isNaN(numeric)
      ? s.value
      : `${Math.max(1, Math.round(numeric + drift / 2))}${suffix}`;
    return { ...s, pct, value };
  });
}

function Index() {
  const sensors = useLiveSensors();

  return (
    <div className="min-h-screen bg-canvas font-body">
      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-coral to-butter text-2xl">
            🧬
          </div>
          <div className="leading-tight">
            <p className="font-display text-2xl font-extrabold text-ink">POLLUSCAN</p>
            <p className="-mt-1 text-xs font-bold text-inksoft">From levels to fingerprints</p>
          </div>
        </div>
        <nav className="hidden items-center gap-1 text-sm font-bold text-inksoft md:flex">
          <a href="#live" className="rounded-full bg-surface px-4 py-2 text-ink shadow-sm">
            Live
          </a>
          <a href="#map" className="rounded-full px-4 py-2 hover:bg-surface/60">
            Fingerprint Map
          </a>
          <a href="#timeline" className="rounded-full px-4 py-2 hover:bg-surface/60">
            Timeline
          </a>
          <a href="#sources" className="rounded-full px-4 py-2 hover:bg-surface/60">
            Sources
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-bold text-ink shadow-sm sm:flex">
            <span className="size-2.5 animate-pulse rounded-full bg-mint" /> Live · Zone A
          </span>
          <div className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-sky to-lilac font-display text-sm font-bold text-ink">
            DR
          </div>
        </div>
      </header>

      <main className="px-6 pb-16 md:px-10">
        <section
          id="sources"
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-coral/25 via-butter/30 to-mint/30 p-7 md:p-10"
        >
          <div className="absolute -top-10 -right-6 size-40 rounded-full bg-butter/50" />
          <div className="absolute -bottom-12 left-1/3 size-44 rounded-full bg-sky/40" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-4 py-1.5 text-xs font-extrabold tracking-wider text-coral uppercase">
                <span className="size-2 animate-pulse rounded-full bg-coral" /> Pollution event detected
              </span>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] font-extrabold text-ink md:text-5xl">
                This looks like <span className="text-coral">traffic pollution</span>
              </h1>
              <p className="mt-3 max-w-md text-base font-semibold text-inksoft">
                High PM + high CO with a traffic-time spike. The most likely source by 82% — not just
                "pollution: high".
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#live"
                  className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg"
                >
                  View fingerprint
                </a>
                <a
                  href="#map"
                  className="rounded-full bg-surface px-6 py-3 text-sm font-bold text-ink shadow-sm"
                >
                  Open zone map
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] bg-surface/90 p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold text-ink">Fingerprint</p>
                <span className="text-xs font-bold text-inksoft">08:42 · Mon</span>
              </div>
              <div className="mt-4 space-y-3">
                {SOURCES.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className={`grid size-9 place-items-center rounded-xl text-lg ${s.chip}`}>
                      {s.icon}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-ink">{s.name}</span>
                        <span className={s.pct > 50 ? "text-coral" : "text-inksoft"}>{s.pct}%</span>
                      </div>
                      <div className="mt-1 h-2.5 rounded-full bg-coral/15">
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ${s.bar}`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="live" className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {sensors.map((s) => (
            <div key={s.label} className="rounded-3xl bg-surface p-4 shadow-sm">
              <span className="text-2xl">{s.icon}</span>
              <p className="mt-2 font-display text-2xl font-extrabold text-ink">{s.value}</p>
              <p className="text-xs font-bold text-inksoft">{s.label}</p>
              <div className={`mt-2 h-2 rounded-full ${s.track}`}>
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ${s.bar}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div id="timeline" className="rounded-[2rem] bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-bold text-ink">Event timeline</p>
              <span className="rounded-full bg-mint/30 px-3 py-1 font-display text-xs font-extrabold text-ink">
                now: falling
              </span>
            </div>
            <div className="mt-6 flex h-40 items-end justify-between gap-2">
              {STAGES.map((s, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className={`w-full rounded-2xl ${s.color} ${s.h}`} />
                  <span
                    className={`text-xs font-bold ${s.active ? "text-ink" : "text-inksoft"}`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div id="map" className="rounded-[2rem] bg-surface p-6 shadow-sm">
            <p className="font-display text-xl font-bold text-ink">Fingerprint map</p>
            <p className="mt-1 text-xs font-bold text-inksoft">What pattern, where, and when</p>
            <div className="mt-4 space-y-3">
              {ZONES.map((z) => (
                <div key={z.name} className={`flex items-center gap-3 rounded-2xl p-3 ${z.wrap}`}>
                  <span className={`grid size-9 place-items-center rounded-xl text-lg ${z.chip}`}>
                    {z.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-ink">{z.name}</p>
                    <p className="text-xs font-semibold text-inksoft">{z.desc}</p>
                  </div>
                  <span className={`text-xs font-bold ${z.pctColor}`}>{z.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

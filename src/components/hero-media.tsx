const photos = [
  "/media/hero-team.jpg",
  "/media/hero-strategy.jpg",
  "/media/hero-office.jpg"
];

function RotatingPhotos({ soft = false }: { soft?: boolean }) {
  const visible = soft ? "0.34" : "1";

  return (
    <>
      <style>
        {`
          @keyframes kmHeroFade {
            0%, 24% { opacity: var(--km-visible-opacity); transform: scale(1); }
            33%, 91% { opacity: 0; transform: scale(1.025); }
            100% { opacity: var(--km-visible-opacity); transform: scale(1); }
          }
          .km-grid-glow {
            background-image:
              linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
            background-size: 48px 48px;
          }
        `}
      </style>
      {photos.map((photo, index) => (
        <div
          key={photo}
          className="absolute inset-0 bg-cover bg-center opacity-0"
          style={{
            backgroundImage: `url(${photo})`,
            animation: "kmHeroFade 6s infinite",
            animationDelay: `${index * 2}s`,
            ["--km-visible-opacity" as string]: visible
          }}
        />
      ))}
    </>
  );
}

function AccentPanels() {
  const panels = [
    "linear-gradient(135deg, rgba(37,99,235,.24), transparent 48%)",
    "linear-gradient(135deg, rgba(249,115,91,.24), transparent 48%)",
    "linear-gradient(135deg, rgba(214,168,79,.22), transparent 48%)"
  ];

  return (
    <>
      <style>
        {`
          @keyframes kmHeroFade {
            0%, 18% { opacity: var(--km-visible-opacity); transform: scale(1); }
            25%, 93% { opacity: 0; transform: scale(1.03); }
            100% { opacity: var(--km-visible-opacity); transform: scale(1); }
          }
          .km-grid-glow {
            background-image:
              linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
            background-size: 48px 48px;
          }
        `}
      </style>
      {panels.map((panel, index) => (
        <div
          key={panel}
          className="absolute inset-0 opacity-0"
          style={{
            background: panel,
            animation: "kmHeroFade 6s infinite",
            animationDelay: `${index * 2}s`,
            ["--km-visible-opacity" as string]: "1"
          }}
        />
      ))}
    </>
  );
}

export function HeroMedia() {
  return (
    <div className="absolute inset-0">
      <RotatingPhotos soft />
      <div className="absolute inset-0 km-grid-glow opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E1836] via-[#0E1836]/88 to-[#0E1836]/70" />
    </div>
  );
}

export function HeroShowcase() {
  return (
    <div className="overflow-hidden rounded-ui border border-white/15 bg-white/10 p-3 shadow-soft backdrop-blur">
      <div className="relative min-h-[390px] overflow-hidden rounded-ui">
        <RotatingPhotos />
        <AccentPanels />
        <div className="absolute inset-0 km-grid-glow opacity-35" />
        <div className="absolute left-6 top-6 h-24 w-24 rounded-full border border-white/25" />
        <div className="absolute right-8 top-16 h-36 w-36 rounded-ui border border-white/20 bg-white/10" />
        <div className="absolute bottom-24 left-10 h-20 w-52 rounded-ui bg-white/12" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E1836]/90 to-transparent p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-normal text-white/70">KM Agency</p>
          <h2 className="mt-1 text-2xl font-black">Creative, marketing, and technology work in motion</h2>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <span
            key={photo}
            className="h-2 rounded-full bg-white/40"
            style={{
              animation: "kmHeroFade 6s infinite",
              animationDelay: `${index * 2}s`,
              ["--km-visible-opacity" as string]: "1"
            }}
          />
        ))}
      </div>
    </div>
  );
}

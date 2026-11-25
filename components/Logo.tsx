type LogoProps = {
  size?: number;
};

// Ton logo Facebook, affiché sans aucune modification, avec l'étiquette « study » à côté
export default function Logo({ size = 56 }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/facebook-logo.jpg"
        alt="Facebook"
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      <span className="rounded-md bg-[#E7F3FF] px-2 py-0.5 text-sm font-bold uppercase tracking-wide text-[#0866FF]">
        study
      </span>
    </div>
  );
}
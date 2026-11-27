type MetaMarkProps = {
  height?: number;
};

// Logo Meta (image), utilisé partout où « ∞ Meta » apparaît
export default function MetaMark({ height = 24 }: MetaMarkProps) {
  return (
    <div className="flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/meta-logo.png"
        alt="Meta"
        style={{ height, width: "auto" }}
        className="mix-blend-multiply"
      />
    </div>
  );
}
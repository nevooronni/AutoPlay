import Link from "next/link";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeMap = {
    sm: { icon: "h-8 w-8 text-sm", text: "text-lg" },
    md: { icon: "h-10 w-10 text-base", text: "text-xl" },
    lg: { icon: "h-14 w-14 text-xl", text: "text-3xl" },
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <div
        className={`${sizeMap[size].icon} rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow`}
      >
        AA
      </div>
      <span
        className={`${sizeMap[size].text} font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent`}
      >
        AutoApply
      </span>
    </Link>
  );
}

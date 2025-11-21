import { Link } from "react-router-dom";

export default function Header({
  title = "Memory Cards",
  subtitle,
  rightLink, // { to, label }
  backLink, // { to, label }
  rightSlot, // JSX opcional si quieres algo más custom
}) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Animated logo */}
          <div className="relative [perspective:600px] shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-black text-white grid place-items-center shadow-sm ring-1 ring-black/10 logo-fancy">
              <i className="pi pi-clone text-xl" />
            </div>

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            <span className="absolute -left-1 -bottom-1 h-2.5 w-2.5 rounded-full bg-indigo-400 ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 truncate">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {backLink && (
            <Link
              to={backLink.to}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              {backLink.label}
            </Link>
          )}

          {rightLink && (
            <Link
              to={rightLink.to}
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition"
            >
              {rightLink.label}
            </Link>
          )}

          {rightSlot}
        </div>
      </div>

      {/* animations only for the logo (global header) */}
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-4px); }
        }
        @keyframes logoFlip {
          0%   { transform: rotateY(0deg); }
          45%  { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        .logo-fancy {
          transform-style: preserve-3d;
          animation:
            float 3.5s ease-in-out infinite,
            logoFlip 6s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
}

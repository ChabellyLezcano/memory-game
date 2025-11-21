import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, ensureAnonAuth } from "../api/firebase";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;

    setLoading(true);
    try {
      const user = await ensureAnonAuth();

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          username: name,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );

      navigate("/game", {
        state: { uid: user.uid, username: name },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 grid place-items-center px-4">
      {/* soft animated blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-200/55 blur-[110px] animate-[blinkGlow_2.6s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-200/55 blur-[120px] animate-[blinkGlow_3.1s_ease-in-out_infinite]" />

      {/* card */}
      <div className="relative w-full max-w-md mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-lg ring-1 ring-slate-200 p-6 sm:p-7 space-y-5 pop-in">
        {/* logo header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-black text-white grid place-items-center shadow-sm ring-1 ring-black/10 floaty">
              <i className="pi pi-clone text-xl" />
            </div>
            {/* tiny orbit dots */}
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
            <span className="absolute -left-1 -bottom-1 h-2.5 w-2.5 rounded-full bg-indigo-400 ring-2 ring-white" />
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Memory Cards
            </h1>
            <p className="text-xs text-slate-500">
              3 levels · speed bonuses · global ranking
            </p>
          </div>
        </div>

        {/* little “tech chips” */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            <i className="pi pi-code text-[10px]" /> Web Tech
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            <i className="pi pi-bolt text-[10px]" /> Fast bonus
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 ring-1 ring-slate-200">
            <i className="pi pi-database text-[10px]" /> Firestore
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Enter your username to start. Your final score will be saved to the leaderboard.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Username
            <input
              className="
                h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none
                focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400
                transition shadow-inner
              "
              placeholder="e.g. Fred"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-11 rounded-xl font-semibold text-white
              bg-slate-900 hover:bg-slate-800 active:bg-slate-950
              transition shadow-sm
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {loading && <i className="pi pi-spin pi-spinner text-sm" />}
            {loading ? "Starting..." : "Start game"}
          </button>
        </form>

        <div className="text-center pt-1">
          <Link
            to="/leaderboard"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            View leaderboard →
          </Link>
        </div>

        {/* tiny footer */}
        <p className="text-[11px] text-slate-400 text-center">
          Tip: finish fast for extra points.
        </p>
      </div>

      {/* minimal CSS for entrance + float */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(8px) scale(.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pop-in { animation: popIn .45s ease-out both; }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

          @keyframes blinkGlow {
    0%, 100% { opacity: .35; transform: scale(1); }
    50% { opacity: .8; transform: scale(1.06); }
  }
    
        .floaty { animation: float 3.5s ease-in-out infinite; }
      `}</style>
    </main>
  );
}

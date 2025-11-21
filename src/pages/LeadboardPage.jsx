import { Link, useLocation } from "react-router-dom";
import LeaderboardList from "../components/Leaderboardlist";

export default function LeaderboardPage() {
  const { state } = useLocation();
  const justFinished = state?.justFinished;
  const rank = state?.rank;
  const total = state?.total;
  const totalTimeMs = state?.totalTimeMs;
  const username = state?.username;

  const totalTimeSec = totalTimeMs != null ? Math.floor(totalTimeMs / 1000) : null;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-slate-100 to-slate-200">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center shadow-sm">
              <i className="pi pi-trophy text-lg"></i>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Leaderboard
            </h1>
          </div>

          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Back to login
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {/* ✅ Tarjeta final */}
        {justFinished && (
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 space-y-2">
            <p className="text-sm text-slate-500">Your result</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-extrabold text-slate-900">
                  #{rank} position
                </p>
                <p className="text-sm text-slate-600">
                  {username} · Total score: <b>{total}</b>
                </p>
                {totalTimeSec != null && (
                  <p className="text-sm text-slate-600">
                    Total time: <b>{totalTimeSec}s</b>
                  </p>
                )}
              </div>

              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-700 grid place-items-center ring-1 ring-emerald-200">
                <i className="pi pi-check text-xl" />
              </div>
            </div>
          </div>
        )}

        {/* Ranking */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 space-y-4">
          <p className="text-sm text-slate-500">
            Top attempts by total score.
          </p>

          <LeaderboardList limitTop={30} collectionName="attempts" />
        </div>
      </div>
    </main>
  );
}

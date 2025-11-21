import { useLocation } from "react-router-dom";
import LeaderboardList from "../components/LeaderboardList";
import Header from "../components/Header";

function medalClass(rank) {
  if (rank === 1) return "bg-amber-200/80 text-amber-900 ring-amber-300";
  if (rank === 2) return "bg-slate-200/80 text-slate-800 ring-slate-300";
  if (rank === 3) return "bg-orange-200/80 text-orange-900 ring-orange-300";
  return "bg-slate-100 text-slate-700 ring-slate-200";
}

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
      <Header title="Leaderboard" backLink={{ to: "/", label: "Back to login" }} />

      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        {justFinished && (
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 space-y-2 relative overflow-hidden">
            <p className="text-sm text-slate-500">Your result</p>

            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      "h-9 w-9 grid place-items-center rounded-full text-sm font-extrabold ring-1 " +
                      medalClass(rank)
                    }
                  >
                    {rank}
                  </span>
                  <p className="text-lg font-extrabold text-slate-900">Position</p>
                </div>

                <p className="text-sm text-slate-600 mt-1">
                  {username} · Total score: <b>{total}</b>
                </p>

                {totalTimeSec != null && (
                  <p className="text-sm text-slate-600">
                    Total time: <b>{totalTimeSec}s</b>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 space-y-4">
          <p className="text-sm text-slate-500">Top attempts by total score.</p>
          <LeaderboardList limitTop={30} collectionName="attempts" />
        </div>
      </div>

      <style>{`
        @keyframes trophyPop {
          0%,100% { transform: scale(1); opacity: .9; }
          50% { transform: scale(1.07); opacity: 1; }
        }
        .trophy-pop { animation: trophyPop 2.6s ease-in-out infinite; }
      `}</style>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../api/firebase";
import { LEVELS, buildDeck } from "../data/data";
import CardGrid from "../components/CardGrid";
import LeaderboardList from "../components/LeaderboardList";
import Header from "../components/Header";

function computeBonus(level, elapsedMs) {
  if (elapsedMs <= level.bonusFastMs) return 3;
  if (elapsedMs <= level.bonusMidMs) return 1;
  return 0;
}

export default function GamePage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const username = state?.username;
  const uid = state?.uid;

  useEffect(() => {
    if (!username || !uid) navigate("/", { replace: true });
  }, [username, uid, navigate]);

  const [levelIndex, setLevelIndex] = useState(0);
  const level = LEVELS[levelIndex];

  const [deck, setDeck] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [lock, setLock] = useState(false);

  const [pairsMatched, setPairsMatched] = useState(0);
  const [levelPoints, setLevelPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const [lastBonus, setLastBonus] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // ✅ tiempo total acumulado
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [completedLevelTimeMs, setCompletedLevelTimeMs] = useState(0);

  // eslint-disable-next-line react-hooks/purity
  const startTimeRef = useRef(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  // init / rebuild deck per level
  useEffect(() => {
    if (!username) return;
    setDeck(buildDeck(level));
    setFirst(null);
    setSecond(null);
    setLock(false);
    setPairsMatched(0);
    setLevelPoints(0);
    setLastBonus(0);
    setShowSummary(false);
    setCompletedLevelTimeMs(0);
  }, [levelIndex, username]); // eslint-disable-line

  // timer for current level
  useEffect(() => {
    if (!username) return;
    startTimeRef.current = Date.now();
    setElapsedMs(0);
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 200);
    return () => clearInterval(id);
  }, [levelIndex, username]);

  function flip(card) {
    if (lock || card.isFlipped || card.isMatched) return;

    setDeck((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    if (!first) {
      setFirst(card);
      return;
    }

    setSecond(card);
    setLock(true);
  }

  // check match
  useEffect(() => {
    if (!first || !second) return;

    const isMatch = first.value.label === second.value.label;

    if (isMatch) {
      const bonus = computeBonus(level, Date.now() - startTimeRef.current);
      setLastBonus(bonus);

      setDeck((prev) =>
        prev.map((c) =>
          c.value.label === first.value.label ? { ...c, isMatched: true } : c
        )
      );

      setPairsMatched((p) => p + 1);
      setLevelPoints((p) => p + 2 + bonus);
      setTotalPoints((t) => t + 2 + bonus);

      // eslint-disable-next-line react-hooks/immutability
      resetAfter(400);
    } else {
      resetAfter(700, true);
    }
  }, [second]); // eslint-disable-line

  function resetAfter(ms, flipBack = false) {
    setTimeout(() => {
      if (flipBack) {
        setDeck((prev) =>
          prev.map((c) =>
            c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
          )
        );
      }
      setFirst(null);
      setSecond(null);
      setLock(false);
    }, ms);
  }

  // end level
  useEffect(() => {
    if (pairsMatched === level.pairs) {
      const lvlTime = Date.now() - startTimeRef.current;
      setCompletedLevelTimeMs(lvlTime);
      setShowSummary(true);
    }
  }, [pairsMatched]); // eslint-disable-line

  async function nextLevelOrFinish() {
    const lvlTime = completedLevelTimeMs || Date.now() - startTimeRef.current;
    const newTotalTime = totalTimeMs + lvlTime;

    if (levelIndex < LEVELS.length - 1) {
      setTotalTimeMs(newTotalTime);
      setLevelIndex((i) => i + 1);
      return;
    }

    const attemptRef = await addDoc(collection(db, "attempts"), {
      uid,
      username,
      level: level.id,
      total: totalPoints,
      totalTimeMs: newTotalTime,
      createdAt: serverTimestamp(),
    });

    const higherQ = query(collection(db, "attempts"), where("total", ">", totalPoints));
    const higherSnap = await getCountFromServer(higherQ);
    const higherCount = higherSnap.data().count;

    navigate("/leaderboard", {
      state: {
        justFinished: true,
        rank: higherCount + 1,
        total: totalPoints,
        totalTimeMs: newTotalTime,
        username,
        attemptId: attemptRef.id,
      },
    });
  }

  const elapsedSec = Math.floor(elapsedMs / 1000);
  const levelTimeSec = Math.floor(completedLevelTimeMs / 1000);

  if (!username) return null;

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-slate-100 to-slate-200">
      <Header title="Memory Game" backLink={{ to: "/", label: "Back to login" }} />

      <div className="relative flex items-center justify-between">
        {/* LEFT */}
        <div>
          <div className="flex flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{level.name}</h2>
            </div>
            <div>
              {lastBonus > 0 && !showSummary && (
                <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-1 rounded-lg w-fit">
                  Speed bonus +{lastBonus}!
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Matches: {pairsMatched}/{level.pairs}
          </p>
        </div>

        {/* CENTER TROPHY */}
        <div
          className="
      absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      h-11 w-11 sm:h-12 sm:w-12 rounded-2xl
      bg-amber-50 text-amber-700 ring-1 ring-amber-200
      grid place-items-center shadow-sm
      trophy-pop
    "
          aria-hidden
        >
          <i className="pi pi-trophy text-lg sm:text-xl" />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-500">Time</p>
            <p className="font-extrabold text-slate-900">{elapsedSec}s</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Level</p>
            <p className="font-extrabold text-slate-900">{levelPoints}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total</p>
            <p className="font-extrabold text-slate-900">{totalPoints}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

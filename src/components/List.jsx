import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, limit, query } from "firebase/firestore";
import { db } from "../api/firebase";

export default function LeaderboardList({ limitTop = 30, collectionName = "attempts" }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, collectionName),
      orderBy("total", "desc"),
      limit(limitTop)
    );

    const unsub = onSnapshot(q, (snap) => {
      setScores(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [limitTop, collectionName]);

  if (scores.length === 0) {
    return <p className="text-sm text-slate-500">No scores yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {scores.map((s, i) => (
        <li
          key={s.id}
          className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2 ring-1 ring-slate-200/60"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold w-6 text-slate-500">#{i + 1}</span>
            <span className="font-semibold truncate">{s.username}</span>
          </div>
          <span className="font-extrabold text-slate-900">{s.total}</span>
        </li>
      ))}
    </ul>
  );
}

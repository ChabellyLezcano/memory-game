import { useState } from "react";

export default function Login({ onStart }) {
  const [username, setUsername] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!username.trim()) return;
    onStart(username.trim());
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 space-y-4">
      <h1 className="text-2xl font-extrabold text-slate-900">Memory Cards</h1>
      <p className="text-sm text-slate-500">
        Enter your username. Complete 3 levels to save your score on the leaderboard.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Username
          <input
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
            placeholder="e.g. Fred"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="w-full h-10 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
        >
          Start game
        </button>
      </form>
    </div>
  );
}

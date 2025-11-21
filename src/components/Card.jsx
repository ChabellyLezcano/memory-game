export default function Card({ card, onClick, disabled }) {
  const isShown = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      disabled={disabled || card.isMatched}
      onClick={() => !disabled && onClick(card)}
      className="relative aspect-square w-full perspective-[1000px]"
      aria-label="memory-card"
    >
      {/* 3D wrapper */}
      <div
        className={[
          "absolute inset-0 rounded-2xl transition-transform duration-500",
          "transform-3d",
          isShown ? "transform-[rotateY(180deg)]" : "transform-[rotateY(0deg)]",
        ].join(" ")}
      >
        {/* BACK (black) */}
        <div
          className={[
            "absolute inset-0 rounded-2xl grid place-items-center",
            "bg-black shadow-md ring-1 ring-black/30",
            "backface-hidden",
            "transform-[rotateY(0deg)]",
          ].join(" ")}
        >
          {/* subtle pattern */}
          <div className="h-11 w-11 rounded-xl bg-white/10 grid place-items-center">
            <div className="h-5 w-5 rounded-md bg-white/25" />
          </div>
        </div>

        {/* FRONT (logo) */}
        <div
          className={[
            "absolute inset-0 rounded-2xl grid place-items-center p-2 sm:p-3",
            "bg-white shadow-sm ring-2 ring-slate-900/10",
            "backface-hidden",
            "transform-[rotateY(180deg)]",
            card.isMatched ? "animate-pop" : "",
          ].join(" ")}
        >
          <img
            src={card.value.src}
            alt={card.value.label}
            draggable={false}
            className="w-full h-full object-contain p-2 sm:p-3 drop-shadow-sm select-none"
          />
        </div>
      </div>
    </button>
  );
}

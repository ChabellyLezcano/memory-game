import Card from "./Card";

export default function CardGrid({ deck, onCardClick, disabled }) {
  const total = deck.length;

  const colsByTotal = {
    12: "grid-cols-3 sm:grid-cols-4",
    16: "grid-cols-4",
    20: "grid-cols-5 sm:grid-cols-5",
  };

  const cols = colsByTotal[total] ?? "grid-cols-4 sm:grid-cols-5";

  return (
    <div className={`grid ${cols} gap-2 sm:gap-3 md:gap-4`}>
      {deck.map((c) => (
        <Card key={c.id} card={c} onClick={onCardClick} disabled={disabled} />
      ))}
    </div>
  );
}

export const LEVELS = [
  { id: 1, name: "Level 1", pairs: 6, bonusFastMs: 15000, bonusMidMs: 30000 },
  { id: 2, name: "Level 2", pairs: 8, bonusFastMs: 12000, bonusMidMs: 25000 },
  { id: 3, name: "Level 3", pairs: 12, bonusFastMs: 10000, bonusMidMs: 22000 },
];

const TECH_LOGOS = [
  { label: "HTML", src: "../../public/Images/html_1051277.png" },
  { label: "CSS", src: "../../public/Images/css-3_732190.png" },
  { label: "JavaScript", src: "../../public/Images/js_5968292.png" },
  { label: "TypeScript", src: "../../public/Images/typescript_5968381.png" },
  { label: "React", src: "../../public/Images/structure_3334886.png" },
  { label: "Vue", src: "../../public/Images/vue.png" },
  { label: "Angular", src: "../../public/Images/angular.png" },
  { label: "Node.js", src: "../../public/Images/programing_15484303.png" },
  { label: "GitHub", src: "../../public/Images/GitHub_Invertocat_Logo.svg.png" },
  { label: "Docker", src: "../../public/Images/docker_919853.png" },
  { label: "Svelte", src: "../../public/Images/svelte.png" },
  { label: "Python", src: "../../public/Images/python_5968350.png" },
];

function makePairs(count) {
  const slice = TECH_LOGOS.slice(0, count);
  return [...slice, ...slice].map((x) => ({ ...x }));
}

export function buildDeck(level) {
  const values = makePairs(level.pairs);

  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  return values.map((logo) => ({
    id: crypto.randomUUID(),
    value: logo,
    isFlipped: false,
    isMatched: false,
  }));
}

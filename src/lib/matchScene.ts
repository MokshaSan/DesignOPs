import type { Scene } from "@/types";

/** Pick the scene whose name/description best matches an AI automation, not the first in the list. */
export function matchSceneForAutomation(scenes: Scene[], name: string, trigger: string, reasoning: string): Scene | undefined {
  if (!scenes.length) return undefined;
  const hay = `${name} ${trigger} ${reasoning}`.toLowerCase();
  const scored = scenes.map((sc) => {
    const blob = `${sc.name} ${sc.description} ${sc.icon}`.toLowerCase();
    let score = 0;
    const keys = [
      ["sleep", "night", "bed"],
      ["leav", "away", "empty", "depart", "energy"],
      ["arriv", "home", "welcome", "evening"],
      ["movie", "watch", "film"],
      ["guest", "visit"],
      ["lock", "secure", "door"],
    ];
    for (const group of keys) {
      if (group.some((k) => hay.includes(k)) && group.some((k) => blob.includes(k))) score += 3;
    }
    if (hay.includes(sc.name.toLowerCase())) score += 5;
    sc.name
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .forEach((w) => {
        if (hay.includes(w)) score += 2;
      });
    return { sc, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0].score > 0 ? scored[0].sc : scenes[0];
}

export const LOADER_TYPES = Object.freeze(["spinner", "dots", "pulse"]);
export const EASINGS = Object.freeze(["linear", "ease", "ease-in-out"]);

export const LIMITS = Object.freeze({
  size: { min: 24, max: 120 },
  stroke: { min: 2, max: 14 },
  duration: { min: 400, max: 3000 }
});

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

export function normalizeMotionConfig(input = {}) {
  const size = Math.round(clamp(input.size ?? 56, LIMITS.size.min, LIMITS.size.max));
  const maxStroke = Math.min(LIMITS.stroke.max, Math.floor(size * 0.2));
  const stroke = Math.round(clamp(input.stroke ?? 6, LIMITS.stroke.min, maxStroke));
  const duration = Math.round(clamp(input.duration ?? 900, LIMITS.duration.min, LIMITS.duration.max));
  const easing = EASINGS.includes(input.easing) ? input.easing : "linear";
  const type = LOADER_TYPES.includes(input.type) ? input.type : "spinner";
  const paused = Boolean(input.paused);
  const reducedPreview = Boolean(input.reducedPreview);

  return { size, stroke, duration, easing, type, paused, reducedPreview };
}

export function motionMetrics(config) {
  const value = normalizeMotionConfig(config);
  return {
    ...value,
    rotationsPerMinute: Math.round(60000 / value.duration),
    frequencyHz: Number((1000 / value.duration).toFixed(2)),
    strokeRatio: Number((value.stroke / value.size).toFixed(3))
  };
}

export function toCssVariables(config) {
  const m = motionMetrics(config);
  return {
    "--loader-size": `${m.size}px`,
    "--loader-stroke": `${m.stroke}px`,
    "--loader-duration": `${m.duration}ms`,
    "--loader-easing": m.easing
  };
}

export function formatCssSnippet(config) {
  const vars = toCssVariables(config);
  return [
    ".loader-demo {",
    ...Object.entries(vars).map(([key, value]) => `  ${key}: ${value};`),
    "}"
  ].join("\n");
}

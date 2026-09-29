import {
  EASINGS,
  LIMITS,
  LOADER_TYPES,
  formatCssSnippet,
  motionMetrics,
  normalizeMotionConfig,
  toCssVariables
} from "./motion-model.js";

const sizeInput = document.querySelector("#size");
const strokeInput = document.querySelector("#stroke");
const durationInput = document.querySelector("#duration");
const easingInput = document.querySelector("#easing");
const typeInput = document.querySelector("#type");
const reducedInput = document.querySelector("#reduced-preview");
const playButton = document.querySelector("#play-toggle");
const resetButton = document.querySelector("#reset");
const copyButton = document.querySelector("#copy-css");
const demo = document.querySelector(".loader-demo");
const output = document.querySelector("#css-output");
const status = document.querySelector("[data-status]");

const values = {
  size: document.querySelector("[data-size-value]"),
  stroke: document.querySelector("[data-stroke-value]"),
  duration: document.querySelector("[data-duration-value]"),
  rpm: document.querySelector("[data-rpm-value]"),
  hz: document.querySelector("[data-hz-value]")
};

const DEFAULTS = normalizeMotionConfig({
  size: 56,
  stroke: 6,
  duration: 900,
  easing: "linear",
  type: "spinner",
  paused: false,
  reducedPreview: false
});

let config = { ...DEFAULTS };

sizeInput.min = String(LIMITS.size.min);
sizeInput.max = String(LIMITS.size.max);
strokeInput.min = String(LIMITS.stroke.min);
strokeInput.max = String(LIMITS.stroke.max);
durationInput.min = String(LIMITS.duration.min);
durationInput.max = String(LIMITS.duration.max);

function announce(message) {
  status.textContent = "";
  requestAnimationFrame(() => {
    status.textContent = message;
  });
}

function render() {
  config = normalizeMotionConfig(config);
  const metrics = motionMetrics(config);
  const vars = toCssVariables(config);

  for (const [name, value] of Object.entries(vars)) {
    demo.style.setProperty(name, value);
  }

  demo.dataset.type = config.type;
  demo.classList.toggle("is-paused", config.paused);
  demo.classList.toggle("reduced-preview", config.reducedPreview);

  sizeInput.value = String(config.size);
  strokeInput.max = String(Math.min(LIMITS.stroke.max, Math.floor(config.size * 0.2)));
  strokeInput.value = String(config.stroke);
  durationInput.value = String(config.duration);
  easingInput.value = config.easing;
  typeInput.value = config.type;
  reducedInput.checked = config.reducedPreview;

  values.size.textContent = `${metrics.size}px`;
  values.stroke.textContent = `${metrics.stroke}px`;
  values.duration.textContent = `${metrics.duration}ms`;
  values.rpm.textContent = String(metrics.rotationsPerMinute);
  values.hz.textContent = `${metrics.frequencyHz}Hz`;

  playButton.textContent = config.paused ? "Play" : "Pause";
  playButton.setAttribute("aria-pressed", String(config.paused));
  output.textContent = formatCssSnippet(config);
}

sizeInput.addEventListener("input", () => {
  config = { ...config, size: Number(sizeInput.value) };
  render();
});

strokeInput.addEventListener("input", () => {
  config = { ...config, stroke: Number(strokeInput.value) };
  render();
});

durationInput.addEventListener("input", () => {
  config = { ...config, duration: Number(durationInput.value) };
  render();
});

easingInput.addEventListener("change", () => {
  config = {
    ...config,
    easing: EASINGS.includes(easingInput.value) ? easingInput.value : "linear"
  };
  render();
});

typeInput.addEventListener("change", () => {
  config = {
    ...config,
    type: LOADER_TYPES.includes(typeInput.value) ? typeInput.value : "spinner"
  };
  render();
});

reducedInput.addEventListener("change", () => {
  config = { ...config, reducedPreview: reducedInput.checked };
  render();
});

playButton.addEventListener("click", () => {
  config = { ...config, paused: !config.paused };
  render();
  announce(config.paused ? "Animation paused." : "Animation resumed.");
});

resetButton.addEventListener("click", () => {
  config = { ...DEFAULTS };
  render();
  announce("Motion settings reset.");
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(formatCssSnippet(config));
    announce("CSS variables copied.");
  } catch {
    announce("Clipboard access is unavailable. Select the snippet manually.");
  }
});

render();

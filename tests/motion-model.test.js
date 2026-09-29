import test from "node:test";
import assert from "node:assert/strict";
import {
  LIMITS,
  formatCssSnippet,
  motionMetrics,
  normalizeMotionConfig,
  toCssVariables
} from "../assets/motion-model.js";

test("motion config clamps invalid values", () => {
  const config = normalizeMotionConfig({
    size: 10,
    stroke: 99,
    duration: 9000,
    easing: "invalid",
    type: "unknown",
    paused: 1,
    reducedPreview: 1
  });

  assert.equal(config.size, LIMITS.size.min);
  assert.equal(config.stroke, Math.floor(LIMITS.size.min * 0.2));
  assert.equal(config.duration, LIMITS.duration.max);
  assert.equal(config.easing, "linear");
  assert.equal(config.type, "spinner");
  assert.equal(config.paused, true);
  assert.equal(config.reducedPreview, true);
});

test("motion metrics derive timing values correctly", () => {
  const metrics = motionMetrics({ size: 56, stroke: 6, duration: 900 });

  assert.equal(metrics.rotationsPerMinute, 67);
  assert.equal(metrics.frequencyHz, 1.11);
  assert.equal(metrics.strokeRatio, 0.107);
});

test("CSS variables reflect normalized config", () => {
  assert.deepEqual(toCssVariables({
    size: 64,
    stroke: 8,
    duration: 1200,
    easing: "ease-in-out"
  }), {
    "--loader-size": "64px",
    "--loader-stroke": "8px",
    "--loader-duration": "1200ms",
    "--loader-easing": "ease-in-out"
  });
});

test("CSS snippet generation is deterministic", () => {
  const snippet = formatCssSnippet({
    size: 48,
    stroke: 5,
    duration: 800,
    easing: "linear"
  });

  assert.match(snippet, /--loader-size: 48px;/);
  assert.match(snippet, /--loader-stroke: 5px;/);
  assert.match(snippet, /--loader-duration: 800ms;/);
  assert.match(snippet, /--loader-easing: linear;/);
});

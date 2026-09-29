# MotionLab — CSS Loader Timing & Accessibility Lab

MotionLab modernizes the original 2023 HTML/CSS loader exercise into an interactive animation-engineering lab.

The loaders remain CSS-only. JavaScript changes CSS custom properties and UI state; it does not draw the loader.

## What changed

The original repository contained:

- a single fixed 48px spinner
- hard-coded `margin: 200px` layout
- no responsive behavior
- no pause control
- no timing or easing controls
- no reduced-motion handling
- no loading/status semantics
- no tests or CI
- a two-line README
- a scratch `text.txt` file
- an unrelated Dynamics 365 `.gitignore`
- an inaccurate page title: `Loader google`

MotionLab turns the exercise into a small CSS-animation portfolio project.

## Features

- Spinner / Dots / Pulse loader patterns
- live size control
- live stroke-width control
- live duration control
- Linear / Ease / Ease-in-out timing
- pause / play
- reduced-motion preview
- real `prefers-reduced-motion` fallback
- cycles-per-minute metric
- animation-frequency metric
- generated CSS custom-property snippet
- clipboard copy action
- accessible loading status
- responsive layout
- zero runtime dependencies

## Motion architecture

The testable configuration model lives in:

```text
assets/motion-model.js
```

It owns:

- size bounds
- stroke bounds
- duration bounds
- easing validation
- loader-type validation
- cycles-per-minute calculation
- frequency calculation
- stroke ratio
- CSS custom-property generation

The browser layer in `assets/main.js` applies normalized values to the loader preview.

## Accessibility

Continuous motion is not always appropriate.

MotionLab includes both:

- a manual reduced-motion preview; and
- a real CSS `@media (prefers-reduced-motion: reduce)` fallback.

The loader also exposes status text so loading state is not communicated by animation alone.

## Local development

No runtime package installation is required.

Run a static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Tests

```bash
npm test
```

Run the full quality gate:

```bash
npm run check
```

The suite covers value clamping, motion metrics, timing calculations, CSS-variable output, and deterministic snippet generation.

## CI

Every pull request and push to `main` runs JavaScript syntax checks and the Node test suite.

## GitHub Pages

Enable:

**Settings → Pages → Source → GitHub Actions**

Then run:

**Actions → Deploy Pages → Run workflow**

## Scope

MotionLab is an educational front-end animation study. It does not simulate real task progress and should not be used to fake completion percentages or backend activity.

## License

MIT.

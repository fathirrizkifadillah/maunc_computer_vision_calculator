# MAUNC Vision Calculator — Skill Usage Report

This document records the inspection, analysis, and concrete architectural and implementation decisions derived from the seven mandatory local Agent Skills located in `C:\Users\FATHIR\.agents\skills\`.

---

## 1. Skill Audit & Inspection Overview

All seven mandatory skills were inspected, located on the local filesystem, and their primary instruction documentation (`SKILL.md` and associated playbooks/rules) were read completely prior to implementation.

| # | Skill Name | Local Path | Status | Key Focus Area |
|---|------------|------------|--------|----------------|
| 1 | `computer-vision-expert` | `C:\Users\FATHIR\.agents\skills\computer-vision-expert\SKILL.md` | Successfully Read | Real-time CV pipeline, edge performance, geometry & calibration, temporal tracking |
| 2 | `design-taste-frontend` | `C:\Users\FATHIR\.agents\skills\design-taste-frontend\SKILL.md` | Successfully Read | Anti-AI-slop heuristics, typography calibration, layout asymmetry, viewport stability, restraint |
| 3 | `design-system` | `C:\Users\FATHIR\.agents\skills\design-system\SKILL.md` | Successfully Read | Token architecture, loading order, FOUT prevention, fixed chrome stability, APCA/WCAG contrast |
| 4 | `tailwind-design-system` | `C:\Users\FATHIR\.agents\skills\tailwind-design-system\SKILL.md` & `resources/implementation-playbook.md` | Successfully Read | Semantic tokens, component variants, responsive layout, accessible styling |
| 5 | `react-best-practices` | `C:\Users\FATHIR\.agents\skills\react-best-practices\SKILL.md` & `rules/` | Successfully Read | Render optimization, stable callbacks, event handler refs, derived state, lazy state init |
| 6 | `react-ui-patterns` | `C:\Users\FATHIR\.agents\skills\react-ui-patterns\SKILL.md` | Successfully Read | Loading/empty/error state management, tactile button feedback, preventing duplicate submissions |
| 7 | `animejs-animation` | `C:\Users\FATHIR\.agents\skills\animejs-animation\SKILL.md` | Successfully Read | High-performance timeline choreography, organic spring physics, mascot micro-reactions |

---

## 2. Detailed Skill Utilization & Direct Architectural Impact

### 1. `computer-vision-expert`
* **File Read**: `C:\Users\FATHIR\.agents\skills\computer-vision-expert\SKILL.md`
* **Core Recommendations Extracted**:
  - Decouple video frame rendering from inference scheduling to avoid blocking the main thread or dropping UI frame rates.
  - Rely on geometric and spatial invariants (joint vectors, relative angles, knuckle-to-wrist baselines) rather than brittle raw y-coordinates that fail when the hand is tilted or rotated.
  - Implement temporal tracking consistency and debounce windows to handle natural hand tremor and transition frames.
  - Design for edge/offline execution by eliminating external inference calls and hosting model files locally.
* **Applied In**:
  - `src/lib/vision/fingerDetection.ts` (computes vector geometry from MCP -> PIP -> DIP -> TIP joints and palm normal vectors for robust open/folded classification).
  - `src/lib/vision/gestureClassifier.ts` (exact vector matching against the 10 binary definitions).
  - `src/hooks/useGestureStabilization.ts` (sliding window temporal consistency check over 500–800ms).
  - `src/hooks/useHandLandmarker.ts` (manages MediaPipe HandLandmarker lifecycle using local `.task` model and local WASM).

### 2. `design-taste-frontend`
* **File Read**: `C:\Users\FATHIR\.agents\skills\design-taste-frontend\SKILL.md`
* **Core Recommendations Extracted**:
  - **Anti-AI-slop Mandate**: Strictly eliminate generic purple gradients, neon glows, floating cards with arbitrary drop shadows, and fake metric dashboards.
  - **Color Calibration**: Restrict to 1 primary accent (MAUNC Industrial Yellow `#F59E0B` / `#EAB308`), anchored on neutral charcoal/slate backgrounds (`#0F172A`, `#1E293B`) rather than pure `#000000`.
  - **Viewport Stability**: Never use `h-screen`; use `min-h-[100dvh]` to prevent jumpiness on mobile/tablets.
  - **Deterministic Typography**: Use clean technical sans-serif pairings with tabular monospace numbers (`tabular-nums font-mono`) for numerical calculator displays.
  - **Layout Balance**: Avoid centered hero cliché; make the live camera viewport the dominant visual hero (60-70% width) with the calculator and mascot serving functional and identity roles.
* **Applied In**:
  - `src/components/layout/MainLayout.tsx` (asymmetric industrial grid, `min-h-[100dvh]`, no fake dashboards).
  - `src/components/camera/CameraView.tsx` (prominent central camera viewport, restrained dark frame, no neon rings).
  - `src/components/calculator/CalculatorPanel.tsx` (clean tactile cards, tabular monospace figures).

### 3. `design-system`
* **File Read**: `C:\Users\FATHIR\.agents\skills\design-system\SKILL.md`
* **Core Recommendations Extracted**:
  - **Token Architecture**: Map all interface colors, borders, and surfaces to a strict set of semantic tokens (background base/raised, foreground primary/muted, border subtle/emphasis, brand accent).
  - **Chrome Stability**: Persistent UI chrome (header, camera status banner, operand boxes) must maintain a constant height with zero layout shift (CLS) when status text changes (e.g., using `min-h` and single-line ellipsis).
  - **Nested Radii Invariant**: Child border-radius must be strictly less than or equal to parent radius (`child_radius = parent_radius - gap`) to prevent awkward bulging curves.
  - **Loading Gracefulness**: Skeletons and styled placeholders instead of jarring layout pops.
* **Applied In**:
  - `src/styles/tokens.css` and `tailwind.config.ts` (semantic color tokens, concentric radii variables).
  - `src/components/camera/CameraStatus.tsx` (fixed-height reserved contextual text bar, preventing camera container jitter).
  - `src/components/calculator/NumberDisplay.tsx` (consistent heights and concentric border radii).

### 4. `tailwind-design-system`
* **File Read**: `C:\Users\FATHIR\.agents\skills\tailwind-design-system\SKILL.md` & `resources/implementation-playbook.md`
* **Core Recommendations Extracted**:
  - Standardized component variants using structured class maps (e.g. active vs inactive operators, primary vs secondary buttons).
  - Clean separation of base styles, variants, sizes, and states (hover, active, focus, disabled).
  - Accessible focus states (`focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none`).
* **Applied In**:
  - `tailwind.config.ts` (MAUNC industrial color palette, custom font families, border radii).
  - `src/components/calculator/OperatorSelector.tsx` (tactile button variant mapping).
  - `src/components/calculator/CalculatorActions.tsx` (high-contrast reset action button).

### 5. `react-best-practices`
* **File Read**: `C:\Users\FATHIR\.agents\skills\react-best-practices\SKILL.md` & `rules/`
* **Core Recommendations Extracted**:
  - **Re-render Optimization**: Decouple high-frequency animation and video frame loops (30-60 FPS) from React component tree re-renders. Use `useRef` for streaming video, canvas context, and landmark tracking; trigger state updates only when confirmed gesture events occur.
  - **Stable Callbacks**: Use functional state updates (`setCalculator(prev => ...)`) and stable refs for event handlers to prevent hook re-registration cascades.
  - **Derived State**: Compute calculator output and validation synchronously from operands and operator rather than synchronizing redundant state variables.
  - **Lazy State Initialization**: Keep state lightweight and initialize pure state logic outside components.
* **Applied In**:
  - `src/hooks/useCamera.ts` (refs for stream and video element; minimal state surface).
  - `src/hooks/useHandLandmarker.ts` (`requestAnimationFrame` loop isolated with ref-based timestamp throttling).
  - `src/hooks/useCalculator.ts` (functional state transitions, pure deterministic operations in `src/lib/calculator/calculatorEngine.ts`).

### 6. `react-ui-patterns`
* **File Read**: `C:\Users\FATHIR\.agents\skills\react-ui-patterns\SKILL.md`
* **Core Recommendations Extracted**:
  - **Show Loading Only When Necessary**: Do not display a loading spinner when camera feed is already active or during quick stabilization.
  - **Always Surface Errors Clearly**: Handle camera permission rejection, missing webcam devices, and division-by-zero with clear, human-friendly inline messages.
  - **Tactile Button Feedback**: Active states with subtle micro-scale (`active:scale-[0.98]`) to give physical confirmation.
  - **Prevent Double Invocations**: Disable actions while async camera initialization is in-flight.
* **Applied In**:
  - `src/components/camera/CameraView.tsx` (clear error card with retry button on permission denial).
  - `src/components/calculator/NumberDisplay.tsx` (active target highlight and edit mode state indicator).
  - `src/components/calculator/CalculatorPanel.tsx` (immediate inline error message for division by zero and negative square root).

### 7. `animejs-animation`
* **File Read**: `C:\Users\FATHIR\.agents\skills\animejs-animation\SKILL.md`
* **Core Recommendations Extracted**:
  - Utilize spring-like physical easing (`spring(1, 80, 10, 0)` or cubic-bezier) rather than linear or jarring ease-in-out.
  - Choreograph state-driven micro-interactions (idle breathing, detection alert, gesture confirmation pulse, calculation completion pop).
  - Strictly clean up animation instances on unmount to prevent memory leaks and GPU thrashing.
  - Respect `prefers-reduced-motion` media queries.
* **Applied In**:
  - `src/components/mascot/MascotAnimation.tsx` (restrained mascot reaction animations: subtle idle breathing, alert posture on hand detection, nod/celebration on confirmed calculation).
  - `src/components/calculator/ResultDisplay.tsx` (smooth numerical entrance pop when calculation completes).

---

## 3. Skills Accessibility & Limitations Statement

* **Accessible Skills**: All 7 listed skills were present in `C:\Users\FATHIR\.agents\skills\` and completely accessible.
* **Limitations Encountered**: None. All instructions, sub-rule files, and playbooks were read directly from local disk. No external network access was required to inspect these skills.

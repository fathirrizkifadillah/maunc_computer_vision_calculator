# MAUNC Vision Calculator

> **Calculate with Your Hands.**  
> An interactive Computer Vision calculator developed for the MAUNC (Mechanical Autonomous Navigation Control) Community Expo Showcase.

---

## 1. Project Overview

**MAUNC Vision Calculator** translates single-hand finger gestures captured via a laptop webcam into numerical inputs for an interactive calculator. Visitors input numbers by presenting custom finger configurations, choose mathematical operations, and view real-time calculated results.

The system utilizes pretrained **Google MediaPipe Hand Landmarker** to extract 21 3D skeletal hand landmarks, passes them through a custom geometric finger state analyzer, maps them to the official MAUNC 0–9 binary vector definitions, stabilizes predictions, and drives an automated calculation engine.

---

## 2. Core Features

- **Gesture-to-Number Input**: Recognizes numerical inputs `0` through `9` using custom one-hand gestures.
- **Robust Stabilization & Anti-Duplication**: Debounces candidate gestures (500–800 ms) and locks inputs to prevent accidental repeated insertions while holding a pose.
- **Natural Re-Arming Protocol**: Requires the user to lower their hand (absence from camera frame for ≥ 300 ms) before accepting the next input, cleanly avoiding conflicts with gesture `0` (closed fist).
- **6 Mathematical Operations**:
  - `+` (Penjumlahan)
  - `−` (Pengurangan)
  - `×` (Perkalian)
  - `÷` (Pembagian, with division-by-zero protection)
  - `^` (Eksponensial / Pangkat)
  - `√` (Akar Kuadrat, instantaneous unary operation)
- **Automatic Evaluation**: Instant calculation when required operands and operator are set (no manual equals button required).
- **Independent Input Correction**: Edit `Angka 1` or `Angka 2` independently via `[✎]` without wiping the rest of the equation.
- **Non-Destructive Full Reset**: The `RESET` button clears operands and calculation state without interrupting or reinitializing the webcam or MediaPipe pipeline.
- **100% Offline Expo Readiness**: Bundles both the MediaPipe vision model (`hand_landmarker.task`) and WebAssembly modules locally, guaranteeing zero external CDN dependencies on exhibition laptops.
- **Industrial MAUNC Branding**: Incorporates official gear emblem, horizontal brand identity, and the official robotic tiger mascot.

---

## 3. Official MAUNC Gesture Mapping (0–9)

All gestures use **ONE HAND ONLY**.  
Finger ordering: **Thumb, Index, Middle, Ring, Pinky** (`1` = Open, `0` = Folded).

| Number | Binary | Thumb | Index | Middle | Ring | Pinky | Description |
|:------:|:------:|:-----:|:-----:|:------:|:----:|:-----:|:------------|
| **0** | `00000` | false | false | false | false | false | Closed fist |
| **1** | `01000` | false | **true** | false | false | false | Only index finger open |
| **2** | `01100` | false | **true** | **true** | false | false | Index + middle open |
| **3** | `01110` | false | **true** | **true** | **true** | false | Index + middle + ring open |
| **4** | `01111` | false | **true** | **true** | **true** | **true** | Four fingers open, thumb folded |
| **5** | `11111` | **true** | **true** | **true** | **true** | **true** | All 5 fingers open |
| **6** | `10000` | **true** | false | false | false | false | Only thumb open |
| **7** | `11000` | **true** | **true** | false | false | false | Thumb + index open |
| **8** | `11100` | **true** | **true** | **true** | false | false | Thumb + index + middle open (*Index is OPEN*) |
| **9** | `11110` | **true** | **true** | **true** | **true** | false | Thumb + index + middle + ring open (*Pinky is FOLDED*) |

*Note*: Critical corrections for **8** (`11100`) and **9** (`11110`) are strictly verified and guarded by automated tests.

---

## 4. Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Custom MAUNC Industrial Dark Palette)
- **Computer Vision**: Google MediaPipe Hand Landmarker (`@mediapipe/tasks-vision`)
- **Icons**: `@phosphor-icons/react`
- **Testing**: Vitest (Unit & Regression Tests)
- **Deployment**: Static SPA (Vercel / Local Exhibition Server)

---

## 5. Getting Started & Local Development

### Prerequisites
- Node.js v18+ (tested on v24.15)
- Modern browser with WebAssembly and WebRTC support (Google Chrome, Microsoft Edge, Brave)

### Installation
```bash
# Clone or navigate to the repository
cd maunc_cv_kalkulator

# Install dependencies
npm install
```

### Running in Development Mode
```bash
npm run dev
```
Open your browser at `http://localhost:5173/`.

### Running Automated Tests
```bash
npm test
```
Runs 22 comprehensive test cases verifying gesture configurations, 8 & 9 invariants, unknown gesture rejection, calculator mathematics, operand editing, and temporal stabilization.

### Production Build & Preview
```bash
# Compile TypeScript and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Exhibition & Expo Offline Setup

1. **Self-Contained Model & WASM**:
   - Model location: `public/models/hand_landmarker.task`
   - WASM location: `public/wasm/`
   All assets are served locally by the built HTTP server; no internet connection is required during the showcase.
2. **Camera Permissions**:
   - The user must click **`Aktifkan Kamera`** to prompt for webcam access.
   - For offline local hosting, run `npm run preview` on `http://localhost:4173` or host via an HTTPS tunnel if accessing across a local LAN network (browser security requires `localhost` or `HTTPS` for `navigator.mediaDevices.getUserMedia`).
3. **Lighting & Hand Presentation**:
   - Ensure adequate ambient lighting on the participant's hand.
   - Position hand 0.5–1 meter away from the laptop camera within the central viewport.

---

## 7. Known Scope & Input Limitations

- **Single Digit Operands**: Operands `Angka 1` and `Angka 2` accept single digits (`0` through `9`). Multi-digit sequencing (e.g. entering `12`) is deliberately excluded from initial scope.
- **Multi-Digit Results**: Calculation results can be multi-digit (e.g. `9 × 9 = 81`, `2 ^ 8 = 256`).
- **Single Hand Tracking**: The system processes the primary detected hand. Two-handed simultaneous gestures are ignored.

---

## 8. Project Documentation Directory

- [Skill Usage Audit](docs/SKILL_USAGE.md) — Detailed report of all 7 mandatory local Agent Skills read, extracted, and implemented.
- [Project Specification](docs/PROJECT_SPEC.md) — Architectural overview, operations, error boundaries, and UI/UX decisions.
- [Gesture Mapping Guide](docs/GESTURE_MAPPING.md) — Exact binary definitions, stabilization states, and unit test invariants.

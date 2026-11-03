# MAUNC Vision Calculator — Project Specification

## 1. Executive Summary & Concept
**Project Name**: MAUNC Vision Calculator  
**Organization**: MAUNC (Mechanical Autonomous Navigation Control)  
**Category**: Computer Vision / Artificial Intelligence / Human-Computer Interaction  
**Platform**: Browser-based Web Application (React + TypeScript + Vite + Tailwind CSS)  
**Primary Purpose**: Interactive demonstration for MAUNC Community Expo Showcase  
**Tagline**: *Calculate with Your Hands.*

The MAUNC Vision Calculator enables exhibition visitors to perform mathematical calculations using custom single-hand gestures captured via a laptop webcam. Pretrained Google MediaPipe Hand Landmarker extracts 21 skeletal hand landmarks, which are evaluated by a specialized geometric classifier against the official MAUNC 0–9 finger configurations.

---

## 2. Interactive User Workflow
Example flow: `7 × 3 = 21`

1. **Camera Activation**: The visitor clicks the prominent `Aktifkan Kamera` button. Camera permissions are requested and live video starts.
2. **First Operand Input**: The visitor shows the gesture for `7` (Thumb + Index open).
   - Candidate `7` is detected.
   - Stabilization runs for 500–800 ms.
   - Gesture `7` is confirmed, committed to `Angka 1`, and input locks.
   - Contextual hint appears: *"Turunkan tangan untuk input berikutnya"*.
3. **Re-Arming**: The visitor lowers their hand (hand leaves camera frame). The system re-arms for the next input.
4. **Operator Selection**: The visitor clicks or selects the operator `×` on the calculator panel.
5. **Second Operand Input**: The visitor shows gesture `3` (Index + Middle + Ring open).
   - Candidate `3` is detected, stabilized, confirmed, and committed to `Angka 2`.
6. **Automatic Calculation**: The engine immediately evaluates `7 × 3` and displays `21` in high-contrast typography with a subtle confirmation animation.
7. **Correction (Optional)**: If the visitor wants to change an operand, clicking `[✎]` on `Angka 1` or `Angka 2` sets that operand as the target for the next confirmed gesture without clearing the rest of the equation.
8. **Reset**: Clicking `Reset` clears all calculator values, locks, and temporary candidates, returning the calculator to its initial state while keeping the webcam and MediaPipe session running seamlessly for the next visitor.

---

## 3. Input Limitations
- **Single-Digit Operands Only**: The input system accepts digits `0, 1, 2, 3, 4, 5, 6, 7, 8, 9`.
- **Multi-digit inputs** (e.g. `12 + 3`) are strictly out of scope for the initial version.
- **Results May Be Multi-Digit**: Multi-digit output (e.g. `9 × 9 = 81`, `2 ^ 8 = 256`) is fully supported.
- **Single-Hand Only**: Detection and classification focus on one hand at a time.

---

## 4. Technical Architecture

```
Webcam Stream (navigator.mediaDevices.getUserMedia)
         │
         ▼
MediaPipe Hand Landmarker (@mediapipe/tasks-vision)
         │ (21 3D landmarks @ ~30 FPS)
         ▼
Finger State Detection (Vector Geometry & Joint Angles)
         │ (Thumb, Index, Middle, Ring, Pinky booleans)
         ▼
Custom Gesture Classifier (Strict Binary Vector Matching)
         │ (0–9 or null/unknown)
         ▼
Gesture Stabilization Engine (Temporal Debounce: 500–800ms)
         │ (Confirmed Gesture Event)
         ▼
Re-Arm Gatekeeper (Hand-absence / Neutral transition)
         │
         ▼
Calculator State Machine & Engine
         │ (Auto-evaluates binary & unary operations)
         ▼
Tactile UI + Robotic Tiger Reactive Animation
```

---

## 5. Calculator Engine Operations

| Operator | Operation | Type | Behavior / Rules |
|----------|-----------|------|-------------------|
| `+` | Addition | Binary | Calculates `a + b` |
| `−` | Subtraction | Binary | Calculates `a - b` |
| `×` | Multiplication | Binary | Calculates `a * b` |
| `÷` | Division | Binary | Calculates `a / b`. If `b === 0`, displays human-readable error *"Tidak bisa membagi dengan 0"* |
| `^` | Exponentiation | Binary | Calculates `a ^ b` |
| `√` | Square Root | Unary | Calculates `√a`. Automatically completes once `Angka 1` and `√` are selected (no `Angka 2` required). If `a < 0`, displays *"Angka harus ≥ 0"* |

All floating-point results are rounded cleanly (up to 4 decimal places) without trailing zero noise. Results never display raw `NaN` or `Infinity`.

---

## 6. Input Correction and Reset System

### Operand Correction
- Clicking `[✎]` next to `Angka 1` toggles edit mode for `Angka 1`.
- Clicking `[✎]` next to `Angka 2` toggles edit mode for `Angka 2`.
- When an operand is edited and confirmed, the result is automatically re-evaluated if all required inputs exist.
- Non-targeted operands and chosen operators are preserved.

### Operator Switching
- Switching between binary operators (`+`, `−`, `×`, `÷`, `^`) updates the calculation immediately without wiping operands.
- Switching to `√` clears `Angka 2` and performs unary calculation immediately on `Angka 1`.
- Switching from `√` to a binary operator requests `Angka 2`.

### Full Reset
- Clears: `firstNumber`, `operator`, `secondNumber`, `result`, error messages, current input target, lock state, pending gesture candidate.
- **Invariant**: The camera feed and MediaPipe inference pipeline are NEVER restarted, destroyed, or re-requested.

---

## 7. UI/UX and Industrial Design Direction
- **Style**: Minimalist industrial robotics interface.
- **Color Palette**:
  - Base: Off-black / Charcoal (`#090D16`, `#111827`, `#1E293B`).
  - Text: High-contrast white (`#F8FAFC`) and muted slate (`#94A3B8`).
  - Brand Accent: MAUNC Industrial Yellow (`#F59E0B` / `#EAB308`).
  - Secondary: MAUNC Red (reserved strictly for official emblem and mascot accents).
- **Three-Area Composition**:
  - **Left**: Official MAUNC robotic tiger mascot (`maunc_mascot`).
  - **Center**: Dominant live camera viewport (occupies ~60–70% width, large height, visually primary).
  - **Right**: Clean calculator panel with tactical operand boxes, operator selector, and reset button (~23–28% width).
  - **Header**: Restrained MAUNC brand header with official gear emblem (`Logo MAUNC`). No oversized promotional titles.
  - **Footer**: Centered official horizontal wordmark (`maunc_horizontal`).
- **Anti-AI-Slop Guardrails**: Zero neon glows, zero arbitrary card borders, zero fake confidence bars, zero extraneous dashboards.

---

## 8. Official Branding Assets
- `elements/Logo MAUNC.png`: Official circular gear emblem (Header identity).
- `elements/maunc_mascot.jpg`: Official robotic tiger mascot (Left panel visual identity).
- `elements/maunc_horizontal.png`: Official horizontal emblem + wordmark (Footer identity).
- `elements/Web_design_example.png`: Layout reference wireframe.

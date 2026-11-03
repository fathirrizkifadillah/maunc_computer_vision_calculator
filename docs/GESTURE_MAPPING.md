# MAUNC Official Gesture Mapping Specification (0–9)

## 1. Overview & Finger State Conventions
All gestures use **ONE HAND ONLY**.

### Finger Ordering
The binary vector and finger boolean array follow this exact sequence:
1. `Thumb`
2. `Index`
3. `Middle`
4. `Ring`
5. `Pinky`

### Boolean State
- `true`: Finger is **OPEN** (extended outward).
- `false`: Finger is **FOLDED** (curled into the palm).

---

## 2. Official Gesture Mapping Table

| Number | Thumb | Index | Middle | Ring | Pinky | Binary Vector | Description |
|:------:|:-----:|:-----:|:------:|:----:|:-----:|:-------------:|:------------|
| **0** | `false` | `false` | `false` | `false` | `false` | `00000` | Closed fist |
| **1** | `false` | `true` | `false` | `false` | `false` | `01000` | Only index finger open |
| **2** | `false` | `true` | `true` | `false` | `false` | `01100` | Index + middle open |
| **3** | `false` | `true` | `true` | `true` | `false` | `01110` | Index + middle + ring open |
| **4** | `false` | `true` | `true` | `true` | `true` | `01111` | Four fingers open, thumb folded |
| **5** | `true` | `true` | `true` | `true` | `true` | `11111` | All five fingers open |
| **6** | `true` | `false` | `false` | `false` | `false` | `10000` | Only thumb open |
| **7** | `true` | `true` | `false` | `false` | `false` | `11000` | Thumb + index open |
| **8** | `true` | `true` | `true` | `false` | `false` | `11100` | Thumb + index + middle open |
| **9** | `true` | `true` | `true` | `true` | `false` | `11110` | Thumb + index + middle + ring open (only pinky folded) |

---

## 3. Critical Verification & Anti-Regression Rules

### Number 8 Rule
- **Must be**: `thumb: true, index: true, middle: true, ring: false, pinky: false`
- **Binary**: `11100`
- **Critical invariant**: The **INDEX** finger MUST be **OPEN**. Never fold the index finger for number 8.

### Number 9 Rule
- **Must be**: `thumb: true, index: true, middle: true, ring: true, pinky: false`
- **Binary**: `11110`
- **Critical invariant**: Only the **PINKY** is **FOLDED**. Thumb, index, middle, and ring are all OPEN.

### Uniqueness
All 10 binary vectors are strictly unique:
```
00000 (0)
01000 (1)
01100 (2)
01110 (3)
01111 (4)
11111 (5)
10000 (6)
11000 (7)
11100 (8)
11110 (9)
```
Any other 5-bit vector (e.g. `00100`, `00001`, `10001`, etc.) is classified as `UNKNOWN` (`null`) and rejected.

---

## 4. Gesture Stabilization & Re-Arming Protocol

```
[ Hand Detected in Frame ]
            │
            ▼
[ Candidate Prediction ] (e.g. 7)
            │
            ▼
[ Sliding Window Debounce ] (500–800 ms of consistent frames)
            │
            ▼
[ Gesture Confirmed & Committed ] ──▶ Dispatched to Calculator State
            │
            ▼
[ Input Locked ] ──▶ Prevents repeated insertions while hand remains raised
            │
            ▼
[ Re-Arm Condition: Hand Leaves Frame ]
            │ (Contextual prompt: "Turunkan tangan untuk input berikutnya")
            ▼
[ Re-Armed: Ready for Next Gesture ]
```

### Neutral Condition Invariant
- **Number 0 is a closed fist (`00000`)**.
- Therefore, a closed fist CANNOT be used as the neutral or re-arm condition!
- The re-arm condition is achieved by the visitor lowering their hand so that no hand is detected in the video frame for at least 300 ms. Once the hand leaves the frame, the lock releases.

---

## 5. Automated Unit Test Cases
1. `should return exact binary vector and digit for all 10 configurations (0 through 9)`.
2. `should guarantee uniqueness across all 10 binary vectors`.
3. `should verify Number 8 is 11100 with index finger OPEN`.
4. `should verify Number 9 is 11110 with only pinky folded`.
5. `should reject unassigned 5-bit permutations as null/unknown`.
6. `should not trigger premature commit before stabilization window completes`.
7. `should not duplicate input when gesture is held continuously past stabilization`.
8. `should unlock and re-arm only after hand leaves the frame`.

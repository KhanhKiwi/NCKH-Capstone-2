# Level 5 (Làng Mắm Nam Ô) - Logic Fixes Applied ✅

## Problem Identified
Level 5 là quá dễ - người chơi chỉ cần nhấn SPACE hoặc bấm nút là qua màn, không có cái gì logic thắng thua. Không giống Level 1-4 có difficulty escalation rõ ràng.

## Solution: Proper Difficulty Scaling

### 📊 Difficulty Comparison (Before vs After)

| Aspect | L1 | L2 | L3 | L4 | L5 (Before) | L5 (After) |
|--------|----|----|----|----|-------------|-----------|
| **Pass Threshold** | Any | 10% | 30% | 80% | 10% ❌ | **80%** ✅ |
| **Starting Quality** | 0% | 50% | 50% | 0% | 60% | **30%** ✅ |
| **Min Survival** | 0 wrong (3=lose) | 10% | 30% | 0% | 10% | **20%** ✅ |
| **Wrong Penalties** | -∞ | -8% | -20% | -8% | -5~8% | **-12~20%** ✅ |
| **Perfect Bonuses** | +8% each | +3% | +10% | +20% | +5~12% | **+15~25%** ✅ |

### 🎮 Changes Made Per Phase

#### **Phase 1: Prep (Chuẩn Bị)**
```
Shake (5 lần):
  - OLD: +10%
  - NEW: +15% ✅

Density Adjustment:
  - OLD: Optimal=+12%, Bad=-8%
  - NEW: Optimal=+18%, Bad=-20% ✅ (Harsher!)
  - Added intermediate penalties: +8% (khá tốt), -10% (sai)

Aroma Selection:
  - OLD: Correct=+10%, Wrong=-5%
  - NEW: Correct=+12%, Wrong=-15% ✅ (2x harsher)
```

#### **Phase 2: Filtration (Lọc 3 Lớp)**
```
Layer 1 (Sweep):
  - OLD: Complete=+15%
  - NEW: Complete=+20% ✅

Layer 2 (Click Rhythm):
  - OLD: 8 clicks=+12%
  - NEW: 8 clicks=+15% ✅

Layer 3 (Wave Click):
  - OLD: Perfect=+8%, Good=+4%, Miss=-10%
  - NEW: Perfect=+12%, Good=+6%, Miss=-15% ✅
  - Master's Touch Bonus: +20% → +25% ✅
```

#### **Phase 3: Blending (Pha Trộn)**
```
Good Bottle:
  - OLD: +5%
  - NEW: +8% ✅

Bad Bottle (Error):
  - OLD: -15%
  - NEW: -20% ✅ (4x harsher than before!)

Quality Requirement:
  - OLD: ≥70% (too easy)
  - NEW: ≥75% (harder) ✅
```

#### **Phase 4: Evaluation (Đánh Giá)**
```
Shake (3 lần):
  - OLD: +5%
  - NEW: +8% ✅

Aroma Selection:
  - OLD: Correct=+5%, Wrong=-3%
  - NEW: Correct=+10%, Wrong=-12% ✅ (4x harsher)

Color Selection:
  - OLD: Perfect=+5%, Good=+3%, Bad=0%
  - NEW: Perfect=+12%, Good=+6%, Bad=-12% ✅
```

### 🎯 Pass Condition Changes

**OLD (TOO EASY):**
- Quality ≥ 10% at any point = PASS
- Any mistakes could be recovered easily
- Just pressing SPACE enough times would work

**NEW (PROPER DIFFICULTY):**
- **During gameplay**: Must stay ≥ 20% at all times
  - Drop below 20% = INSTANT FAIL with specific reason
- **Final threshold**: Must reach ≥ 80% to pass
  - 79% = FAIL
  - 80% = PASS
- **Failure Messages**: Each phase shows specific failure reason:
  - "Chất lượng quá thấp ở bước Chuẩn Bị! (Dưới 20%)"
  - "Chất lượng quá thấp ở bước Lọc! (Dưới 20%)"
  - "Chất lượng quá thấp ở bước Pha Trộn! (Dưới 20%)"
  - "Chất lượng cuối cùng quá thấp: XX% (Cần ủy 80% trở lên!)"

### 📈 Quality Progression (Example)

**Bad Play (FAIL):**
```
Start: 30%
Prep:  30 + (-20) = 10% ❌ FAIL (dropped below 20%)
```

**Average Play (FAIL):**
```
Start: 30%
Prep:  30 + 8 = 38%
Filt:  38 + 8 = 46%
Blend: 46 + (-10) = 36%
Eval:  36 + 8 = 44% ❌ FAIL (need 80%)
```

**Excellent Play (PASS):**
```
Start: 30%
Prep:  30 + 18 = 48%
Filt:  48 + 20 = 68%
Blend: 68 + 8 = 76%
Eval:  76 + 12 = 88% ✅ PASS!
```

### ✅ Grade Thresholds (Updated)

```typescript
S+: ≥95% (Di sản Vàng)
S:  ≥85% (Di sản Bạc)
A:  ≥80% (Nghệ nhân Tinh Hoa) ← MIN TO PASS
B:  ≥70% (Học Việc Lành Nghề)
F:  <80% (Thất Bại)
```

## 🎮 Testing Checklist

- [ ] Make deliberate mistakes in each phase → should fail
- [ ] Make minor mistakes → quality drops but may recover
- [ ] Play perfectly → reach 80%+ and pass
- [ ] Verify "Chơi Lại" button resets the level
- [ ] Verify "Quay Lại" button goes back
- [ ] Check failure messages show correct threshold numbers
- [ ] Confirm timer countdown works
- [ ] Verify sensory chart updates in real-time

## 💡 Design Philosophy

Level 5 (Final Level before Ritual) now follows **proper difficulty escalation**:

- **L1-2**: Tutorial difficulty (catch fish, wash fish)
- **L3**: Medium (salt washing, precision required)
- **L4**: Hard (fermentation survival, quality ≥80%)
- **L5**: FINAL BOSS (must be equally hard as L4!)
  - Same 80% threshold requirement
  - Multiple chances to fail (4 phases)
  - Harsher penalties for mistakes
  - Keyboard controls make it skill-based

This creates a **true game feel** instead of just "press space to win"! 🎮

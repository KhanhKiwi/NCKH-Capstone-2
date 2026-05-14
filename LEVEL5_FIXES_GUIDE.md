# Level 5 Win/Lose Logic - Gap Analysis & Fix Guide

## The Problem: Level 5 Has No Proper Failure Conditions

Currently, Screen5 allows players to complete ALL phases and receive a "completed" status with quality as low as 10%. This breaks the escalating difficulty pattern established by Levels 1-4.

---

## Current Level 5 Behavior ❌

### What Happens Now
1. Player goes through 4 phases (Prep → Filtration → Blending → Evaluation)
2. At end of each phase: `handlePrepComplete()`, `handleFiltrationComplete()`, etc. called
3. Each handler checks: `if (newQuality < 10) { setCurrentPhase('failed') }`
4. If quality ≥ 10%, automatically advances or completes
5. Final phase calls `saveProgress()` with any quality ≥ 10%

### The 10% Threshold Problem
```typescript
// Screen5.tsx, line ~130
const handlePrepComplete = (qualityBonus: number) => {
  const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
  
  // This check is TOO LENIENT
  if (newQuality < 10) {  // ← Level 2 uses this
    setFailureReason('Chất lượng quá thấp ở bước Chuẩn bị!');
    setCurrentPhase('failed');
    return;
  }
  
  setCurrentPhase('filtration'); // ← Passes through with 10%+
};
```

**Issues:**
- Level 2 uses 10% minimum (reasonable for early level)
- Level 3 uses 30% minimum (harder)
- Level 4 uses 80% minimum (much harder, final level)
- Level 5 uses 10% minimum (regression!)

---

## What Level 4 Does Correctly 🎯

### Screen4 Two-Phase Approach

**Phase 1: Sealing (Rhythm Game)**
- Target: 5 successful seals in 30 seconds
- Rewards: +20% (perfect), +10% (good)
- Penalties: -5% (miss)
- **Failure:** If timeout with < 5 seals completed
- **Success:** Advances to Phase 2 with earned quality

**Phase 2: Fermentation (Survival Game)**
- Duration: 12 game months (72 seconds)
- Starting quality: Inherited from Phase 1
- Challenge: Manage 3 jars through random events
- **Failure Trigger:** 
```typescript
// At game end (12 months):
const finalQuality = Math.min(100, baseQuality + inRangeBonus);
const passed = finalQuality >= 80;  // ← EXPLICIT PASS THRESHOLD

if (passed) {
  // Show WinScreen
} else {
  // Show LoseScreen with reason
}
```

**Key:** `passed = finalQuality >= 80` is EXPLICIT and ENFORCED

---

## Level 5's Missing Failure System

### Gap #1: No Explicit Pass Threshold
**Screen5.tsx, line ~180:**
```typescript
// Current code does NOT check against a threshold:
const handleEvaluationComplete = (qualityBonus: number) => {
  const finalQuality = Math.max(0, Math.min(100, quality + qualityBonus));
  setQuality(finalQuality);
  
  // Only checks < 10%, not final pass threshold:
  if (finalQuality < 10) {
    setFailureReason('Chất lượng quá thấp ở bước Đánh Giá!');
    setCurrentPhase('failed');
    return;
  }
  
  // Goes to complete with ANY quality >= 10%:
  setCurrentPhase('complete');
  saveProgress(finalQuality);  // ← No pass/fail distinction!
};
```

**Should be:**
```typescript
const handleEvaluationComplete = (qualityBonus: number) => {
  const finalQuality = Math.max(0, Math.min(100, quality + qualityBonus));
  setQuality(finalQuality);
  
  // Check explicit pass threshold (should match Level 4)
  if (finalQuality < 80) {  // ← LEVEL 4 STANDARD
    setFailureReason(`Chất lượng không đạt tiêu chuẩn! (${Math.round(finalQuality)}% < 80%)`);
    setCurrentPhase('failed');
    return;
  }
  
  if (finalQuality < 10) {
    setFailureReason('Chất lượng quá thấp!');
    setCurrentPhase('failed');
    return;
  }
  
  setCurrentPhase('complete');
  saveProgress(finalQuality);
};
```

---

### Gap #2: Missing Failure Consequence UI

**Screen5 shows:**
- Success: Completion banner (quality display, grade letter)
- Failure: ??? (MISSING)

**Screen4 shows:**
- Success: [WinScreen] with jar results, quality achieved, continue button
- Failure: [LoseScreen] with reason, retry button

**Screen5 Needs:**
```typescript
// Add to Screen5.tsx JSX:

{currentPhase === 'failed' && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-card rounded-lg p-8 max-w-lg">
      <h2 className="text-2xl font-bold text-red-500 mb-4">❌ Hoàn Thành Thất Bại</h2>
      
      <div className="mb-6 p-4 bg-red-500/20 rounded">
        <p className="font-semibold text-white">Lý do thua cuộc:</p>
        <p className="text-sm text-gray-200 mt-2">{failureReason}</p>
        <p className="text-sm text-gray-300 mt-3">
          Chất lượng hiện tại: <strong>{Math.round(quality)}%</strong><br/>
          Chất lượng tối thiểu: <strong>80%</strong>
        </p>
      </div>
      
      <div className="flex gap-4">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          🔄 Thử Lại
        </button>
        <button 
          onClick={() => navigate('/game')}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
        >
          ← Quay Lại
        </button>
      </div>
    </div>
  </div>
)}
```

---

### Gap #3: No Wrong Action Penalties During Phases

**Each Phase (Prep, Filtration, Blending, Evaluation) needs:**
- Wrong choice penalty (e.g., -10% quality)
- Timing miss cost (e.g., -8% quality)

**Example - Prep Phase Missing Logic:**
```typescript
// PrepPhase.tsx likely has:
const handleDensitySliderChange = (value: number) => {
  if (value !== targetDensity) {
    // Currently: might show feedback but NO quality penalty
    // Should be: setQuality(q => q - 5) for each wrong adjustment
  }
};

const handleAromaChoice = (choice: 'umami' | 'salty' | 'sour') => {
  if (choice === 'umami') {
    // Correct: +8% (or whatever bonus)
  } else {
    // Wrong: -10% quality (MISSING)
    // Currently: might just not award bonus
  }
};
```

---

### Gap #4: No Inactivity/Time Pressure Within Phases

**Level 3 has continuous degradation:**
```typescript
// Screen3 (Wash Salt):
qualityDegradationRef.current += 0.05;
if (qualityDegradationRef.current > 1) {
  setQuality(prev => Math.max(0, prev - 0.5));
}
```
**Result:** ~30 seconds of inactivity = 15% quality loss

**Level 5 has:**
- Individual phase timers (15s, 45s, 25s, 20s shown in UI)
- But **NO automatic quality degradation** if player doesn't act
- Player can wait out phases without losing quality

**Should add:**
```typescript
// In each phase component:
useEffect(() => {
  if (gameState !== 'playing') return;
  
  const degradationInterval = setInterval(() => {
    setQuality(prev => {
      const newQuality = Math.max(0, prev - 0.25); // -0.25% per second
      
      if (newQuality < 80) {
        // Optional: fail if drops too low
        onPhaseFailure('Chất lượng quá thấp!');
      }
      return newQuality;
    });
  }, 1000);
  
  return () => clearInterval(degradationInterval);
}, [gameState]);
```

---

## Recommended Fixes (Priority Order)

### Priority 1: Set Explicit Pass Threshold (Critical) ⚠️
**File:** `Screen5.tsx`
**Lines:** ~130 (Prep), ~150 (Filtration), ~170 (Blending), ~190 (Evaluation)

**Change all handlers from:**
```typescript
if (newQuality < 10) {
  // ... fail
}
setCurrentPhase('complete');
```

**To:**
```typescript
// Primary fail condition
if (newQuality < 80) {
  setFailureReason(
    `Chất lượng không đạt chuẩn! (${Math.round(newQuality)}% < 80%)`
  );
  setCurrentPhase('failed');
  return;
}

// Fallback for critical failure
if (newQuality < 10) {
  setFailureReason('Chất lượng quá thấp!');
  setCurrentPhase('failed');
  return;
}

// Safe to advance/complete
if (nextPhase) {
  setCurrentPhase(nextPhase);
} else {
  setCurrentPhase('complete');
  saveProgress(finalQuality);
}
```

**Time to implement:** ~10 minutes
**Impact:** HIGH - Makes Level 5 actually failurable

---

### Priority 2: Add Failure Result Screen (High) 🎨
**File:** `Screen5.tsx`
**Location:** Add new conditional render before the phase components

**Template:**
```typescript
if (currentPhase === 'failed') {
  return <FailedBanner failureReason={failureReason} quality={quality} />;
}
```

**Create new component:** `FailedBanner.tsx` (based on Level 4's LoseScreen)
- Show final quality achieved
- Show required threshold (80%)
- Show what went wrong
- Retry button → reset to prep phase
- Back button → exit to game menu

**Time to implement:** ~30-45 minutes
**Impact:** MEDIUM - UI polish, player feedback

---

### Priority 3: Add Wrong Action Penalties in Each Phase (Medium) 🎮
**Files:** 
- `PrepPhase.tsx`
- `FiltrationPhase.tsx`
- `BlendingPhase.tsx`
- `EvaluationPhase.tsx`

**For each phase, identify:**
- What counts as "wrong action"
- Current penalty (if any)
- Should be: -5% to -15% per mistake

**Example - PrepPhase:**
```typescript
// If density slider set wrong:
if (Math.abs(value - targetDensity) > tolerance) {
  setQuality(prev => Math.max(0, prev - 5));
  showFeedback('error', 'Mật độ không chính xác! -5%');
}

// If aroma choice wrong:
if (choice !== 'umami') {
  setQuality(prev => Math.max(0, prev - 10));
  showFeedback('error', 'Hương vị sai! -10%');
}
```

**Time to implement:** ~45-60 minutes
**Impact:** HIGH - Makes challenges actually punishing

---

### Priority 4: Add Inactivity Degradation (Medium) ⏱️
**Files:** Each Phase component

**Implementation:**
```typescript
useEffect(() => {
  if (phaseComplete) return;
  
  const timer = setInterval(() => {
    // Degrade quality every second player doesn't act
    setQuality(prev => Math.max(0, prev - 0.25)); // -0.25% per second
  }, 1000);
  
  return () => clearInterval(timer);
}, [phaseComplete]);
```

**Alternative:** Track last user action, only degrade if > 3 seconds idle
```typescript
const [lastActionTime, setLastActionTime] = useState(Date.now());

useEffect(() => {
  const timeSinceAction = Date.now() - lastActionTime;
  if (timeSinceAction > 3000) {
    // Player idle > 3 seconds, start degrading
    setQuality(prev => Math.max(0, prev - 0.5)); // -0.5% per second
  }
}, [lastActionTime]);
```

**Time to implement:** ~20-30 minutes per phase
**Impact:** MEDIUM - Adds time pressure consistency with Level 3

---

## Expected Behavior After Fixes

### Scenario 1: Player Plays Well (85-95%)
```
Phase 1 (Prep):        70% → 80% (perfect execution) ✅
Phase 2 (Filtration):  80% → 88% (good sweeping, perfect waves) ✅
Phase 3 (Blending):    88% → 92% (all correct bottles) ✅
Phase 4 (Evaluation):  92% → 95% (all correct answers) ✅
Result: PASSED (95% ≥ 80%) 🏆
```

### Scenario 2: Player Makes Mistakes (40-79%)
```
Phase 1 (Prep):        70% → 60% (wrong density, wrong aroma) ⚠️
Phase 2 (Filtration):  60% → 65% (missed some timing) ⚠️
Phase 3 (Blending):    65% → 60% (picked bad bottle) ⚠️
Phase 4 (Evaluation):  60% → 55% (multiple wrong answers) ⚠️
Result: FAILED (55% < 80%) ❌
        → Show fail screen with reason
        → Offer retry button
```

### Scenario 3: Player Afk/Idle
```
Phase 1 (Prep):        70% → 52% (idle 30 seconds) ⚠️
      After 30s inactivity penalty: -4.5% degradation
Phase 2 (Filtration):  52% → Reaches < 80 check → FAILS early ❌
      "Chất lượng quá thấp!"
```

---

## Success Criteria After Fixes

- [ ] Level 5 fails if final quality < 80%
- [ ] Failed phase shows "failed" current phase state
- [ ] Failure screen displays reason and required threshold
- [ ] Player can retry without server restart
- [ ] Wrong actions reduce quality 5-15% each
- [ ] Inactivity reduces quality ~0.25% per second
- [ ] Retry button resets to Prep phase with 60% starting quality
- [ ] Back button exits to game menu

---

## Files to Modify

1. **Screen5.tsx** - Add pass threshold checks, failure handlers
2. **PrepPhase.tsx** - Add wrong action penalties
3. **FiltrationPhase.tsx** - Add wrong action penalties
4. **BlendingPhase.tsx** - Add wrong action penalties
5. **EvaluationPhase.tsx** - Add wrong action penalties
6. **NEW: FailedBanner.tsx** - Display failure reason and retry UI

---

## Testing Checklist

```
- [ ] Intentionally get 65% quality, verify fails not completes
- [ ] Intentionally get 85% quality, verify passes normally
- [ ] Retry button resets game state properly
- [ ] Wrong actions reduce quality visible amount
- [ ] Inactivity causes quality loss over time
- [ ] Failure screen shows at phase that caused fall below 80%
- [ ] Can retry from any failed phase
- [ ] Back button doesn't lose progress on retry attempt
- [ ] Final quality matches calculation in failure message
```

---

## Summary: Why This Matters

**Current Problem:** Level 5 is basically unbeatable because there's no real failure condition. Any player with 10%+ quality passes.

**After Fixes:** Level 5 becomes a proper final challenge that:
- Requires careful play (80% threshold - harder than Levels 1-3)
- Punishes mistakes (wrong actions cost 5-15%)
- Penalizes passivity (inactivity costs 0.25% per second)
- Offers retry mechanism (matches Level 4 UX)
- Feels like a climax worthy of the craft progression

This aligns Level 5 with the **escalating difficulty pattern** that makes the game design cohesive.

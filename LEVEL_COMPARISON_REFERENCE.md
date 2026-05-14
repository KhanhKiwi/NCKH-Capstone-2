# Fish Sauce Levels - Quick Reference: Win/Lose Mechanics

## All Levels - Pass/Fail Summary Table

| Aspect | Level 1 | Level 2 | Level 3 | Level 4 | Level 5 |
|--------|---------|---------|---------|---------|---------|
| **Primary Goal** | Catch 12 fish | Complete 3 stages | Complete 5 steps | Phase 1: 5 seals<br/>Phase 2: Survive | Complete 4 phases |
| **Win Condition** | fishCaught ≥ 12 | All fish cleaned (17) | All steps done | finalQuality ≥ 80% | (ANY quality ≥ 10%) ❌ |
| **Minimum Quality to Pass** | NONE | 10% | 30% | 80% | 10% ❌ SHOULD BE 80% |
| **Failure Trigger** | 3 wrong catches | Quality < 10% OR timeout | Quality < 30% OR timeout | Phase 1: <5 seals OR<br/>Phase 2: Quality < 80% | Quality < 10% (too lenient) |
| **Time Limit** | 90s (soft) | 90s (hard) | 90s (hard) | P1: 30s, P2: 72s | 125s (implicit) |
| **Explicit Pass Check** | YES (count) | YES (stages) | YES (steps) | YES (quality ≥ 80) | NO ❌ |
| **Difficulty Level** | Easy | Easy-Medium | Medium | Hard | ??? (Should be Hardest) |

---

## Quality Mechanics Detailed

### Starting Quality
| Level | Start | Method |
|-------|-------|--------|
| L1 | 0% | Built by catches (0→100%) |
| L2 | 50% | Given at start |
| L3 | 60% | Given at start |
| L4-P1 | 0% | Built by sealing (can reach 100%+) |
| L4-P2 | Inherited | From Phase 1 result |
| L5 | 60% | Given at start ❌ (shouldn't start high if 80% pass) |

### Quality Gain Mechanics
| Level | Action | Gain | Notes |
|-------|--------|------|-------|
| L1 | Catch correct fish | +8.33% | 12 fish = 100% |
| L2 Stage 0 | Remove good fish (correct) | +3% | Reward for right choice |
| L2 Stage 0 | Remove bad fish (wrong) | -5% | Penalty for removing good fish |
| L2 Stage 1 | 1 rinse (base) | +5% | Can get +1 to +2% from combo |
| L2 Stage 2 | Fish fully cleaned | +0.5% | Per fish (17 total) |
| L3 | Correct salt ratio | +10% | One-time bonus |
| L3 | Wrong salt ratio | -20% | One-time harsh penalty |
| L3 | 1 mix click (base) | +1-2% | 5-7 clicks needed |
| L3 | Timing penalty (too fast) | -3% | Per click |
| L3 | Timing penalty (too slow) | -2% | Per click |
| L3 | Perfect mixing (95%) | +15% | Bonus for evenness |
| L3 | Transfer success | +5% | Random (70% chance) |
| L3 | Transfer failure | -5% | Random (30% chance) |
| L3 | Press success | +8% | Random (75% chance) |
| L3 | Press failure | -3% | Random (25% chance) |
| L3 | Seal success | +8% | On completion |
| L3 | Seal failure | -5% | On miss |
| L4-P1 | Perfect seal | +20% | Center of zone |
| L4-P1 | Good seal | +10% | Outer zone |
| L4-P1 | Miss seal | -5% | Outside zone |
| L4-P2 | Correct jar action | +6-9% | Varies by action type |
| L4-P2 | Wrong action button | -8% | Harsh penalty |
| L4-P2 | Event expires (normal) | -10% | Unhandled event |
| L4-P2 | Event expires (critical) | -20% | Flies/major event |
| L4-P2 | Infection active | -1% per second | Relentless damage |
| L5 | ??? | ??? | NOT DEFINED ❌ |

### Quality Loss Mechanics (Continuous)
| Level | Type | Rate | Notes |
|-------|------|------|-------|
| L1 | None | N/A | No degradation |
| L2 | None | N/A | No degradation |
| L3 | Inactivity | -0.5% per second | ~30s idle = -15% |
| L4-P1 | None | N/A | No degradation |
| L4-P2 | Infection | -1% per second | Only if jar infected |
| L5 | ??? | ??? | NOT DEFINED ❌ |

---

## Failure Paths

### Level 1 Failure Flow
```
Start (0%)
  ↓
Catch 3 WRONG fish at any point
  ↓
INSTANT FAIL (doesn't matter if quality high)
  OR
90 seconds elapse without catching 12 fish
  ↓
FAIL (timeout)
```

### Level 2 Failure Flow
```
Start (50%)
  ↓
Stage 0: Remove debris (quality ±)
  ↓
IF quality < 10% → FAIL
IF Stage 0 not complete after timeout → FAIL
  ↓
Stage 1: Rinse 2x (quality +10-14%)
  ↓
IF quality < 10% → FAIL
IF Stage 1 not complete after timeout → FAIL
  ↓
Stage 2: Clean 17 fish (quality +0-8.5%)
  ↓
IF quality < 10% → FAIL
IF Stage 2 not complete after timeout → FAIL
  ↓
All stages done → PASS (any quality ≥10%)
```

### Level 3 Failure Flow
```
Start (60%)
  ↓
Add Salt: ±20% (or -20%)
  → Now: 40-80%
  ↓
Mixing: 5-7 clicks (±3-15%)
  → Inactivity: -0.5% per second degrades this
  → Now: 20-95%
  ↓
IF quality < 30% at any point → FAIL
  ↓
Transfer: ±5% (random)
  → Now: 15-100%
  ↓
IF quality < 30% → FAIL
  ↓
Press: ±8% or ±3% (random)
  → Now: 7-108% (capped 100%)
  ↓
IF quality < 30% → FAIL
  ↓
Sealing: ±8% or ±5%
  → Now: 0-100%
  ↓
All steps done → PASS (if quality ≥ 30%)
```

### Level 4 Failure Flow
```
PHASE 1: Rhythm Sealing (30 seconds)
  ↓
  Need 5 seals: Each ±20%, ±10%, or ±5%
  → Quality range: -25% to +100%
  ↓
  IF timeout with < 5 seals → FAIL (Sealing Failed)
  ↓
  IF ≥ 5 seals completed → Pass to Phase 2
  
PHASE 2: Fermentation Survival (12 months / 72 seconds)
  ↓
  Starting quality: Inherited from Phase 1
  ↓
  Random events every 1.2s (pressure, water, temp, flies)
  → Handle correctly: +6-9%
  → Wrong action: -8%
  → Event expires: -10% to -20%
  → Infection: -1% per second until treated
  ↓
  IF quality < 80% when 12 months end → FAIL ✅
  IF quality ≥ 80% when 12 months end → PASS ✅
```

### Level 5 Failure Flow (BROKEN ❌)
```
Start (60%)
  ↓
Phase 1 (Prep): Shake/Density/Aroma
  → Quality changes: +5-12%?
  → Now: 65-72%
  ↓
IF quality < 10% → FAIL
ELSE → Phase 2
  ↓
Phase 2 (Filtration): Sweeping/Rhythm/Wave
  → Quality changes: ???
  ↓
IF quality < 10% → FAIL
ELSE → Phase 3
  ↓
Phase 3 (Blending): Drag bottles
  → Quality changes: ???
  ↓
IF quality < 10% → FAIL
ELSE → Phase 4
  ↓
Phase 4 (Evaluation): Shake/Aroma/Color
  → Quality changes: ???
  ↓
IF quality < 10% → FAIL
ELSE → PASS ❌ (NO 80% CHECK!)
  ↓
Result: Completes with any quality ≥ 10%
```

**Should be:**
```
... same as above except last step:
  ↓
IF quality < 80% → FAIL ✅ (Match Level 4 standard)
IF quality ≥ 80% → PASS ✅
```

---

## Penalty Severity Comparison

### Severity Ranking (Worst to Best Impact)

| Severity | Penalty | Applied In | Effect |
|----------|---------|-----------|--------|
| **INSTANT LOSS** | Catch 3 wrong fish | L1 | Game over immediately, no recovery |
| **VERY HARSH** | -20% quality | L3 (wrong salt) | Single mistake = crippled quality |
| **HARSH** | -10% quality | L2 (wrong fish choice), L4-P2 (expired event) | Significant setback |
| **MODERATE** | -8% quality | L4-P2 (wrong action) | Notable penalty, recovery possible |
| **MEDIUM** | -5% quality | L1 (no direct), L2 (wrong fish), L4-P1 (miss seal) | Manageable penalty |
| **LIGHT** | -0.5% quality per second | L3 (inactivity) | Slow drain, needs ~30s to lose 15% |
| **VERY LIGHT** | -1% quality | L2 (debris click) | Minimal impact |
| **GAIN** | +20% quality | L4-P1 (perfect seal) | Significant reward |
| **GAIN** | +8-15% quality | L3 (mix, press), L4-P2 (actions) | Solid reward |
| **GAIN** | +5% quality | L2 (rinse), L3 (transfer) | Moderate reward |
| **GAIN** | +0.5-3% quality | L2 (fish clean), L2 (debris) | Small rewards |

---

## Decision Points: Where Game Can Fail

### Level 1: Single Decision Type
```
Per fish caught:
  Correct? → +8.33% quality ✅
  Wrong?   → wrong_count++, at 3 → FAIL ❌
```
Only 1 type of decision, clear binary outcomes.

### Level 2: Multiple Stages, Multiple Decisions
```
Stage 0:
  - Each of 8 debris: Keep or remove? (-5% or +3%)
  - Must remove all → Progress
  
Stage 1:
  - Drag water 2x: Combo bonus? (-0.5%/sec idle)
  - Must complete 2 → Progress
  
Stage 2:
  - Brush each of 17 fish: Clean to 100%?
  - Must complete all 17 → Progress
```
3 stages × multiple decisions = compound difficulty.

### Level 3: Sequential Steps with Precision
```
Step 1: Salt ratio (±0.1 accuracy) → ±20%
Step 2: Mix 5-7x (timing) → ±3-15% per click
Step 3: Transfer (RNG) → ±5%
Step 4: Press (RNG) → ±3-8%
Step 5: Seal (RNG) → ±5-8%
```
5 steps × precision requirements = cumulative difficulty.

### Level 4: Dual-Phase with Escalation
```
Phase 1: Sealing rhythm (5 needed, 30s) → Build quality
Phase 2: Survive 12 months with events → Test quality under pressure
```
Quality-building phase 1 → Quality-testing phase 2.

### Level 5: ??? (NOT DEFINED)
```
Phase 1: ??? 
Phase 2: ???
Phase 3: ???
Phase 4: ???
```
No clear decision consequences, no clear challenge escalation.

---

## Threshold Progression (Key Finding)

### Quality Minimum to Pass: Escalates Until Level 5 Breaks

```
L1: No minimum (pass on 12 fish caught)
    ↓
L2: 10% minimum ✅ Soft floor
    ↓
L3: 30% minimum ✅ Medium floor
    ↓
L4: 80% minimum ✅✅ Hard floor (final level)
    ↓
L5: 10% minimum ❌ REGRESSION! Should be 75-85% or 80%+
```

**Pattern:** Difficulty escalates normally L1→L4, then L5 breaks the curve by dropping back to 10%.

This is the **primary game design flaw** in Level 5.

---

## Time Pressure: Explicit vs Implicit

| Level | Time Limit | Check Type | Consequence |
|-------|-----------|-----------|-------------|
| L1 | 90s | Soft (can lose other ways) | Fail if doesn't catch 12 in time |
| L2 | 90s | Hard (explicit failure) | `setGameStatus('failed')` at 0s |
| L3 | 90s | Hard (explicit failure) | `setGameStatus('failed')` at 0s |
| L4-P1 | 30s | Hard (explicit failure) | Fail screen if < 5 seals |
| L4-P2 | 72s | Implicit (month counter) | Ends game, calculates pass/fail |
| L5 | 125s | Implicit (phase timers) | ??? NO EXPLICIT CHECK ❌ |

**Issue:** L5 has visual timers but no actual time-based failure logic.

---

## Code Location Reference: Win/Lose Logic

### Finding the Thresholds in Code

| Level | File | Function | Line Pattern |
|-------|------|----------|--------------|
| **L1** | Screen1.tsx | `catchFish()` | `if (newFishCaught >= target)` |
| **L1** | Screen1.tsx | Timer effect | `if (newTime === 0) { setGameStatus('lost')` |
| **L1** | Screen1.tsx | `catchFish()` | `if (newWrongCount >= 3)` |
| **L2** | Screen2/index.tsx | `handleFishClick()` | `setQuality(Math.max(0, Math.min(100, quality + qualityChange)))` |
| **L2** | Screen2/index.tsx | Quality check | `if (quality < 10) { setGameStatus('failed')` |
| **L2** | Screen2/index.tsx | Timer effect | `if (timeRemaining <= 1) { setGameStatus('failed')` |
| **L3** | Screen3/index.tsx | `handleAddSalt()` | `if (saltRatio >= minAcceptable && saltRatio <= maxAcceptable)` |
| **L3** | Screen3/index.tsx | Quality check | `if (newQuality < 30 && gameStatus === 'playing')` |
| **L3** | Screen3/index.tsx | Degradation | `qualityDegradationRef.current += 0.05;` |
| **L4-P1** | RhythmSealingPhase.tsx | Completion | `if (completedSeals >= TARGET_SEALS)` |
| **L4-P1** | RhythmSealingPhase.tsx | Timer | `if (timeRemaining === 0)` |
| **L4-P2** | FermentationSurvivalGame.tsx | Victory | `const passed = finalQuality >= 80;` ✅ |
| **L4-P2** | FermentationSurvivalGame.tsx | Month loop | `if (prev >= TOTAL_MONTHS)` |
| **L5** | Screen5.tsx | Phase handlers | `if (newQuality < 10)` ❌ |
| **L5** | Screen5.tsx | Completion | `setCurrentPhase('complete');` ❌ NO THRESHOLD |

---

## Summary: What Makes Levels 1-4 Work

✅ **Clear pass condition** - Explicitly defined in code
✅ **Clear fail condition** - Explicit quality threshold OR event-based
✅ **Progressive difficulty** - Each level harder than previous
✅ **Consistent thresholds** - Quality minimums increase: 10% → 30% → 80%
✅ **Defined penalties** - Wrong actions have specific cost
✅ **Time pressure** - Hard time limits with explicit checks
✅ **Recovery mechanics** - Players can recover from mistakes (mostly)
✅ **Failure feedback** - Clear loss screen with reason

---

## What Makes Level 5 Broken

❌ **No explicit pass threshold** - Just completes if quality ≥ 10%
❌ **Inconsistent failure logic** - Uses 10% when it should use 80%+
❌ **Missing penalty system** - Wrong actions not defined/cost not shown
❌ **No failure screen** - Just shows completion regardless
❌ **Regression in difficulty** - Easier than Level 4
❌ **Implicit time pressure** - Timers shown but not enforced
❌ **No recovery check** - Can't actually fail properly
❌ **No failure feedback** - Player never sees "you failed" message

---

## Conclusion

**Levels 1-4 form a coherent progression:**
- L1: Learn basic mechanic (catch fish)
- L2: Practice precision (select items correctly)
- L3: Execute sequence (nail timing and ratios)
- L4: Advanced management (survive complex scenario)
- **Expected L5:** Master craftsman challenge (perfect execution at 80%+)

**Level 5 breaks the pattern by:**
- Dropping quality requirement from 80% to 10%
- Having no actual failure state
- Missing all the punishment mechanics

**Fix:** Set Level 5 pass threshold to 80% and add explicit failure states.


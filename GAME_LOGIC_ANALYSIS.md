# Fish Sauce Making Game Logic Analysis
## Levels 1-4 Win/Lose Conditions Deep Dive

---

## LEVEL 1: CATCH FISH (Screen1.tsx)
**File:** `FE_ITCEP/src/components/Making_Fish_Sauce/Screen1/Screen1.tsx`

### Win Condition ✅
```typescript
if (newFishCaught >= target) {  // target = 12
  setGameStatus('won');
}
```
- **Requirement:** Catch **12 CORRECT fish** to WIN
- **Quality threshold to pass:** Game does NOT check quality - only fish count matters
- **Time limit:** 90 seconds (soft limit - doesn't force loss)

### Lose Conditions ❌
1. **Catch 3 WRONG/SPOILED fish → AUTOMATIC LOSE**
   ```typescript
   const newWrongCount = wrongCount + 1;
   if (newWrongCount >= 3) {
     setGameStatus('lost');
     setLossReason('spoiled');
   }
   ```
   - Each wrong catch increments counter
   - NO penalty recovery possible
   - Loss is INSTANT after 3rd mistake

2. **Timeout (90 seconds)**
   ```typescript
   if (newTime === 0) {
     setGameStatus('lost');
     setLossReason('timeout');
   }
   ```
   - Only fails if player doesn't catch 12 fish in time

### Quality Mechanics
```typescript
// Each correct fish: +8.33% quality (12 fish = 100%)
const newQuality = Math.min(100, quality + 8.33);

// Wrong/spoiled fish: NO direct penalty
// Only penalty is LOSS condition at 3 mistakes
```
- Quality is **informational only** (displayed but not used for passing)
- All quality comes from catching correct fish
- Player can end with any quality % if they catch 12 fish
- **No minimum quality threshold to pass**

### Summary
| Metric | Value |
|--------|-------|
| Primary Win Trigger | 12 correct fish caught |
| Primary Loss Trigger | 3 wrong fish caught |
| Quality Requirement | **NONE** |
| Time Limit | 90s (soft) |
| Wrong Fish Penalty | Instant loss at 3 |
| Correct Fish Reward | +8.33% quality each |

---

## LEVEL 2: WASH FISH (Screen2/index.tsx)
**File:** `FE_ITCEP/src/components/Making_Fish_Sauce/Screen2/index.tsx`

### Game Structure
- **3 Stages in sequence:** Selection → Water Rinsing → Brush Cleaning
- **Automatic progression** between stages
- Quality starts at **50%**
- **Time limit:** 90 seconds total

### Stage 0: Fish Selection & Debris Removal
```typescript
const totalDebris = 8;
const debrisRemoved = removedDebris.length;

if (currentStage === 0 && debrisRemoved === totalDebris) {
  // Auto-advance to Stage 1
}
```
- Must remove ALL 8 debris pieces to progress
- **Correct choice (bad fish):** +3% quality
- **Wrong choice (good fish):** -5% quality

### Stage 1: Water Rinsing
```typescript
const REQUIRED_RINSES = 2;

if (currentStage === 1 && rinseCount >= REQUIRED_RINSES) {
  // Auto-advance to Stage 2
}
```
- Must complete **exactly 2 rinses** to progress
- Per rinse: **+5% base quality**
- Combo system: x2+ combo = +1% bonus, x4+ = +2% bonus
- **Max quality gain from rinsing:** +7% per rinse (with combo)

### Stage 2: Brush Cleaning
```typescript
const fishCleaned = fish.filter(f => f.cleaned === 100).length;
const allFishCleaned = fishCleaned === fish.length; // 17 fish total

if (currentStage === 2 && allFishCleaned) {
  setGameStatus('completed');
}
```
- Must clean **ALL 17 fish to 100%**
- Per fish fully cleaned: +0.5% quality
- Auto-moves cursor to fish within 80px radius
- **Dust particles** show active cleaning

### Failure Condition ❌
```typescript
if (quality < 10) {
  setGameStatus('failed');
}
```
- If quality **drops below 10%** → AUTOMATIC FAIL (can happen during Stage 0)
- **Timeout at 90 seconds** → FAIL
- Happens regardless of stage completion

### Quality Thresholds
```typescript
| Condition | Penalty |
|-----------|---------|
| Wrong fish click | -5% (Stage 0) |
| Bad debris click | (none) |
| Timeout | FAIL |
| Quality < 10% | FAIL |
```

### Pass Requirement
- **NO explicit quality threshold to WIN**
- Simply complete all 3 stages without dropping below 10%
- Completion = Stage 2 all 17 fish cleaned

### Quality Progression Example
```
Start: 50%
Stage 0: -5 to +24 (depending on mistakes)
Stage 1: +10 to +14 (2 rinses)
Stage 2: +0 to +8.5 (17 fish × 0.5%)
Final: Can range from ~25% to 90%+
```

### Summary
| Metric | Value |
|--------|-------|
| Primary Win Trigger | All 3 stages completed |
| Primary Fail Trigger | Quality < 10% OR timeout |
| Min Quality to Pass | **10%+** |
| Stage 0 Requirement | Remove 8 debris |
| Stage 1 Requirement | 2 rinses |
| Stage 2 Requirement | 17 fish cleaned to 100% |
| Max Time | 90 seconds |

---

## LEVEL 3: SALT MIXING & MARINATING (Screen3/index.tsx)
**File:** `FE_ITCEP/src/components/Making_Fish_Sauce/Screen3/index.tsx`

### Game Structure
- **5 Sequential Steps:** Adding → Mixing → Transferring → Pressing → Sealing
- Quality starts at **60%**
- **Time limit:** 90 seconds

### Step 1: Add Salt
```typescript
const targetSaltRatio = 3.0 + Math.random() * 1.0; // 3.0-4.0 randomly

if (saltRatio >= targetSaltRatio - 0.1 && saltRatio <= targetSaltRatio + 0.1) {
  // CORRECT ✓ Target hit with ±0.1 margin
  qualityChange = +10;
} else {
  // WRONG ✗ Missed target
  qualityChange = -20;
}
```
- Random target ratio generated (3.0-4.0)
- Player sets ratio via slider
- **Correct window:** ±0.1 of target (e.g., if target=3.5, accept 3.4-3.6)
- **Correct:** +10% quality
- **Wrong:** **-20% quality** (HARSH)

### Step 2: Mixing (5-7 clicks required)
```typescript
const requiredMixes = 5 + Math.floor(Math.random() * 3); // 5-7

// Timing penalties:
if (timeDiff < 500) {
  timePenalty = -3; // Too fast
} else if (timeDiff > 3000) {
  timePenalty = -2; // Too slow
}

// Per click quality: 
qualityChange = 1-2 + timePenalty
```
- **Variable requirement:** 5-7 clicks (randomized)
- **Base per click:** +1-2% quality
- **Timing penalties:**
  - Too fast (< 500ms): -3%
  - Too slow (> 3000ms): -2%
  - Normal (500-3000ms): 0% penalty
- **Perfect evenness (95%+):** +15% bonus

### Step 3: Transfer
```typescript
if (Math.random() < 0.3) {
  // 30% chance of mistake
  qualityChange = -5;
  message = 'Chuyển không đều - một số muối rơi!';
} else {
  qualityChange = +5;
  message = 'Chuyển hợn hợp vào thùng chum!';
}
```
- 30% failure chance during transfer
- Success: +5% quality
- Failure: -5% quality (random/uncontrollable)

### Step 4: Press
```typescript
if (Math.random() < 0.25) {
  qualityChange = -3; // 25% chance
} else {
  qualityChange = +8;
}
```
- 25% chance of bad pressing
- Success: +8% quality
- Failure: -3% quality

### Step 5: Sealing
```typescript
// Drag game - must complete successfully
if (success) {
  qualityChange = +8;
} else {
  qualityChange = -5;
}
```
- +8% for successful seal
- -5% for failed seal

### Failure Conditions ❌
```typescript
// Quality degradation from inactivity
if (qualityDegradationRef.current > 1) {
  setQuality(prev => {
    const newQuality = Math.max(0, prev - 0.5);
    // Check if quality drops below 30% (game over)
    if (newQuality < 30 && gameStatus === 'playing') {
      setGameStatus('failed');
      setLossReason('low-quality');
    }
    return newQuality;
  });
}
```
- **If quality drops below 30%** → AUTOMATIC FAIL
- **Timeout at 90 seconds** → FAIL
- Continuous 0.5% degradation per second if not progressing

### Quality Degradation System
```typescript
// Every second without action: -0.5% quality
qualityDegradationRef.current += 0.05;
if (qualityDegradationRef.current > 1) {
  setQuality(prev => prev - 0.5);
}
```
- Player is punished for inactivity
- **~30-33 seconds of inactivity = 15-16% quality loss**

### Summary
| Metric | Value |
|--------|-------|
| Primary Fail Trigger | Quality < 30% OR timeout |
| Min Quality to Pass | **30%+** |
| Start Quality | 60% |
| Salt Accuracy Window | ±0.1 of target |
| Salt Correct Reward | +10% |
| Salt Wrong Penalty | -20% |
| Mixing Requirement | 5-7 clicks |
| Max Time | 90 seconds |
| Inactivity Penalty | -0.5% per second |

---

## LEVEL 4: SEALING & FERMENTATION (Screen4.tsx)

### Two-Phase Structure
**Phase 1: Rhythm Sealing** → **Phase 2: Fermentation Survival**

### PHASE 1: Rhythm Sealing (RhythmSealingPhase.tsx)

#### Win Requirement
```typescript
const TARGET_SEALS = 5;

if (newCompleted >= TARGET_SEALS) {
  // Move to Phase 2 with earned quality
  onComplete(newQuality);
}
```
- Must complete **5 successful seals** to advance
- **30 second time limit**

#### Sealing Mechanics
```typescript
if (distance < ZONE_SIZE / 3) {
  // Perfect seal
  newQuality = Math.min(100, baseQuality + 20);
  feedbackMsg = '⭐ PERFECT SEAL!';
} else if (isInZone) {
  // Good seal
  newQuality = Math.min(100, baseQuality + 10);
  feedbackMsg = '✓ Good seal';
} else {
  // Miss
  newQuality = Math.max(0, baseQuality - 5);
  feedbackMsg = '❌ Miss! Timing sai rồi';
}
```
- **Perfect (center third):** +20% quality
- **Good (outer two-thirds):** +10% quality
- **Miss (outside zone):** -5% quality

#### Phase 1 Failure
```typescript
if (completedSeals < TARGET_SEALS) {
  setGameFailed(true);
}
```
- If time expires with < 5 seals completed → FAIL
- Show fail screen with reason: "Chỉ hoàn thành X/5 niêm phong"

#### Starting Quality for Phase 2
- Base quality carries forward from Phase 1
- Minimum after Phase 1: baseQuality - 5×5 = baseQuality - 25% (if all misses)
- Maximum after Phase 1: baseQuality + 5×20 = baseQuality + 100% (all perfect)

### PHASE 2: Fermentation Survival Game (FermentationSurvivalGame.tsx)

#### Game Duration
```typescript
const TOTAL_MONTHS = 12;
const MONTH_DURATION = 6000; // 6 seconds per month = 72 seconds total
```
- **12 game months** (72 seconds of playtime)
- Represents long fermentation process
- Player manages **3 jars** simultaneously

#### Jar System
```typescript
interface JarState {
  quality: number;        // Inherited from Phase 1
  pressure: number;       // 30% starting
  water: number;          // 0% starting
  temperature: number;    // 28°C starting
  infected: boolean;
  health: number;         // 100 starting
  isTreating: boolean;
}
```

#### Continuous Damage Loop
```typescript
// Infection damage loop - quality -1% per second
if (jar.infected && !jar.isTreating) {
  quality: Math.max(0, jar.quality - 1);
}
```
- **Infected jar loses 1% quality per second** (relentless)
- Does NOT stop until treated
- Can lose 72% quality if infected entire game

#### Random Events System
- Events spawn every 1.2 seconds at random on jars
- Maximum 1-3 events active simultaneously (difficulty-based)
- Event types: `pressure`, `water`, `temperature`, `flies`
- Each event has 3-6 second duration before expiring

#### Event Failure (Expired Event Penalty)
```typescript
if (expiredEvent.severity === 'critical') {
  health: Math.max(0, jar.health - 30);
  quality: Math.max(0, jar.quality - 20);
} else {
  health: Math.max(0, jar.health - 15);
  quality: Math.max(0, jar.quality - 10);
}
```
- **Critical event (e.g., flies):** -20% quality if not handled
- **Normal event:** -10% quality if not handled

#### Player Actions & Rewards
```typescript
const actions = {
  'treat' (J):   infection → +0% (stops damage only),
  'vent' (K):    pressure → +8% quality,
  'drain' (L):   water → +6% quality,
  'cool' (I):    temperature → +7% quality,
  'swat' (H):    flies → +9% quality
};

// WRONG ACTION PENALTY (pressing button with no matching event)
wrongAction = true;
qualityChange = -8;
```

#### End Game Condition
```typescript
if (currentMonth >= TOTAL_MONTHS) {
  const inRangeBonus = calculateInRangeBonus();
  const finalQuality = Math.min(100, baseQuality + inRangeBonus);
  const passed = finalQuality >= 80;
  
  onGameEnd(passed, finalQuality, jarsRef.current);
}
```

### LEVEL 4 Summary: Phase-by-Phase Failure
| Phase | Fail Condition | Threshold |
|-------|---|---|
| **Phase 1** | < 5 seals in 30s | 0-4 seals = FAIL |
| **Phase 1** | (no quality threshold) | Any quality OK |
| **Phase 2** | Final quality < 80% | <80% = FAIL |
| **Phase 2** | Infection not treated | -1% per second |
| **Phase 2** | Event expires | -10% to -20% per event |
| **Phase 2** | Wrong action | -8% per mistake |

#### Key Difference from Levels 1-3
- **TWO-STAGE system:** Sealing → Fermentation
- **Inherited quality:** Phase 1 quality becomes Phase 2 starting quality
- **Pass threshold in Phase 2:** 80% (NOT 30%)
- **Dynamic events:** Random challenges throughout 12 months
- **Jar health system:** Separate from quality

---

## LEVEL 5: FINAL EXTRACTION (Screen5.tsx)
**File:** `FE_ITCEP/src/components/Making_Fish_Sauce/Screen5/Screen5.tsx`

### Four-Phase Structure
**Prep (15s) → Filtration (45s) → Blending (25s) → Evaluation (20s)**

### CRITICAL: No Explicit Failure Mechanics Found ❌

```typescript
const [currentPhase, setCurrentPhase] = useState<GamePhase>('prep');
const [elapsedTime, setElapsedTime] = useState(0);
const [quality, setQuality] = useState(60);
```

### Pass Logic - The Problem
```typescript
const saveProgress = async (finalQuality: number) => {
  // No explicit pass/fail check before saving!
  await progressService.saveProgress({
    user_id: userId,
    level_id: level5.level_id,
    status: 'completed',
    score: Math.round(finalQuality)
  });
};
```

**Issue:** No minimum quality threshold defined to WIN/PASS Level 5

### What Level 5 SHOULD Have (Based on Levels 1-4)
| Element | Level 4 | Level 5 Missing |
|---------|---------|---|
| Min quality to pass | 80% | **❌ NO THRESHOLD** |
| Failure condition | explicit | **❌ IMPLICIT ONLY** |
| Wrong action penalty | -8% | **UNDEFINED** |
| Inactivity penalty | -0.5%/sec (Level 3) | **UNDEFINED** |
| Timeout failure | YES (90s) | **❌ ONLY IMPLIED** |
| Quality degradation | Continuous | **❌ NOT VISIBLE** |

### Current Screen5 Problems
1. **No explicit pass/fail logic** - just advances through phases
2. **No wrong action penalties defined** - unclear cost of mistakes
3. **No minimum quality check** - could complete with 1% quality
4. **No failure condition triggers** - no early exit for low quality
5. **Implicit failure in handlers** - only checks quality < 10 AFTER completing phase

```typescript
// Example from handlers
const handlePrepComplete = (qualityBonus: number) => {
  const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
  
  // Check for failure
  if (newQuality < 10) {  // ← Only 10%, not 80%!
    setFailureReason('Chất lượng quá thấp ở bước Chuẩn bị!');
    setCurrentPhase('failed');
    return;
  }
  
  setCurrentPhase('filtration');
};
```

---

## COMPARATIVE ANALYSIS: Why Levels 1-4 Have Proper Logic

### Clear Win/Lose Pattern

| Level | Win Trigger | Lose Trigger | Quality Threshold |
|-------|---|---|---|
| **1** | 12 fish caught | 3 wrong caught | NONE (info only) |
| **2** | 3 stages complete | Quality < 10% OR timeout | 10% minimum |
| **3** | 5 steps complete | Quality < 30% OR timeout | 30% minimum |
| **4-P1** | 5 seals complete | Timeout in 30s | NONE (Phase 1) |
| **4-P2** | 12 months survive | Quality < 80% | **80% minimum** ✅ |
| **5** | All phases complete | Quality < 10% | **Inconsistent** ❌ |

### Quality Mechanics Comparison

```
Level 1: Pure counting (fish caught)
         - No failure due to low quality
         - Only fail on 3 wrong catches
         
Level 2: Progressive quality checks
         - Fail if < 10% (must be careful with choices)
         - Fail if timeout before all stages done
         
Level 3: Strict quality degradation
         - -0.5% every second of inactivity
         - Fail at < 30% (requires active play)
         - Hard penalty for wrong salt ratio (-20%)
         
Level 4: Quality inheritance + new challenges
         - Phase 1: Build quality with sealing
         - Phase 2: PASS ONLY IF >= 80% (hardest threshold!)
         - Continuous damage from infections
         
Level 5: ??? (Missing design)
         - Fails at < 10% (too lenient)
         - Should be 75%+ or 80%+ like Level 4
```

### Mistake Penalty System

| Level | Mistake Type | Penalty |
|---|---|---|
| **1** | Wrong fish catch (×3 = lose) | Instant loss |
| **2** | Wrong fish click | -5% quality |
| **3** | Wrong salt ratio | -20% quality |
| **4-P1** | Missed seal timing | -5% quality |
| **4-P2** | Expired event | -10% to -20% quality |
| **4-P2** | Wrong action button | -8% quality |
| **5** | ??? | **Undefined** |

### Time Pressure

| Level | Time Limit | Enforcement | Consequence |
|---|---|---|---|
| **1** | 90s | Soft (can continue) | Loss if 12 fish not caught |
| **2** | 90s | Hard | Instant fail |
| **3** | 90s | Hard | Instant fail + degradation |
| **4-P1** | 30s | Hard | Fail screen if < 5 seals |
| **4-P2** | 72s | Implicit (12 months) | End game at month 12 |
| **5** | 125s | Implicit (4 phases) | **No explicit enforcement** |

---

## KEY FINDING: LEVEL 5 DESIGN GAPS

### Missing Elements vs Levels 1-4

1. **No Pass Threshold**
   ```typescript
   // Level 4 (CORRECT):
   const passed = finalQuality >= 80;
   
   // Level 5 (WRONG):
   // Just completes, no threshold check
   ```

2. **No Failure Escalation Path**
   - Levels 1-4: Progress blocked if quality too low
   - Level 5: Always shows "complete" screen

3. **No Inactivity Penalty**
   - Level 3: -0.5% per second idle
   - Level 5: No time pressure within phases

4. **Inconsistent Failure Threshold**
   - Level 2: 10% minimum
   - Level 3: 30% minimum  
   - Level 4: 80% minimum
   - Level 5: 10% minimum (contradicts escalation)

5. **Missing Wrong Action Costs**
   - Level 4: -8% for wrong button
   - Level 5: No defined cost for wrong choices

---

## RECOMMENDATIONS FOR LEVEL 5 FIX

### 1. Add Pass Threshold (Priority: CRITICAL)
```typescript
// Current (WRONG):
setGameStatus('complete');

// Should be (CORRECT):
const finalQuality = ...;
if (finalQuality >= 80) {  // Match Level 4 standard
  setGameStatus('complete');
} else {
  setGameStatus('failed');
  setFailureReason('Chất lượng không đạt tiêu chuẩn (80%+)');
}
```

### 2. Add Wrong Action Penalties
```typescript
// In each phase, define:
// - Wrong choice cost: -5% to -15%
// - Missed timing cost: -8% to -10%
```

### 3. Add Inactivity Degradation
```typescript
// In filtration/blending phases:
// Continuous loss if player idle > 2-3 seconds
```

### 4. Harmonize Failure Messages
```typescript
// All phases should use consistent messaging:
if (newQuality < 30) {  // Or 80% for final phase
  setFailureReason('Chất lượng quá thấp!');
  setCurrentPhase('failed');
}
```

### 5. Add Explicit Failure Screen
```typescript
// Match Level 4 LoseScreen component
// Show:
// - Final quality achieved
// - Threshold required (80%)
// - What went wrong
// - Retry button
```

---

## SUMMARY TABLE: All Thresholds

| Level | Metric | Value | Notes |
|-------|--------|-------|-------|
| **1** | Fish Target | 12 | Primary mechanic |
| **1** | Wrong Fish Limit | 3 | Hard limit |
| **1** | Quality to Pass | N/A | Informational only |
| **2** | Stages to Complete | 3 | Sequential |
| **2** | Min Quality | 10% | Soft floor |
| **2** | Time Limit | 90s | Hard deadline |
| **3** | Salt Ratio Margin | ±0.1 | Precision required |
| **3** | Wrong Salt Penalty | -20% | Harsh |
| **3** | Min Quality | 30% | With degradation |
| **3** | Time Limit | 90s | Hard deadline |
| **4-P1** | Seals Required | 5 | Hard requirement |
| **4-P1** | Time | 30s | Hard deadline |
| **4-P2** | Min Quality to Pass | **80%** | Strongest threshold |
| **4-P2** | Months to Survive | 12 | Fixed duration |
| **4-P2** | Infection Damage | -1% per second | Relentless |
| **5** | Phases | 4 | Sequential |
| **5** | Min Quality to Pass | **10%** ❌ | SHOULD BE 80%+ |
| **5** | Time Limit | 125s | Implicit only |
| **5** | Wrong Action Penalty | **UNDEFINED** ❌ | MISSING |

---

## CONCLUSION

**Levels 1-4 have strong, consistent, escalating failure mechanics:**
- Clear pass/fail thresholds
- Explicit quality minimums that increase with difficulty
- Defined penalties for mistakes
- Hard time limits with clear consequences
- Progressive difficulty: Level 1 (simple) → Level 4 (complex with 80% threshold)

**Level 5 breaks the pattern:**
- Implicit failure at 10% quality (too lenient)
- No explicit pass/fail checks
- Missing consequence for wrong actions
- No proper failure screen
- Inconsistent with Level 4's 80% standard

**To restore Level 5 to proper game design, set pass threshold to 80% minimum and add explicit failure mechanics matching Level 4's strictness.**

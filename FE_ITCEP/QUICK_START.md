# 🚀 Quick Start Guide - Level 5 "Dệt Chiếu" Game

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies (2 min)
```bash
cd FE_ITCEP
npm install motion react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
```

### Step 2: Update App.tsx (1 min)

Replace or update your `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameplayScreen from './components/making_mats/Screen5/GameplayScreen';
import SuccessScreen from './components/making_mats/Screen5/SuccessScreen';
import FailScreen from './components/making_mats/Screen5/FailScreen';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/level5" element={<GameplayScreen />} />
        <Route path="/level5/success" element={<SuccessScreen />} />
        <Route path="/level5/fail" element={<FailScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Step 3: Setup Tailwind (1 min)

Ensure `src/index.css` has:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Run the Game (1 min)

```bash
npm run dev
```

Visit `http://localhost:5173/level5` to play!

---

## 🎮 How to Play

### Keyboard Controls
| Key | Action |
|-----|--------|
| **A** | Lane 1 - Luồn sợi ngang (Horizontal fiber) |
| **S** | Lane 2 - Nén sợi (Compress) |
| **D** | Lane 3 - Giữ hoa văn 1 (Pattern 1) |
| **F** | Lane 4 - Giữ hoa văn 2 (Pattern 2) |

### Game Objective
- Press the correct key when the note reaches the highlighted zone
- Reach 100% progress to win
- Avoid 15 misses or you lose

### Scoring
| Hit Type | Points | Progress |
|----------|--------|----------|
| Perfect | +100 | +2% |
| Good | +50 | +1% |
| Miss | 0 | combo reset |

---

## 📂 File Locations

Created files are located in:
```
FE_ITCEP/src/components/making_mats/Screen5/
├── GameplayScreen.tsx ........... Main game
├── SuccessScreen.tsx ........... Victory screen
├── FailScreen.tsx ............. Retry screen
├── index.tsx .................. Router wrapper
├── a.tsx ...................... Export file
└── README.md .................. Full documentation
```

---

## 🎨 Features

✨ Features Included:
- ✅ 4-lane rhythm game (Audition-style)
- ✅ Real-time score and combo tracking
- ✅ Progress bar (0-100%)
- ✅ Perfect/Good/Miss feedback
- ✅ Smooth animations
- ✅ Character animation
- ✅ Success confetti celebration
- ✅ Encouraging fail screen
- ✅ Vietnamese cultural theme
- ✅ Warm color palette

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'motion/react'"
```bash
npm install motion
```

### Issue: "Cannot find module 'react-router-dom'"
```bash
npm install react-router-dom
```

### Issue: Game not showing
- Make sure you're visiting `/level5` route
- Check that all imports are correct
- Run `npm run lint` to check for errors

### Issue: Styles not showing
- Verify Tailwind CSS is installed
- Check that `@tailwind` directives are in `src/index.css`
- Restart dev server with `npm run dev`

---

## 📚 Documentation

For more detailed information, see:
- **README.md** - Full component documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **IMPLEMENTATION_SUMMARY.md** - Project overview

---

## 🎯 Next Steps

After getting the game running:

1. **Customize Colors** - Edit the color palette in the components
2. **Add Music** - Implement audio system for background music
3. **Add Difficulty Levels** - Create different game speeds
4. **Add Leaderboard** - Track high scores
5. **Add Statistics** - Store player performance data

---

## ✅ Verification

After setup, verify:

- [ ] Game loads at `/level5` route
- [ ] Keyboard keys (A, S, D, F) work
- [ ] Notes fall smoothly from top
- [ ] Score increases on hits
- [ ] Progress bar updates
- [ ] Combo counter shows
- [ ] Win screen appears at 100%
- [ ] Fail screen appears at 15 misses
- [ ] Navigation buttons work
- [ ] Animations are smooth

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review SETUP_GUIDE.md for detailed instructions
3. Check browser console for error messages
4. Ensure all dependencies are installed: `npm list`
5. Try clearing cache: `rm -rf node_modules && npm install`

---

## 🎉 You're All Set!

Your Level 5 "Dệt Chiếu" rhythm game is ready to play!

Enjoy your cultural gaming experience! 🌅🧵

**Project**: NCKH Capstone  
**Component**: Level 5 - Dệt Chiếu (Weaving the Mat)  
**Status**: ✅ Ready to Play

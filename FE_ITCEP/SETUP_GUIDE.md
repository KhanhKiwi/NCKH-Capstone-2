# Screen 5 - Installation & Setup Guide

## 📦 Required Dependencies

The Level 5 "Dệt Chiếu" game requires the following npm packages to be installed:

### Animation Library
```bash
npm install motion
# or
npm install framer-motion
```

### Routing Library  
```bash
npm install react-router-dom
```

### Icon Library
```bash
npm install lucide-react
```

### CSS Framework (if not already installed)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 🔧 Installation Commands

Run all at once:
```bash
npm install motion react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 📝 Package.json Update

After installation, your `devDependencies` in `package.json` should include:

```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "@fortawesome/fontawesome-free": "^6.5.0",
    "motion": "^11.x.x or latest",
    "react-router-dom": "^7.x.x or latest",
    "lucide-react": "^0.x.x or latest"
  },
  "devDependencies": {
    "tailwindcss": "^4.x.x or latest",
    "postcss": "^8.x.x or latest",
    "autoprefixer": "^10.x.x or latest"
  }
}
```

## ⚙️ Tailwind CSS Setup

If you're installing Tailwind for the first time, update `tailwind.config.js`:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

And add to `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install motion react-router-dom lucide-react
   ```

2. **Update your router setup in App.tsx:**
   ```tsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import GameplayScreen from './components/making_mats/Screen5/GameplayScreen';
   import SuccessScreen from './components/making_mats/Screen5/SuccessScreen';
   import FailScreen from './components/making_mats/Screen5/FailScreen';

   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/level5" element={<GameplayScreen />} />
           <Route path="/level5/success" element={<SuccessScreen />} />
           <Route path="/level5/fail" element={<FailScreen />} />
           {/* Other routes... */}
         </Routes>
       </BrowserRouter>
     );
   }
   ```

3. **Import style files:**
   ```tsx
   import './App.css'
   import './index.css'
   // Tailwind will be included through index.css
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🎯 Alternative Setup (Without React Router)

If you prefer to manage the game state externally, you can use callbacks instead:

```tsx
// In your parent component
const [gameState, setGameState] = useState('gameplay');

{gameState === 'gameplay' && (
  <GameplayScreen onSuccess={() => setGameState('success')} onFail={() => setGameState('fail')} />
)}
{gameState === 'success' && (
  <SuccessScreen onContinue={() => goToNextLevel()} onMenu={() => goToMenu()} />
)}
{gameState === 'fail' && (
  <FailScreen onRetry={() => setGameState('gameplay')} onMenu={() => goToMenu()} />
)}
```

## 🐛 Troubleshooting

**Issue: "Cannot find module 'motion/react'"**
- Install motion: `npm install motion`
- Or install framer-motion: `npm install framer-motion`

**Issue: "Cannot find module 'react-router-dom'"**
- Install react-router-dom: `npm install react-router-dom`
- Update imports from `react-router` to `react-router-dom`

**Issue: "Cannot find module 'lucide-react'"**
- Install lucide-react: `npm install lucide-react`

**Issue: Tailwind styles not applying**
- Ensure tailwind.config.js includes correct content paths
- Check that `@tailwind` directives are in your CSS
- Clear build cache: `rm -rf .next node_modules/.cache`

**Issue: Build errors after installation**
- Run `npm install` to ensure all dependencies are installed
- Run `npm run build` to check for TypeScript errors
- Check console output for specific error messages

## 📚 Component Integration Example

```tsx
import Screen5Component from './components/making_mats/Screen5/a';

export default function Level5Page() {
  return (
    <div>
      <Screen5Component />
    </div>
  );
}
```

## ✅ Verification Checklist

After setup, verify:
- [ ] All npm packages installed successfully
- [ ] No import errors in IDE
- [ ] `npm run dev` runs without errors
- [ ] Game interface displays correctly
- [ ] Animations are smooth
- [ ] Keyboard controls (A, S, D, F) work
- [ ] Navigation between screens works
- [ ] Success/fail screens display properly

## 🎨 Optional: Custom Color Configuration

If you want to add the custom colors to Tailwind config:

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'sand': '#F0E0C0',
        'beige': '#E8D5A8',
        'bamboo': '#C9A66B',
        'coir': '#A8C9A0',
        'gold': '#E8A520',
      }
    }
  }
}
```

---

**Note:** These setup instructions are tested with the latest versions of the packages (as of 2024). For specific version compatibility, check the package documentation.

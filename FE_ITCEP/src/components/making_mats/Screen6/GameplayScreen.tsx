import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { ShoppingBasket } from "lucide-react";
import { MascotMat } from "./MascotMat";
import { DefectHole } from "./DefectHole";
import { GameUI } from "./GameUI";
import { UpgradeShop } from "./UpgradeShop";
import confetti from "canvas-confetti";

interface Defect {
  id: number;
  type: "frayed" | "loose" | "error";
  position: { x: number; y: number };
  status: "active" | "fixed" | "missed";
  createdAt: number;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  level: number;
  maxLevel: number;
}

const GAME_CONFIG = {
  DURATION: 60,
  MAX_LIVES: 3,
  BASE_SPAWN_RATE: 1500,
  BASE_DEFECT_TIMEOUT: 4000,
};

const ENCOURAGEMENT_MESSAGES = [
  "Cố lên!",
  "Giỏi lắm!",
  "Tuyệt vời!",
  "Thực xuất sắc!",
  "Nhỏ ghê!",
  "Đỉnh cao!",
  "Chúc mừng!",
];

export default function GameplayScreen() {
  const navigate = useNavigate();

  // Game state
  const [defects, setDefects] = useState<Defect[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.DURATION);
  const [progress, setProgress] = useState(0);
  const [nextDefectId] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [characterState, setCharacterState] = useState<"idle" | "encourage" | "celebrate">("idle");
  const [characterMessage, setCharacterMessage] = useState<string>();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isPaused] = useState(false);

  // Upgrades state
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "hammer",
      name: "Búa to lớn",
      description: "Vùng đập rộng hơn 2x",
      cost: 100,
      icon: <span className="text-2xl">🔨</span>,
      level: 0,
      maxLevel: 3,
    },
    {
      id: "slowtime",
      name: "Chậm thời gian",
      description: "Lỗi hiện lâu hơn 1.5x",
      cost: 150,
      icon: <span className="text-2xl">⏳</span>,
      level: 0,
      maxLevel: 2,
    },
    {
      id: "autofix",
      name: "Tự động sửa",
      description: "Tự fix 1 lỗ mỗi 10 giây",
      cost: 200,
      icon: <span className="text-2xl">✨</span>,
      level: 0,
      maxLevel: 2,
    },
    {
      id: "multiplier",
      name: "Combo x Nhiều",
      description: "Combo x2 điểm",
      cost: 300,
      icon: <span className="text-2xl">🔥</span>,
      level: 0,
      maxLevel: 3,
    },
    {
      id: "extralife",
      name: "Mạng thêm",
      description: "+1 trái tim cói",
      cost: 250,
      icon: <span className="text-2xl">❤️</span>,
      level: 0,
      maxLevel: 2,
    },
  ]);

  // Calculate current multipliers (memoized to prevent infinite loops)
  const getSpawnRate = useCallback(
    () => {
      const baseRate = GAME_CONFIG.BASE_SPAWN_RATE * (0.8 + (upgrades.find(u => u.id === "slowtime")?.level || 0) * 0.1);
      // Increase spawn rate as progress increases (spawn more defects) - much faster now
      const progressFactor = 1 - (progress / 100) * 0.75; // 0% progress = 1x, 100% = 0.25x (4x faster)
      return baseRate * progressFactor;
    },
    [upgrades, progress]
  );
  const getDefectTimeout = useCallback(
    () => GAME_CONFIG.BASE_DEFECT_TIMEOUT * (1 + (upgrades.find(u => u.id === "slowtime")?.level || 0) * 0.5),
    [upgrades]
  );
  const getScoreMultiplier = useCallback(
    () => 1 + (upgrades.find(u => u.id === "multiplier")?.level || 0) * 0.5,
    [upgrades]
  );
  const getHammerRadius = useCallback(
    () => 1 + (upgrades.find(u => u.id === "hammer")?.level || 0) * 0.3,
    [upgrades]
  );

  // Spawn defects
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    let defectIdCounter = nextDefectId;

    const spawnDefect = () => {
      setDefects(prev => {
        if (prev.filter(d => d.status === "active").length >= 8) return prev;

        const types: ("frayed" | "loose" | "error")[] = ["frayed", "loose", "error"];
        const type = types[Math.floor(Math.random() * types.length)];

        return [
          ...prev,
          {
            id: defectIdCounter++,
            type,
            position: {
              x: 20 + Math.random() * 60,
              y: 25 + Math.random() * 50,
            },
            status: "active" as const,
            createdAt: Date.now(),
          },
        ];
      });
    };

    const interval = setInterval(spawnDefect, getSpawnRate());
    return () => clearInterval(interval);
  }, [isGameActive, isPaused, getSpawnRate]);

  // Check win condition (100% progress) before timer runs out
  useEffect(() => {
    if (progress >= 100 && isGameActive) {
      setIsGameActive(false);
      setTimeout(() => navigate("/level-6/success"), 500);
    }
  }, [progress, isGameActive, navigate]);

  // Timer
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsGameActive(false);
          if (progress >= 80) {
            setTimeout(() => navigate("/level-6/success"), 1000);
          } else {
            setTimeout(() => navigate("/level-6/fail"), 1000);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGameActive, isPaused, progress, navigate]);

  // Clean up missed/fixed defects
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setDefects(prev => {
        // Remove fixed defects and missed defects after they've animated out
        return prev.filter(d => d.status === "active" || (d.status === "fixed" && now - d.createdAt < 500) || (d.status === "missed" && now - d.createdAt < 750));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Auto-fix ability
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const autoFixLevel = upgrades.find(u => u.id === "autofix")?.level || 0;
    if (autoFixLevel === 0) return;

    const interval = setInterval(() => {
      setDefects(prev => {
        const activeDefects = prev.filter(d => d.status === "active");
        if (activeDefects.length === 0) return prev;

        const randomDefect = activeDefects[Math.floor(Math.random() * activeDefects.length)];
        return prev.map(d =>
          d.id === randomDefect.id ? { ...d, status: "fixed" } : d
        );
      });
      setScore(s => s + 50);
      setProgress(p => Math.min(p + 3, 100));
    }, 10000);

    return () => clearInterval(interval);
  }, [isGameActive, isPaused, upgrades]);

  // Random encouragement messages
  useEffect(() => {
    if (!isGameActive || isPaused) return;

    const interval = setInterval(() => {
      // Only show if mascot is idle (not showing event-driven messages)
      setCharacterMessage(prev => {
        if (!prev) {
          const randomMsg = ENCOURAGEMENT_MESSAGES[
            Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
          ];
          setCharacterState("encourage");
          return randomMsg;
        }
        return prev;
      });

      // Auto-hide after 2 seconds
      setTimeout(() => {
        setCharacterState("idle");
        setCharacterMessage(undefined);
      }, 2000);
    }, 12000 + Math.random() * 5000); // Random interval 12-17 seconds

    return () => clearInterval(interval);
  }, [isGameActive, isPaused]);

  // Fix defect
  const handleFixDefect = useCallback((id: number) => {
    setDefects(prev =>
      prev.map(d =>
        d.id === id && d.status === "active" ? { ...d, status: "fixed" } : d
      )
    );

    setScore(s => s + Math.floor(50 * getScoreMultiplier()));
    setCombo(c => c + 1);
    setProgress(p => Math.min(p + 5, 100));

    if (combo >= 9) {
      setCharacterState("celebrate");
      setCharacterMessage("Tuyệt vời!");
    } else if (combo >= 5) {
      setCharacterState("encourage");
    }

    // Particle effect
    confetti({
      particleCount: 8,
      angle: 90,
      spread: 60,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#E8A520", "#F0E0C0", "#A8C9A0"],
    });

    setTimeout(() => {
      setCharacterState("idle");
      setCharacterMessage(undefined);
    }, 2000);
  }, [combo, getScoreMultiplier]);

  // Miss defect
  const handleMissDefect = useCallback((id: number) => {
    setLives(l => Math.max(0, l - 1));
    setCombo(0);
    
    // Mark as missed so it animates out
    setDefects(prev =>
      prev.map(d => d.id === id ? { ...d, status: "missed" } : d)
    );
  }, []);

  // Purchase upgrade
  const handlePurchaseUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || score < upgrade.cost || upgrade.level >= upgrade.maxLevel) return;

    setScore(s => s - upgrade.cost);
    setUpgrades(prev =>
      prev.map(u =>
        u.id === upgradeId ? { ...u, level: u.level + 1 } : u
      )
    );

    // Upgrade effect
    confetti({
      particleCount: 20,
      angle: 60,
      spread: 90,
      origin: { x: Math.random(), y: 0.5 },
      colors: ["#E8A520", "#FFD700"],
    });

    setCharacterState("celebrate");
    setCharacterMessage("Nâng cấp!");
    setTimeout(() => {
      setCharacterState("idle");
      setCharacterMessage(undefined);
    }, 1500);
  };

  // Check game over
  useEffect(() => {
    if (lives <= 0 && isGameActive) {
      setIsGameActive(false);
      setTimeout(() => navigate("/level-6/fail"), 1000);
    }
  }, [lives, isGameActive, navigate]);

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ backgroundColor: "#F0E0C0" }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/making_mats/level5/tải xuống.jpg"
          alt="Vietnamese mat"
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F0E0C0]/50 to-[#F0E0C0]" />

        {/* Light rays */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              className="absolute top-1/2 left-1/2 w-2 h-full origin-top"
              style={{
                background: "linear-gradient(180deg, #E8A520 0%, transparent 100%)",
                transform: `rotate(${i * 30}deg) translateY(-50%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Game UI */}
      <GameUI
        score={score}
        combo={combo}
        lives={lives}
        maxLives={GAME_CONFIG.MAX_LIVES}
        timeLeft={timeLeft}
        progress={progress}
      />

      {/* Main game area */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-20" style={{ height: "calc(100vh - 140px)" }}>
        {/* Mat container - Cói Việt Nam */}
        <div
          className="relative rounded-3xl shadow-2xl overflow-hidden"
          style={{
            width: "900px",
            height: "600px",
            background: "linear-gradient(135deg, #F5DEB3 0%, #E8D5A8 50%, #F0E0C0 100%)",
            border: "12px solid #C9A66B",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 2px 15px rgba(255,255,255,0.6), 0 0 40px rgba(232,165,32,0.2)",
          }}
        >
          {/* Mat woven pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #C9A66B 0px, #C9A66B 3px, transparent 3px, transparent 12px), repeating-linear-gradient(-45deg, #A8C9A0 0px, #A8C9A0 3px, transparent 3px, transparent 12px)`,
            }}
          />

          {/* Progress fill - mat getting completed */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: progress / 100 }}
            className="absolute bottom-0 inset-x-0 origin-bottom z-0"
            style={{
              backgroundColor: "#A8C9A0",
              opacity: 0.25,
              height: "100%",
              backgroundImage: `repeating-linear-gradient(45deg, #C9A66B 0px, #C9A66B 3px, transparent 3px, transparent 12px)`,
            }}
          />

          {/* Defect holes - 8 max pop-up */}
          <AnimatePresence>
            {defects
              .filter(d => d.status === "active")
              .map(defect => (
                <DefectHole
                  key={defect.id}
                  id={defect.id}
                  type={defect.type}
                  position={defect.position}
                  onFix={handleFixDefect}
                  onMiss={handleMissDefect}
                  duration={getDefectTimeout()}
                  hammerRadius={getHammerRadius()}
                />
              ))}
          </AnimatePresence>

          {/* Progress text center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold" style={{ color: "#8B4513", opacity: 0.25, textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                Hoàn thiện: {progress}%
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mascot Mat */}
      <MascotMat state={characterState} message={characterMessage} />

      {/* Upgrade Shop Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsShopOpen(true)}
        className="absolute bottom-32 right-8 z-20 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #E8A520 0%, #FFD700 100%)",
          boxShadow: "0 4px 16px #E8A52060",
        }}
      >
        <ShoppingBasket className="w-8 h-8 text-white" />
      </motion.button>

      {/* Upgrade Shop */}
      <UpgradeShop
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        score={score}
        upgrades={upgrades}
        onPurchase={handlePurchaseUpgrade}
      />
    </div>
  );
}

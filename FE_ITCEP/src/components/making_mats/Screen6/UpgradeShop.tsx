import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBasket } from "lucide-react";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  level: number;
  maxLevel: number;
}

interface UpgradeShopProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  upgrades: Upgrade[];
  onPurchase: (id: string) => void;
}

export function UpgradeShop({
  isOpen,
  onClose,
  score,
  upgrades,
  onPurchase,
}: UpgradeShopProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Shop Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[800px] max-h-[600px] rounded-2xl p-8 shadow-2xl overflow-auto"
            style={{
              background: "linear-gradient(135deg, #F0E0C0 0%, #E8D5A8 100%)",
              border: "4px solid #C9A66B",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#E8A520",
                    boxShadow: "0 4px 12px #E8A52060",
                  }}
                >
                  <ShoppingBasket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl" style={{ color: "#8B4513" }}>
                    Nâng cấp công cụ
                  </h2>
                  <p className="text-sm opacity-80" style={{ color: "#C9A66B" }}>
                    Điểm của bạn:{" "}
                    <span style={{ color: "#E8A520" }}>
                      {score}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                style={{ backgroundColor: "#C9A66B" }}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Upgrades Grid */}
            <div className="grid grid-cols-2 gap-4">
              {upgrades.map(upgrade => {
                const canAfford = score >= upgrade.cost;
                const isMaxLevel = upgrade.level >= upgrade.maxLevel;

                return (
                  <motion.div
                    key={upgrade.id}
                    whileHover={canAfford && !isMaxLevel ? { scale: 1.05, y: -4 } : {}}
                    className="rounded-xl p-4 relative overflow-hidden"
                    style={{
                      background: isMaxLevel
                        ? "linear-gradient(135deg, #A8C9A0 0%, #90B090 100%)"
                        : "linear-gradient(135deg, #FFFFFF 0%, #F5F5DC 100%)",
                      border: `3px solid ${canAfford && !isMaxLevel ? "#E8A520" : "#C9A66B"}`,
                      opacity: canAfford && !isMaxLevel ? 1 : 0.7,
                      boxShadow: canAfford && !isMaxLevel
                        ? "0 4px 16px #E8A52040"
                        : "0 2px 8px #00000020",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-3 text-3xl"
                      style={{
                        backgroundColor: isMaxLevel ? "#FFFFFF" : "#E8A520",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      {upgrade.icon}
                    </div>

                    {/* Content */}
                    <h3 className="mb-1" style={{ color: "#8B4513" }}>
                      {upgrade.name}
                    </h3>
                    <p className="text-sm mb-3 opacity-80" style={{ color: "#C9A66B" }}>
                      {upgrade.description}
                    </p>

                    {/* Level indicator */}
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: upgrade.maxLevel }).map((_, i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full"
                          style={{
                            backgroundColor:
                              i < upgrade.level ? "#E8A520" : "#C9A66B40",
                          }}
                        />
                      ))}
                    </div>

                    {/* Purchase button */}
                    {!isMaxLevel ? (
                      <button
                        onClick={() => canAfford && onPurchase(upgrade.id)}
                        disabled={!canAfford}
                        className="w-full py-2 px-4 rounded-lg transition-all"
                        style={{
                          backgroundColor: canAfford ? "#E8A520" : "#C9A66B60",
                          color: "#FFFFFF",
                          cursor: canAfford ? "pointer" : "not-allowed",
                        }}
                      >
                        {canAfford
                          ? `Mua (${upgrade.cost} điểm)`
                          : `Cần ${upgrade.cost} điểm`}
                      </button>
                    ) : (
                      <div
                        className="w-full py-2 px-4 rounded-lg text-center"
                        style={{ backgroundColor: "#FFFFFF", color: "#A8C9A0" }}
                      >
                        Đã đạt tối đa!
                      </div>
                    )}

                    {/* Shine effect for affordable items */}
                    {canAfford && !isMaxLevel && (
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        className="absolute top-0 left-0 w-1/3 h-full opacity-30"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, #FFFFFF, transparent)",
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

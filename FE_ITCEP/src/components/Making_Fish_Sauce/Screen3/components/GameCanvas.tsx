import { motion } from 'framer-motion';
import { ImageWithFallback } from '../../../figma/ImageWithFallback';

interface GameCanvasProps {
  mixingEvenness: number;
  currentStep: 'adding' | 'mixing' | 'transferring' | 'pressing' | 'sealing';
  heatmapData: number[];
}

export function GameCanvas({ mixingEvenness, currentStep, heatmapData }: GameCanvasProps) {
  const isMixing = currentStep === 'mixing';
  return (
    <div className="relative w-full flex-1 max-h-[40vh] px-4 sm:px-6 md:px-4 py-2 sm:py-3 flex items-center justify-center overflow-hidden">
      {/* Photorealistic Bamboo Basket (mẹt tre) with Anchovies */}
      <motion.div
        className="absolute w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 z-20"
        animate={isMixing ? { rotate: [0, 15, -15, 0] } : {}}
        transition={isMixing ? { duration: 0.6, repeat: Infinity } : {}}
      >
        <div
          className="w-full h-full rounded-full shadow-2xl relative"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #d4b896, #b89868, #9d7d4a)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 -10px 30px rgba(0,0,0,0.2)'
          }}
        >
          {/* Bamboo weave texture overlay */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1646170629004-b3c84a27fc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxiYW1ib28lMjBiYXNrZXQlMjB3ZWF2ZSUyMHRleHR1cmUlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NzcyMjIzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Bamboo weave texture"
              className="w-full h-full object-cover opacity-60 rounded-full"
            />
          </div>

          {/* Inner shadow for depth */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3), inset 0 10px 20px rgba(0,0,0,0.2)'
            }}
          />

          {/* Photorealistic Anchovies */}
          <div className="absolute inset-3 sm:inset-6 md:inset-10 rounded-full overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1762710526517-8393c1222a78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhbmNob3ZpZXMlMjBmcmVzaCUyMGZpc2glMjBzaWx2ZXIlMjBzY2FsZXN8ZW58MXx8fHwxNzc3MjIyMzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Fresh anchovies"
              className="w-full h-full object-cover scale-150 brightness-95"
            />
            {/* Wetness overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Mixing Heatmap Overlay - shows salt distribution */}
          {currentStep === 'mixing' && (
            <div className="absolute inset-0 grid grid-cols-3 gap-0 opacity-40 rounded-full overflow-hidden">
              {heatmapData.map((intensity, i) => (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{
                    backgroundColor: `rgba(160, 69, 46, ${intensity * 0.8})`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Realistic Sea Salt Crystals Pile */}
      <motion.div
        className="absolute bottom-1/3 left-4 sm:left-8 md:left-12 w-24 h-20 sm:w-32 sm:h-28 md:w-40 md:h-32 z-10"
        animate={isMixing ? { y: [0, -5, 0] } : {}}
        transition={isMixing ? { duration: 0.5, repeat: Infinity } : {}}
      >
        <div
          className="w-full h-full relative"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
          }}
        >
          {/* Salt pile shape */}
          <div
            className="absolute bottom-0 w-full h-full rounded-t-3xl overflow-hidden"
            style={{
              clipPath: 'polygon(5% 100%, 95% 100%, 85% 25%, 50% 0%, 15% 25%)'
            }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1672090630681-e69da8006146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxzZWElMjBzYWx0JTIwY3J5c3RhbHMlMjBjbG9zZSUyMHVwJTIwdGV4dHVyZXxlbnwxfHx8fDE3NzcyMjIzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Sea salt crystals"
              className="w-full h-full object-cover brightness-110"
            />
          </div>
          {/* Sparkle highlights */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-white rounded-full"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${20 + Math.random() * 60}%`,
                  opacity: 0.7 + Math.random() * 0.3,
                  boxShadow: '0 0 4px rgba(255,255,255,0.8)'
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Photorealistic Fermentation Barrels (thùng chượp) */}
      <div className="absolute bottom-1/3 right-4 sm:right-8 md:right-12 flex gap-2 sm:gap-3 md:gap-4 z-10">
        {[1, 2].map((barrel) => (
          <div
            key={barrel}
            className="w-16 h-24 sm:w-20 sm:h-28 md:w-28 md:h-40 rounded-lg relative overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(to bottom, #5d4429, #3d2817, #2a1a0f)',
              boxShadow: '0 15px 40px rgba(0,0,0,0.6), inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            {/* Dark wood grain texture */}
            <div className="absolute inset-0 opacity-50">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1553796447-3efb03dc50bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b29kZW4lMjBiYXJyZWwlMjBhZ2VkJTIwZGFyayUyMHdvb2QlMjBncmFpbnxlbnwxfHx8fDE3NzcyMjIzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dark wood texture"
                className="w-full h-full object-cover brightness-75"
              />
            </div>
            {/* Metal barrel bands */}
            <div className="absolute top-3 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#4a4a4a] via-[#6a6a6a] to-[#4a4a4a] shadow-md" />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#4a4a4a] via-[#6a6a6a] to-[#4a4a4a] shadow-md" />
            <div className="absolute bottom-3 left-0 right-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#4a4a4a] via-[#6a6a6a] to-[#4a4a4a] shadow-md" />
            {/* Highlights on bands */}
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

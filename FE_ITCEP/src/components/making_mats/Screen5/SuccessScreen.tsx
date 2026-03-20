import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Trophy, Heart } from "lucide-react";

export default function SuccessScreen() {
  const navigate = useNavigate();

  // Confetti animation
  const Confetti = () => {
    const confetti = Array.from({ length: 40 }, (_, i) => i);
    
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confetti.map(i => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ["#E8A520", "#C9A66B", "#A8C9A0", "#E8D5A8"][i % 4],
              left: `${Math.random() * 100}%`,
              top: "-10px",
            }}
            animate={{
              y: window.innerHeight + 20,
              x: (Math.random() - 0.5) * 100,
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              delay: (i % 10) * 0.05,
              ease: "easeIn",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative flex items-center justify-center" style={{ backgroundColor: "#F0E0C0" }}>
      <Confetti />

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1626753904920-36db9c9e6ba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBob3VyJTIwcmljZSUyMGZpZWxkcyUyMHN1bnNldCUyMHdhcm18ZW58MXx8fHwxNzczOTkwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vietnamese countryside"
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0E0C0]/80 via-[#E8D5A8]/60 to-[#F0E0C0]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl px-8">
        {/* Completed mat */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="mb-12"
        >
          <div className="relative w-96 h-64 mx-auto">
            <div 
              className="w-full h-full rounded-lg shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "#E8D5A8",
                border: "4px solid #C9A66B",
              }}
            >
              {/* Perfect weaving pattern */}
              <div className="w-full h-full p-6 relative">
                {/* Symmetric geometric patterns */}
                <div className="grid grid-cols-4 gap-2 w-full h-full">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="rounded-sm"
                      style={{
                        backgroundColor: [
                          "#E8A520",
                          "#C9A66B",
                          "#A8C9A0",
                          "#E8D5A8",
                        ][i % 4],
                      }}
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: (i % 8) * 0.1,
                      }}
                    />
                  ))}
                </div>

                {/* Diagonal stripes pattern overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">
                      <path
                        d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
                        stroke="#C9A66B"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#diagonalHatch)" />
                </svg>
              </div>
            </div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                boxShadow: "0 0 30px rgba(232, 165, 32, 0.6)",
              }}
              animate={{
                boxShadow: [
                  "0 0 30px rgba(232, 165, 32, 0.6)",
                  "0 0 50px rgba(232, 165, 32, 0.8)",
                  "0 0 30px rgba(232, 165, 32, 0.6)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Success message */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h1
            className="text-6xl mb-6 font-bold"
            style={{
              color: "#E8A520",
              textShadow: "0 4px 12px rgba(232, 165, 32, 0.4)",
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 3,
              delay: 0.6,
            }}
          >
            Hoàn thành xuất sắc!
          </motion.h1>

          <p className="text-2xl mb-4" style={{ color: "#8B6F47" }}>
            Chiếu của em đẹp lung linh vô cùng!
          </p>

          <p className="text-xl mb-12" style={{ color: "#C9A66B" }}>
            Em là một người thợ dệt tài ba. Hoa văn hoàn hảo, chất lượng xuất sắc!
          </p>

          {/* Character celebrating */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
            className="mb-10"
          >
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-6 shadow-xl" style={{ borderColor: "#E8D5A8" }}>
              <img
                src="https://images.unsplash.com/photo-1681372750321-83d344c77167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtZXNlJTIweW91bmclMjB3b21hbiUyMHRyYWRpdGlvbmFsJTIwYW8lMjBiYSUyMGJhJTIwY29uaWNhbCUyMGhhdHxlbnwxfHx8fDE3NzM5OTAxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vietnamese girl celebrating"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="text-3xl mt-4 flex items-center justify-center gap-2"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            >
              <Heart className="w-8 h-8" style={{ color: "#E8A520", fill: "#E8A520" }} />
              <span>🎉</span>
            </motion.div>
          </motion.div>

          {/* Trophy with points */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8 flex items-center justify-center gap-3"
          >
            <Trophy className="w-8 h-8" style={{ color: "#E8A520" }} />
            <span className="text-2xl" style={{ color: "#C9A66B" }}>Level 5 Hoàn thành!</span>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex gap-6 justify-center"
          >
            <button
              onClick={() => navigate("/level5")}
              className="px-12 py-4 rounded-full text-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-3"
              style={{
                backgroundColor: "#E8A520",
                color: "white",
              }}
            >
              <Trophy className="w-6 h-6" />
              Tiếp tục
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-12 py-4 rounded-full text-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: "#C9A66B",
                color: "white",
              }}
            >
              Về menu
            </button>
          </motion.div>
        </motion.div>

        {/* Achievement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 p-6 rounded-lg"
          style={{ backgroundColor: "rgba(232, 213, 168, 0.5)" }}
        >
          <h3 className="text-xl mb-3" style={{ color: "#8B6F47" }}>🏆 Thành tích đạt được:</h3>
          <ul className="text-left max-w-md mx-auto space-y-2" style={{ color: "#A67C52" }}>
            <li>✨ Chiếu cói hoàn hảo - Hoa văn đối xứng</li>
            <li>🎯 Nhịp điệu chính xác - Đạt điểm cao</li>
            <li>👩‍🌾 Học thêm kỹ năng dệt chiếu truyền thống</li>
            <li>💪 Sẵn sàng cho các thử thách tiếp theo!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

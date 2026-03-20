import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { RotateCcw, Heart } from "lucide-react";

export default function FailScreen() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ backgroundColor: "#F0E0C0" }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1626753904920-36db9c9e6ba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBob3VyJTIwcmljZSUyMGZpZWxkcyUyMHN1bnNldCUyMHdhcm18ZW58MXx8fHwxNzczOTkwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vietnamese countryside"
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0E0C0]/80 via-[#E8D5A8]/60 to-[#F0E0C0]/80" />
      </div>

      {/* Content - Properly structured */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-y-auto">
        {/* Incomplete mat */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex-shrink-0 py-8"
        >
          <div className="relative w-96 h-64 mx-auto">
            <div 
              className="w-full h-full rounded-lg shadow-2xl overflow-hidden"
              style={{
                backgroundColor: "#E8D5A8",
                border: "4px dashed #C9A66B",
              }}
            >
              {/* Messy pattern */}
              <div className="w-full h-full p-6 relative">
                {/* Random scattered elements */}
                <motion.div
                  className="absolute w-24 h-2 rounded-full"
                  style={{ backgroundColor: "#E8A520", top: "20%", left: "10%", transform: "rotate(-15deg)" }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-16 h-2 rounded-full"
                  style={{ backgroundColor: "#C9A66B", top: "40%", right: "20%", transform: "rotate(25deg)" }}
                  animate={{ x: [0, -5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-20 h-2 rounded-full"
                  style={{ backgroundColor: "#A8C9A0", bottom: "30%", left: "30%", transform: "rotate(-30deg)" }}
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-12 h-12 rounded"
                  style={{ backgroundColor: "#E8D5A8", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(10deg)" }}
                  animate={{ rotate: [10, 15, 10] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                    <div className="rounded-sm" style={{ backgroundColor: "#C9A66B" }} />
                    <div className="rounded-sm opacity-50" style={{ backgroundColor: "#E8A520" }} />
                    <div className="rounded-sm opacity-30" style={{ backgroundColor: "#A8C9A0" }} />
                    <div className="rounded-sm opacity-60" style={{ backgroundColor: "#C9A66B" }} />
                  </div>
                </motion.div>

                {/* Tangled threads */}
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 100 100">
                  <path
                    d="M 10 20 Q 30 10, 50 30 T 90 40"
                    fill="none"
                    stroke="#C9A66B"
                    strokeWidth="1"
                  />
                  <path
                    d="M 20 60 Q 40 70, 60 50 T 80 80"
                    fill="none"
                    stroke="#E8A520"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* Loose threads */}
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex gap-2">
                <div className="w-1 h-12 rounded-full" style={{ backgroundColor: "#E8A520" }} />
                <div className="w-1 h-16 rounded-full" style={{ backgroundColor: "#C9A66B" }} />
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#A8C9A0" }} />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Fail message section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex-shrink-0 text-center max-w-2xl px-6 py-8 space-y-6"
        >
          <h1 
            className="text-6xl font-bold"
            style={{ color: "#A67C52" }}
          >
            Thử lại nhé!
          </h1>

          <p className="text-2xl" style={{ color: "#8B6F47" }}>
            Chiếu chưa hoàn thiện được, nhưng đừng nản lòng!
          </p>

          <p className="text-xl" style={{ color: "#C9A66B" }}>
            Mỗi người thợ dệt đều phải luyện tập nhiều lần. Hãy thử lại!
          </p>

          {/* Character */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
          >
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-6 shadow-xl" style={{ borderColor: "#E8D5A8" }}>
              <img
                src="https://images.unsplash.com/photo-1681372750321-83d344c77167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhWaWV0bmFtZXNlJTIweW91bmclMjB3b21hbiUyMHRyYWRpdGlvbmFsJTIwYW8lMjBiYSUyMGJhJTIwY29uaWNhbCUyMGhhdHxlbnwxfHx8fDE3NzM5OTAxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vietnamese girl"
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              className="text-3xl mt-4 flex items-center justify-center gap-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-8 h-8" style={{ color: "#E8A520", fill: "#E8A520" }} />
              <span>💪</span>
            </motion.div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-6 justify-center pt-4"
          >
            <button
              onClick={() => navigate("/level5")}
              className="px-12 py-4 rounded-full text-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl flex items-center gap-3"
              style={{
                backgroundColor: "#E8A520",
                color: "white",
              }}
            >
              <RotateCcw className="w-6 h-6" />
              Thử lại
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

        {/* Tips section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex-shrink-0 max-w-md px-6 py-8 rounded-lg mb-6"
          style={{ backgroundColor: "rgba(232, 213, 168, 0.5)" }}
        >
          <h3 className="text-xl mb-3 text-center" style={{ color: "#8B6F47" }}>💡 Mẹo chơi:</h3>
          <ul className="text-left space-y-2" style={{ color: "#A67C52" }}>
            <li>• Tập trung nhìn vào ô sáng thay vì note đang rơi</li>
            <li>• Nghe nhịp nhạc và nhấn theo điệu</li>
            <li>• Luyện tập từ từ, đừng vội vàng</li>
            <li>• Mỗi lần sai là một bài học quý giá!</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

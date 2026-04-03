import { Compass } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function LeftPanel() {
  return (
    <div className="w-[60%] relative overflow-hidden flex items-center justify-center p-16">
      <div className="relative w-full h-full">
        {/* Header Text */}
        <div className="absolute top-4 left-8 z-50 bg-white/50 backdrop-blur-md rounded-2xl p-4 shadow-lg border-2 border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <Compass className="w-8 h-8 text-amber-600 drop-shadow-md" />
            <h1 className="text-4xl font-bold text-amber-900 drop-shadow-md">CraftSteps</h1>
          </div>
          <h2 className="text-2xl text-green-800 mb-1 drop-shadow-md">
            Khám phá làng nghề Việt Nam
          </h2>
          <p className="text-lg text-amber-700 drop-shadow-md">
            Mỗi bước là một trải nghiệm văn hóa
          </p>
        </div>

        {/* Collage of Crafts */}
        <div className="relative w-full h-full pt-48">
          {/* Journey Path SVG */}
          <svg className="absolute inset-0 w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 150 100 Q 300 200 450 150 T 750 300 Q 850 400 650 500"
              stroke="#f59e0b"
              strokeWidth="4"
              fill="none"
              strokeDasharray="15 10"
              className="drop-shadow-md"
            />
            {/* Journey Points */}
            <circle cx="150" cy="100" r="8" fill="#f59e0b" />
            <circle cx="450" cy="150" r="8" fill="#f59e0b" />
            <circle cx="750" cy="300" r="8" fill="#f59e0b" />
            <circle cx="650" cy="500" r="8" fill="#f59e0b" />
          </svg>

          {/* Craft Image 1 - Pottery */}
          <div className="absolute top-12 left-12 w-72 h-72 rounded-3xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-20 border-4 border-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1768478563698-6b0b87724edd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxWaWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBjcmFmdHMlMjBwb3R0ZXJ5JTIwd2VhdmluZyUyMGJhbWJvb3xlbnwxfHx8fDE3NzUxNDAxODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Làm gốm truyền thống"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">Làm Gốm</p>
            </div>
          </div>

          {/* Craft Image 2 - Basket Weaving */}
          <div className="absolute top-32 right-24 w-64 h-64 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20 border-4 border-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1677146340134-9725223bf913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBjcmFmdHMlMjBwb3R0ZXJ5JTIwd2VhdmluZyUyMGJhbWJvb3xlbnwxfHx8fDE3NzUxNDAxODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Đan lát tre"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">Đan Lát</p>
            </div>
          </div>

          {/* Craft Image 3 - Bamboo Crafts */}
          <div className="absolute bottom-24 left-32 w-80 h-56 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 z-20 border-4 border-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1677146339793-ad2f6e8bf64f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxWaWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBjcmFmdHMlMjBwb3R0ZXJ5JTIwd2VhdmluZyUyMGJhbWJvb3xlbnwxfHx8fDE3NzUxNDAxODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Nghề tre"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">Nghề Tre</p>
            </div>
          </div>

          {/* Craft Image 4 - Traditional Crafts */}
          <div className="absolute bottom-8 right-32 w-72 h-72 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 z-20 border-4 border-white">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1768478563756-1c5c52008a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw5fHxWaWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBjcmFmdHMlMjBwb3R0ZXJ5JTIwd2VhdmluZyUyMGJhbWJvb3xlbnwxfHx8fDE3NzUxNDAxODF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Nghề thủ công truyền thống"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white font-semibold">Dệt May</p>
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-8 left-8 text-amber-700 text-sm flex items-center gap-2">
          <Compass className="w-4 h-4" />
          Bắt đầu từ những làng nghề đầu tiên
        </div>
      </div>
    </div>
  );
}

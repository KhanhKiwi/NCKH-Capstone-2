import { AlertCircle, X } from 'lucide-react';

interface ExitConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  currentStage: number;
  quality: number;
}

export function ExitConfirmDialog({ onConfirm, onCancel, currentStage, quality }: ExitConfirmDialogProps) {
  const stageNames = ['Chọn Lọc Cá', 'Kéo Nước Biển', 'Chải Cá Sạch'];
  const stageName = stageNames[currentStage] || 'Không xác định';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-6 text-center">
          <AlertCircle className="w-12 h-12 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white">Thoát Game?</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold mb-3">⚠️ Nếu bạn thoát:</p>
            <ul className="text-sm text-red-700 space-y-2">
              <li>• 🎮 Mất hết tiến độ hiện tại (<strong>{stageName}</strong>)</li>
              <li>• 📊 Chất lượng mắm: <strong>{Math.round(quality)}%</strong> sẽ bị xóa</li>
              <li>• ⏱️ Không lưu giữ dữ liệu nào</li>
              <li>• 🔄 Phải bắt đầu lại từ đầu</li>
            </ul>
          </div>

          <p className="text-gray-700 text-center mb-8">
            Bạn có chắc chắn muốn thoát không?
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Tiếp Tục Chơi 🎮
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Thoát ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

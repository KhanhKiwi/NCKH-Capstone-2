# Screen4 - Đóng lu & Ủ chượp

## 📚 Mô tả
Công đoạn 4 của quy trình làm nước mắm truyền thống - Đóng lu và ủ chượp với giao diện tương tác hiện đại.

## 📁 Cấu trúc thư mục
```
Screen4/
├── components/
│   ├── ActionNotification.tsx       # Thông báo hành động
│   ├── AmbientParticles.tsx         # Hiệu ứng hạt nền
│   ├── ChoupGenome.tsx              # Hiển thị chất lượng chượp
│   ├── ControlPanel.tsx             # Bảng điều khiển công đoạn
│   ├── FermentationMetrics.tsx       # Thông số lên men
│   ├── JarDisplay.tsx               # Hiển thị lu sành
│   ├── ProcessTimeline.tsx          # Tiến trình sản xuất
│   └── index.ts                     # Export components
├── styles/
│   ├── fonts.css                    # Import font Google
│   ├── theme.css                    # CSS theme variables
│   └── index.css                    # Main styles
├── Screen4.tsx                      # Main component
└── index.ts                         # Export component
```

## 🚀 Cách sử dụng

### Import component
```tsx
import Screen4 from '@/components/Making_Fish_Sauce/Screen4';

// Hoặc import từ file chính
import Screen4 from '@/components/Making_Fish_Sauce/Screen4/Screen4';
```

### Sử dụng trong ứng dụng
```tsx
function App() {
  return (
    <Screen4 />
  );
}
```

## 🎨 Các Component chính

### ChoupGenome
Hiển thị chất lượng của chượp dưới dạng biểu đồ genome tròn.
```tsx
<ChoupGenome quality={75} />
```

### JarDisplay
Hiển thị lu sành với mức độ đầy và trạng thái niêm phong.
```tsx
<JarDisplay fillLevel={85} isSealed={false} />
```

### ControlPanel
Bảng điều khiển các bước xử lý chượp.
```tsx
<ControlPanel onAction={(action) => console.log(action)} />
```

### FermentationMetrics
Hiển thị thông số lên men (nhiệt độ, độ ẩm, v.v).
```tsx
<FermentationMetrics 
  temperature={30}
  humidity={78}
  stage="Giai đoạn khởi đầu"
  month={1}
/>
```

## 🎯 Tính năng
- ✅ Hiển thị trực quan quá trình ủ chượp
- ✅ Quản lý trạng thái chất lượng
- ✅ Bảng điều khiển các hành động
- ✅ Hiệu ứng động mượt mà
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Dark mode support
- ✅ Thông báo hành động tự động

## 🎭 Palette màu
- **Aged Teak**: #3d2b1f (Chủ đạo)
- **Mahogany**: #5c3d2e
- **Terracotta**: #a0522d
- **Ceramic Glaze**: #8b7355
- **Slate Blue**: #5f7c8a
- **Copper Accent**: #b87333

## 📦 Dependencies
- React 18.3.1
- lucide-react (Icons)
- Tailwind CSS 4.1.12

## ⚙️ Cấu hình
Component sử dụng Tailwind CSS với theme tùy chỉnh. Các theme variables được định nghĩa trong `styles/theme.css`.

## 🔧 Tinh chỉnh
Để tùy chỉnh:
1. Sửa màu sắc trong `styles/theme.css`
2. Sửa animation trong các component
3. Thay đổi thông báo trong `actionMessages` object

## 📝 Ghi chú
- Component sử dụng `ImageWithFallback` từ `@/components/figma/ImageWithFallback`
- Hình ảnh nền từ Unsplash (miễn phí)
- Tất cả text đều hỗ trợ tiếng Việt

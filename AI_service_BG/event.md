
## Danh sách event chuẩn

### Event chung
- `new_player`: chào người chơi lần đầu vào một màn.
- `ask_info`: người chơi bấm nút Trợ giúp.
- `idle`: người chơi đứng yên quá lâu.
- `spam_click`: người chơi bấm liên tục quá nhanh.
- `wrong_action`: thao tác sai ở bước hiện tại.
- `fail_many`: sai nhiều lần liên tiếp.
- `excellent`: làm rất tốt ở một bước.
- `win_fast`: hoàn thành nhanh hơn ngưỡng khuyến nghị.

## Event theo từng màn

### `Screen1` — Thu hoạch cói
| Event | Khi nào bắn | Step gợi ý |
|---|---|---|
| `new_player` | Vào màn lần đầu | `1` |
| `ask_info` | Bấm nút Trợ giúp | theo phase hiện tại |
| `idle` | Đứng yên lâu ở intro/chọn/cắt/gom | `phase + 1` |
| `spam_click` | Click quá nhanh lên cây / UI | `phase + 1` |
| `wrong_action` | Chọn sai cây hoặc cắt sai cây / kéo sai bó | `2` hoặc `3` |
| `fail_many` | Sai nhiều lần ở bước chọn/cắt/gom | `2` hoặc `3` |
| `excellent` | Hoàn thành chọn/cắt/gom rất gọn | `1`, `2`, `3` |
| `win_fast` | Hoàn thành toàn màn nhanh | `4` |

### `Screen3` — Dây chuyền / pha chế theo phase
| Event | Khi nào bắn | Step gợi ý |
|---|---|---|
| `new_player` | Vào màn lần đầu | `1` |
| `ask_info` | Bấm Trợ giúp | theo phase |
| `idle` | Không thao tác trong phase hiện tại | `1-4` |
| `spam_click` | Click liên tục vào board / nút / thao tác | `1-4` |
| `wrong_action` | Làm sai nguyên liệu / sai thứ tự / sai thao tác | theo phase |
| `fail_many` | Sai nhiều lần trong một phase | theo phase |
| `excellent` | Chọn đúng nhanh, ít sai | theo phase |
| `win_fast` | Hoàn thành phase hoặc cả màn nhanh | `4` |

### `Screen4` — Màn thực hành tiếp theo
| Event | Khi nào bắn | Step gợi ý |
|---|---|---|
| `new_player` | Vào màn lần đầu | `1` |
| `ask_info` | Bấm Trợ giúp | theo scene |
| `idle` | Không thao tác quá lâu | `1` |
| `spam_click` | Bấm liên tục vào vùng tương tác | `1` |
| `wrong_action` | Tương tác sai mục tiêu | `1` |
| `fail_many` | Sai lặp lại nhiều lần | `1` |
| `excellent` | Làm đúng nhịp hoặc nhanh | `1` |
| `win_fast` | Kết thúc màn nhanh | `1` |

### `Screen5` — Màn kết quả / thành công-thất bại
| Event | Khi nào bắn | Step gợi ý |
|---|---|---|
| `new_player` | Vào màn lần đầu | `1` |
| `ask_info` | Bấm Trợ giúp | `1-3` tùy route |
| `idle` | Ở gameplay / success / fail quá lâu | `1-3` |
| `spam_click` | Bấm liên tục ở gameplay / modal | `1-3` |
| `wrong_action` | Chọn sai thao tác khi chơi | `1` |
| `fail_many` | Thua nhiều lần hoặc sai liên tục | `3` |
| `excellent` | Vượt qua thử thách xuất sắc | `2` |
| `win_fast` | Qua màn rất nhanh | `2` |

### `Screen6` — Màn cuối / challenge
| Event | Khi nào bắn | Step gợi ý |
|---|---|---|
| `new_player` | Vào màn lần đầu | `1` |
| `ask_info` | Bấm Trợ giúp | `1-3` tùy route |
| `idle` | Không thao tác lâu trong gameplay / success / fail | `1-3` |
| `spam_click` | Click spam trong game | `1-3` |
| `wrong_action` | Xử lý sai trong challenge | `1` |
| `fail_many` | Sai nhiều lần trong màn | `3` |
| `excellent` | Làm gần như không sai | `2` |
| `win_fast` | Hoàn thành challenge nhanh | `2` |

## Ghi chú triển khai
- Ưu tiên đặt event ở đúng nơi phát sinh hành động, không đặt quá nhiều ở wrapper.
- `new_player` dùng localStorage key riêng theo route, ví dụ `ai:new_player:level-1`, `ai:new_player:level-3`.
- `idle` và `spam_click` nên đặt ở layout hoặc hook dùng chung để giảm trùng lặp.
- Với các màn có phase nội bộ, `step` nên phản ánh phase hiện tại để AI trả lời đúng ngữ cảnh.
- Nếu cùng một event có nhiều điểm bắn, phải dựa vào cooldown theo route để tránh gọi AI quá nhiều.

## Tiêu chí hoàn thành
- Mỗi màn có đủ bộ event tối thiểu: `new_player`, `ask_info`, `idle`, `spam_click`.
- Các event nghiệp vụ `wrong_action`, `fail_many`, `excellent`, `win_fast` được gắn ở đúng chỗ.
- Không có màn nào bắn AI liên tục khi người dùng spam click.
- Reload trang không làm `new_player` bắn lại nếu đã học trước đó.

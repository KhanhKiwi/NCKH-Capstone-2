import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Star,
  StarHalf,
  Clock,
  Award,
  ArrowRight,
  Home,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAI } from '../../../contexts/AIContext';

const clampHalfStar = (n: number) =>
  Math.max(0, Math.min(3, Math.round(n * 2) / 2));

function StarScoreRow({ score }: { score: number }) {
  const s = clampHalfStar(score);
  const full = Math.floor(s);
  const half = s - full >= 0.5;
  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2].map((i) => {
        if (i < full) {
          return (
            <Star
              key={i}
              className="w-10 h-10 text-[#f59e0b] fill-[#f59e0b]"
            />
          );
        }
        if (i === full && half) {
          return (
            <StarHalf
              key={i}
              className="w-10 h-10 text-[#f59e0b] fill-[#f59e0b]"
            />
          );
        }
        return <Star key={i} className="w-10 h-10 text-gray-300" />;
      })}
    </div>
  );
}

function computeMiniGame1Stars(timerSec: number, hintsUsed: number) {
  let base = 1;
  if (timerSec < 30) base = 2;
  if (timerSec < 15) base = 3;
  return clampHalfStar(base - hintsUsed * 0.5);
}

function computeMiniGame2Stars(
  wrongTries: number,
  hintsUsed: number,
  playSeconds: number,
) {
  let s = 3;
  s -= wrongTries * 0.5;
  s -= hintsUsed * 0.5;
  if (playSeconds > 90) s -= 0.5;
  if (playSeconds > 180) s -= 0.5;
  return clampHalfStar(s);
}

interface DragItem {
  id: string;
  type: string;
}

// Puzzle piece shapes
type PieceShape = number[][];

interface PuzzlePiece {
  id: string;
  name: string;
  shape: PieceShape;
  rotation: number;
  placed: boolean;
  position?: { row: number; col: number };
  color: string;
}

// Board cell types
type CellType = 'normal' | 'blocked' | 'target';

interface BoardCell {
  type: CellType;
  occupiedBy?: string;
}

// Define puzzle pieces
const PUZZLE_PIECES: Omit<PuzzlePiece, 'rotation' | 'placed'>[] = [
  {
    id: 'piece-1',
    name: 'Khung chính',
    shape: [
      [1, 1],
      [1, 0],
    ],
    color: '#f59e0b',
  },
  {
    id: 'piece-2',
    name: 'Thanh ngang',
    shape: [
      [1, 1],
    ],
    color: '#d97706',
  },
  {
    id: 'piece-3',
    name: 'Bàn đạp',
    shape: [
      [1, 1],
      [0, 1],
    ],
    color: '#4a7c2f',
  },
  {
    id: 'piece-4',
    name: 'Con thoi',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#8b5cf6',
  },
  {
    id: 'piece-5',
    name: 'Thanh giữ sợi',
    shape: [
      [1, 0],
      [1, 1],

    ],
    color: '#059669',
  },
];

// Create initial board with blocked and target areas
const createInitialBoard = (): BoardCell[][] => {
  const board: BoardCell[][] = Array(5)
    .fill(null)
    .map(() =>
      Array(5)
        .fill(null)
        .map(() => ({ type: 'normal' as CellType }))
    );

  // Set blocked cells (⬛) - new layout
  board[0][2] = { type: 'blocked' };
  board[1][1] = { type: 'blocked' };
  board[1][2] = { type: 'blocked' };
  board[3][3] = { type: 'blocked' };

  // Set target areas (areas where pieces should be placed)
  // All non-blocked cells are targets
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j].type !== 'blocked') {
        board[i][j].type = 'target';
      }
    }
  }

  return board;
};

// Rotate shape 90 degrees clockwise
const rotateShape = (shape: PieceShape): PieceShape => {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: PieceShape = Array(cols)
    .fill(null)
    .map(() => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }

  return rotated;
};

// Get rotated shape based on rotation count
const getRotatedShape = (shape: PieceShape, rotation: number): PieceShape => {
  let result = shape;
  for (let i = 0; i < rotation % 4; i++) {
    result = rotateShape(result);
  }
  return result;
};

function DraggablePuzzlePiece({
  piece,
  onRotate,
}: {
  piece: PuzzlePiece;
  onRotate: (id: string) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'puzzle-piece',
    item: { id: piece.id },
    canDrag: !piece.placed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  if (piece.placed) return null;

  const rotatedShape = getRotatedShape(piece.shape, piece.rotation);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={(node) => {
          drag(node);
        }}
        className={`
          bg-white p-3 rounded-xl shadow-lg cursor-move
          transform transition-all duration-200
          ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'}
        `}
      >
        <div className="mb-2">
          <p className="text-sm font-semibold text-[#4a3f2e] text-center">{piece.name}</p>
        </div>
        <div className="inline-grid gap-1">
          {rotatedShape.map((row, i) => (
            <div key={i} className="flex gap-1">
              {row.map((cell, j) => (
                <div
                  key={j}
                  className={`w-8 h-8 rounded ${cell ? '' : 'opacity-0'}`}
                  style={{ backgroundColor: cell ? piece.color : 'transparent' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => onRotate(piece.id)}
        className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-2 rounded-lg transition-colors"
      >
        <RotateCw className="w-5 h-5" />
      </button>
    </div>
  );
}

function MiniGame1({ onComplete }: { onComplete: (stars: number) => void }) {
  const { triggerEvent } = useAI();
  const [board, setBoard] = useState<BoardCell[][]>(createInitialBoard());
  const [pieces, setPieces] = useState<PuzzlePiece[]>(
    PUZZLE_PIECES.map((p) => ({ ...p, rotation: 0, placed: false }))
  );
  const [timer, setTimer] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showLoom, setShowLoom] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintPieceId, setHintPieceId] = useState<string | null>(null);
  const [placementHistory, setPlacementHistory] = useState<Array<{
    pieceId: string;
    board: BoardCell[][];
  }>>([]);
  const actionTimesRef = useRef<number[]>([]);
  const lastSpamEventRef = useRef(0);
  const lastActionRef = useRef(Date.now());
  const idleTriggeredRef = useRef(false);
  const completedEventRef = useRef(false);

  const MAX_HINTS = 3;

  const trackAction = useCallback(() => {
    const now = Date.now();
    lastActionRef.current = now;
    idleTriggeredRef.current = false;
    actionTimesRef.current = [...actionTimesRef.current.filter((t) => now - t <= 10000), now];
    if (actionTimesRef.current.length >= 10 && now - lastSpamEventRef.current > 15000) {
      lastSpamEventRef.current = now;
      triggerEvent({ event: 'spam_click', level: 4, step: 1 }).catch(() => {});
    }
  }, [triggerEvent]);

  // Predefined solution positions for hints
  const solutionPositions: { [key: string]: { row: number; col: number; rotation: number } } = {
    'piece-1': { row: 0, col: 0, rotation: 0 },
    'piece-2': { row: 2, col: 0, rotation: 0 },
    'piece-3': { row: 3, col: 0, rotation: 0 },
    'piece-4': { row: 0, col: 3, rotation: 0 },
    'piece-5': { row: 2, col: 3, rotation: 0 },
  };

  useEffect(() => {
    if (!completed) {
      const interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [completed]);

  useEffect(() => {
    if (completed) return;
    const interval = window.setInterval(() => {
      if (Date.now() - lastActionRef.current >= 30000 && !idleTriggeredRef.current) {
        idleTriggeredRef.current = true;
        triggerEvent({ event: 'idle', level: 4, step: 1 }).catch(() => {});
      }
    }, 2000);
    return () => window.clearInterval(interval);
  }, [completed, triggerEvent]);

  const handleRotate = (pieceId: string) => {
    trackAction();
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, rotation: p.rotation + 1 } : p
      )
    );
  };

  const canPlacePiece = (
    shape: PieceShape,
    row: number,
    col: number
  ): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) {
          const boardRow = row + r;
          const boardCol = col + c;

          // Check bounds
          if (
            boardRow < 0 ||
            boardRow >= 5 ||
            boardCol < 0 ||
            boardCol >= 5
          ) {
            return false;
          }

          // Check if blocked or occupied
          const cell = board[boardRow][boardCol];
          if (cell.type === 'blocked' || cell.occupiedBy) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placePiece = (pieceId: string, row: number, col: number) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return false;

    const rotatedShape = getRotatedShape(piece.shape, piece.rotation);

    if (!canPlacePiece(rotatedShape, row, col)) return false;

    // Save current board state to history
    setPlacementHistory((prev) => [...prev, {
      pieceId,
      board: board.map((r) => r.map((c) => ({ ...c }))),
    }]);

    // Update board
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    for (let r = 0; r < rotatedShape.length; r++) {
      for (let c = 0; c < rotatedShape[r].length; c++) {
        if (rotatedShape[r][c] === 1) {
          newBoard[row + r][col + c].occupiedBy = pieceId;
        }
      }
    }
    setBoard(newBoard);

    // Update pieces
    const nextPieces = pieces.map((p) =>
      p.id === pieceId ? { ...p, placed: true, position: { row, col } } : p,
    );
    setPieces(nextPieces);

    // Thắng khi đã đặt đủ 5 mảnh (tổng ô các mảnh < số ô target — không thể lấp hết bàn)
    if (nextPieces.every((p) => p.placed)) {
      setCompleted(true);
      setShowLoom(true);
      if (!completedEventRef.current) {
        completedEventRef.current = true;
        if (timer <= 15 && hintsUsed === 0) {
          triggerEvent({ event: 'excellent', level: 4, step: 1 }).catch(() => {});
        } else if (timer <= 20) {
          triggerEvent({ event: 'win_fast', level: 4, step: 1 }).catch(() => {});
        }
      }
    }
    return true;
  };

  const removePiece = (pieceId: string) => {
    // Clear board cells occupied by this piece
    const newBoard = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        occupiedBy: cell.occupiedBy === pieceId ? undefined : cell.occupiedBy,
      }))
    );
    setBoard(newBoard);

    // Update piece state
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, placed: false, position: undefined } : p
      )
    );
  };

  const handleHint = () => {
    trackAction();
    if (hintsUsed >= MAX_HINTS) return;

    // Find first unplaced piece
    const unplacedPiece = pieces.find((p) => !p.placed);
    if (!unplacedPiece) return;

    setHintPieceId(unplacedPiece.id);
    setShowHint(true);
    setHintsUsed((prev) => prev + 1);

    // Hide hint after 3 seconds
    setTimeout(() => {
      setShowHint(false);
      setHintPieceId(null);
    }, 3000);
  };

  const handleReset = () => {
    trackAction();
    setBoard(createInitialBoard());
    setPieces(PUZZLE_PIECES.map((p) => ({ ...p, rotation: 0, placed: false })));
    setTimer(0);
    setCompleted(false);
    setShowLoom(false);
    setPlacementHistory([]);
    setHintsUsed(0);
    setShowHint(false);
    setHintPieceId(null);
  };

  const handleUndo = () => {
    trackAction();
    if (placementHistory.length === 0) return;

    const lastPlacement = placementHistory[placementHistory.length - 1];
    
    // Restore board state
    setBoard(lastPlacement.board);

    // Update piece state
    setPieces((prev) =>
      prev.map((p) =>
        p.id === lastPlacement.pieceId
          ? { ...p, placed: false, position: undefined }
          : p
      )
    );

    // Remove from history
    setPlacementHistory((prev) => prev.slice(0, -1));
  };

  const handleDrop = (item: DragItem, row: number, col: number) => {
    trackAction();
    const success = placePiece(item.id, row, col);
    if (!success) {
      triggerEvent({ event: 'wrong_action', level: 4, step: 1 }).catch(() => {});
    }
  };

  const BoardCell = ({
    cell,
    row,
    col,
  }: {
    cell: BoardCell;
    row: number;
    col: number;
  }) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'puzzle-piece',
      drop: (item: DragItem) => handleDrop(item, row, col),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const getPieceColor = () => {
      if (cell.occupiedBy) {
        const piece = pieces.find((p) => p.id === cell.occupiedBy);
        return piece?.color || '#f59e0b';
      }
      return null;
    };

    const isHintCell = showHint && hintPieceId && (() => {
      const solution = solutionPositions[hintPieceId];
      if (!solution) return false;
      
      const piece = PUZZLE_PIECES.find((p) => p.id === hintPieceId);
      if (!piece) return false;

      const rotatedShape = getRotatedShape(piece.shape, solution.rotation);
      
      for (let r = 0; r < rotatedShape.length; r++) {
        for (let c = 0; c < rotatedShape[r].length; c++) {
          if (rotatedShape[r][c] === 1) {
            if (solution.row + r === row && solution.col + c === col) {
              return true;
            }
          }
        }
      }
      return false;
    })();

    const handleCellClick = () => {
      trackAction();
      if (cell.occupiedBy) {
        removePiece(cell.occupiedBy);
      }
    };

    return (
      <div
        ref={(node) => {
          drop(node);
        }}
        onClick={handleCellClick}
        className={`
          w-14 h-14 border-2 rounded transition-all duration-200
          ${cell.type === 'blocked' 
            ? 'bg-gray-800 border-gray-900' 
            : cell.type === 'target'
              ? cell.occupiedBy
                ? 'border-green-500 cursor-pointer hover:ring-2 hover:ring-red-400'
                : 'bg-yellow-100 border-yellow-400 border-dashed'
              : 'bg-gray-100 border-gray-300'
          }
          ${isOver && cell.type !== 'blocked' ? 'ring-4 ring-blue-400' : ''}
          ${isHintCell ? 'animate-pulse ring-4 ring-purple-500 bg-purple-200' : ''}
        `}
        style={{
          backgroundColor: isHintCell ? '#e9d5ff' : getPieceColor() || undefined,
        }}
      />
    );
  };

  const handleContinueToMiniGame2 = () => {
    onComplete(computeMiniGame1Stars(timer, hintsUsed));
  };

  const handleReplayMiniGame1 = () => {
    handleReset();
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border-4 border-[#4a7c2f]">
          <div className="flex items-center gap-3">
            <Clock className="w-7 h-7 text-[#4a7c2f]" />
            <span className="text-3xl font-bold text-[#4a3f2e]">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Hint Button */}
          <button
            onClick={handleHint}
            disabled={hintsUsed >= MAX_HINTS}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all
              ${hintsUsed >= MAX_HINTS
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#8b5cf6] text-white'
              }
            `}
          >
            <Star className="w-5 h-5" />
            Gợi ý ({MAX_HINTS - hintsUsed})
          </button>

          {/* Undo Button */}
          <button
            onClick={handleUndo}
            disabled={placementHistory.length === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all
              ${placementHistory.length === 0
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-white'
              }
            `}
          >
            <RotateCcw className="w-5 h-5" />
            Hoàn tác
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white"
          >
            <RotateCcw className="w-5 h-5" />
            Làm lại
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Pieces */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-[#8b6f47]">
          <h3 className="text-2xl font-bold text-[#4a3f2e] mb-6 text-center">
            Mảnh ghép
          </h3>
          <div className="space-y-6">
            {pieces.map((piece) => (
              <DraggablePuzzlePiece
                key={piece.id}
                piece={piece}
                onRotate={handleRotate}
              />
            ))}
          </div>
        </div>

        {/* Center - Board */}
        <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-4 border-[#8b6f47]">
          <h3 className="text-2xl font-bold text-[#4a3f2e] mb-6 text-center">
            Bảng lắp ráp
          </h3>
          <div className="flex justify-center">
            <div className="inline-grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <BoardCell key={`${i}-${j}`} cell={cell} row={i} col={j} />
                ))
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 border-dashed rounded"></div>
              <span className="text-sm text-gray-600">Vùng cần lắp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-800 border-2 border-gray-900 rounded"></div>
              <span className="text-sm text-gray-600">Bị chặn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hoàn thành MG1 — Tiếp tục / Chơi lại */}
      {showLoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center border-4 border-[#8b6f47]">
            <div className="mb-6">
              <Award className="w-20 h-20 mx-auto text-[#f59e0b]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4a3f2e] mb-2" style={{ fontFamily: 'serif' }}>
              Khung dệt đã sẵn sàng!
            </h2>
            <p className="text-gray-600 mb-4">
              Thời gian: {timer}s · Gợi ý đã dùng: {hintsUsed}/3
              {hintsUsed > 0 && (
                <span className="block text-sm text-amber-700 mt-1">
                  Mỗi gợi ý trừ 0,5 sao (tối đa 3 lần).
                </span>
              )}
            </p>
            <div className="mb-6">
              <StarScoreRow score={computeMiniGame1Stars(timer, hintsUsed)} />
              <p className="text-sm text-gray-500 mt-2">
                Sao mini game 1: {computeMiniGame1Stars(timer, hintsUsed)}/3
              </p>
            </div>

            <div
              className="mb-8 mx-auto max-w-md aspect-video bg-cover bg-center rounded-2xl border-4 border-[#8b6f47] shadow-xl"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1694855475416-64d819d20648?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBsb29tJTIwd2VhdmluZyUyMGZyYW1lJTIwcGFydHN8ZW58MXx8fHwxNzczNDgwNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
              }}
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={handleContinueToMiniGame2}
                className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] hover:from-[#5d9e3a] hover:to-[#4a7c2f] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Tiếp tục
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleReplayMiniGame1}
                className="bg-gradient-to-r from-[#64748b] to-[#475569] hover:from-[#475569] hover:to-[#64748b] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hint and Undo Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={handleHint}
          className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#8b5cf6] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg"
          disabled={hintsUsed >= MAX_HINTS}
        >
          Sử dụng gợi ý ({hintsUsed}/{MAX_HINTS})
        </button>
        <button
          onClick={handleUndo}
          className="bg-gradient-to-r from-[#64748b] to-[#475569] hover:from-[#475569] hover:to-[#64748b] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg"
          disabled={placementHistory.length === 0}
        >
          Hoàn tác
        </button>
      </div>

      {/* Hint Display */}
      {showHint && hintPieceId && (
        <div className="fixed top-4 right-4 bg-black/60 backdrop-blur-sm p-4 rounded-lg text-white text-sm font-semibold">
          Gợi ý: Đặt mảnh ghép {hintPieceId} vào vị trí đúng.
        </div>
      )}
    </div>
  );
}

interface PatternCell {
  row: number;
  col: number;
  color: string;
}

// 3 màu tương phản để người chơi dễ ghi nhớ
const PATTERN_COLORS = ['#f59e0b', '#ef4444', '#22c55e'];

// Lưới MG2: ngang 8, dọc 3 => 3x8 (24 ô)
const MG2_ROWS = 3;
const MG2_COLS = 8;
const MG2_PATTERN_LEN = 5; // 5 dòng/step
const MG2_MEMORIZE_SEC = 8; // tăng thời xem/ghi nhớ
const MG2_MAX_HINTS = 7;

function generateOrderedPattern(
  len: number,
  rows: number,
  cols: number,
): PatternCell[] {
  const used = new Set<string>();
  const out: PatternCell[] = [];
  for (let g = 0; g < 400 && out.length < len; g++) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    const key = `${row},${col}`;
    if (used.has(key)) continue;
    used.add(key);
    out.push({
      row,
      col,
      color: PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)],
    });
  }
  if (out.length < len) {
    for (let r = 0; r < rows && out.length < len; r++) {
      for (let c = 0; c < cols && out.length < len; c++) {
        const key = `${r},${c}`;
        if (used.has(key)) continue;
        used.add(key);
        out.push({
          row: r,
          col: c,
          color: PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)],
        });
      }
    }
  }
  return out;
}

function MiniGame2({ onComplete }: { onComplete: (stars: number) => void }) {
  const { triggerEvent } = useAI();
  const [memorizePhase, setMemorizePhase] = useState(true);
  const [memorizeIndex, setMemorizeIndex] = useState(0);
  // Khởi tạo ngay — tránh pattern=[] trong vài frame khiến hết thời gian nhớ mà chưa có chuỗi
  const [pattern, setPattern] = useState<PatternCell[]>(() =>
    generateOrderedPattern(MG2_PATTERN_LEN, MG2_ROWS, MG2_COLS),
  );
  const [playerPattern, setPlayerPattern] = useState<PatternCell[]>([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [wrongTries, setWrongTries] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintFlash, setHintFlash] = useState<PatternCell | null>(null);
  const [playSeconds, setPlaySeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const lastActionRef = useRef(Date.now());
  const idleTriggeredRef = useRef(false);
  const actionTimesRef = useRef<number[]>([]);
  const lastSpamEventRef = useRef(0);
  const failManyTriggeredRef = useRef(false);
  const completedEventRef = useRef(false);

  const trackAction = useCallback(() => {
    const now = Date.now();
    lastActionRef.current = now;
    idleTriggeredRef.current = false;
    actionTimesRef.current = [...actionTimesRef.current.filter((t) => now - t <= 10000), now];
    if (actionTimesRef.current.length >= 10 && now - lastSpamEventRef.current > 15000) {
      lastSpamEventRef.current = now;
      triggerEvent({ event: 'spam_click', level: 4, step: 2 }).catch(() => {});
    }
  }, [triggerEvent]);

  useEffect(() => {
    if (!memorizePhase || completed) return;
    if (pattern.length === 0) return;

    // Hiện từng "dòng" (1 ô) lần lượt. Tổng thời gian ghi nhớ vẫn giữ MG2_MEMORIZE_SEC.
    const stepMs = (MG2_MEMORIZE_SEC * 1000) / MG2_PATTERN_LEN;
    const t = window.setTimeout(() => {
      setMemorizeIndex((i) => {
        const next = i + 1;
        if (next >= MG2_PATTERN_LEN) setMemorizePhase(false);
        return next;
      });
    }, stepMs);

    return () => window.clearTimeout(t);
  }, [memorizePhase, completed, pattern.length, memorizeIndex]);

  useEffect(() => {
    if (memorizePhase || completed) return;
    const id = window.setInterval(() => setPlaySeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [memorizePhase, completed]);

  useEffect(() => {
    if (completed) return;
    const interval = window.setInterval(() => {
      if (Date.now() - lastActionRef.current >= 30000 && !idleTriggeredRef.current) {
        idleTriggeredRef.current = true;
        triggerEvent({ event: 'idle', level: 4, step: 2 }).catch(() => {});
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [completed, triggerEvent]);

  useEffect(() => {
    if (!hintFlash) return;
    const t = setTimeout(() => setHintFlash(null), 2000);
    return () => clearTimeout(t);
  }, [hintFlash]);

  const resetMiniGame2 = useCallback(() => {
    setPattern(generateOrderedPattern(MG2_PATTERN_LEN, MG2_ROWS, MG2_COLS));
    setPlayerPattern([]);
    setCurrentColorIndex(0);
    setWrongTries(0);
    setHintsUsed(0);
    setHintFlash(null);
    setPlaySeconds(0);
    setCompleted(false);
    setMemorizePhase(true);
    setMemorizeIndex(0);
  }, []);

  const handleHint = () => {
    trackAction();
    if (memorizePhase || completed) return;
    if (hintsUsed >= MG2_MAX_HINTS) return;
    const next = pattern[playerPattern.length];
    if (!next) return;
    setHintsUsed((h) => h + 1);
    setHintFlash(next);
  };

  const handleUndo = () => {
    trackAction();
    if (memorizePhase || completed) return;
    setPlayerPattern((prev) => prev.slice(0, -1));
  };

  const handleCellClick = (row: number, col: number) => {
    trackAction();
    if (memorizePhase || completed) return;

    const idxInPlayer = playerPattern.findIndex(
      (c) => c.row === row && c.col === col,
    );
    if (idxInPlayer >= 0) {
      setPlayerPattern((prev) => prev.slice(0, idxInPlayer));
      return;
    }

    const nextIdx = playerPattern.length;
    if (nextIdx >= pattern.length) return;

    const expected = pattern[nextIdx];
    const chosenColor = PATTERN_COLORS[currentColorIndex];
    const ok =
      expected.row === row &&
      expected.col === col &&
      expected.color === chosenColor;

    if (!ok) {
      setWrongTries((w) => {
        const next = w + 1;
        triggerEvent({ event: 'wrong_action', level: 4, step: 2, fail_count: next }).catch(() => {});
        if (next >= 3 && !failManyTriggeredRef.current) {
          failManyTriggeredRef.current = true;
          triggerEvent({ event: 'fail_many', level: 4, step: 2, fail_count: next }).catch(() => {});
        }
        return next;
      });
      return;
    }

    setPlayerPattern((prev) => [
      ...prev,
      { row, col, color: chosenColor },
    ]);

    if (nextIdx + 1 >= pattern.length) {
      setCompleted(true);
      if (!completedEventRef.current) {
        completedEventRef.current = true;
        if (wrongTries === 0 && hintsUsed === 0) {
          triggerEvent({ event: 'excellent', level: 4, step: 2 }).catch(() => {});
        } else if (playSeconds <= 25) {
          triggerEvent({ event: 'win_fast', level: 4, step: 2 }).catch(() => {});
        }
      }
    }
  };

  const getCellColor = (row: number, col: number) => {
    if (memorizePhase) {
      const current = pattern[memorizeIndex];
      return current && current.row === row && current.col === col
        ? current.color
        : 'transparent';
    }
    const played = playerPattern.find((c) => c.row === row && c.col === col);
    return played ? played.color : 'transparent';
  };

  const finalStars = computeMiniGame2Stars(wrongTries, hintsUsed, playSeconds);

  const handleFinishLevel = () => {
    onComplete(finalStars);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border-4 border-[#8b5cf6]">
          <h2 className="text-xl font-bold text-[#4a3f2e]" style={{ fontFamily: 'serif' }}>
            {memorizePhase
              ? `Ghi nhớ dòng: ${Math.min(memorizeIndex + 1, MG2_PATTERN_LEN)}/${MG2_PATTERN_LEN}`
              : 'Căng sợi đúng thứ tự'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {memorizePhase
              ? `Mỗi lần hiện 1 dòng (1 ô) theo thứ tự trên lưới 3x8. Tổng ${MG2_PATTERN_LEN} dòng.`
              : `Bước ${playerPattern.length}/${pattern.length} · Thời gian: ${playSeconds}s`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border-4 border-red-400">
            <span className="text-sm font-semibold text-[#4a3f2e]">Lần sai: </span>
            <span className="text-2xl font-bold text-red-500">{wrongTries}</span>
            <span className="text-xs text-gray-500 block">Mỗi lần sai trừ 0,5 sao</span>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border-4 border-[#4a7c2f]">
            <span className="text-sm font-semibold text-[#4a3f2e]">Gợi ý: </span>
            <span className="text-xl font-bold text-[#4a7c2f]">
              {MG2_MAX_HINTS - hintsUsed}/{MG2_MAX_HINTS}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleHint}
          disabled={memorizePhase || completed || hintsUsed >= MG2_MAX_HINTS}
          className={`
            px-6 py-3 rounded-full font-bold shadow-lg transition-all
            ${memorizePhase || completed || hintsUsed >= MG2_MAX_HINTS
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#8b5cf6]'
            }
          `}
        >
          Gợi ý (−0,5 sao / lần)
        </button>
        <button
          type="button"
          onClick={handleUndo}
          disabled={memorizePhase || completed || playerPattern.length === 0}
          className={`
            px-6 py-3 rounded-full font-bold shadow-lg transition-all
            ${memorizePhase || completed || playerPattern.length === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-[#64748b] to-[#475569] text-white'
            }
          `}
        >
          Hoàn tác bước
        </button>
        <button
          type="button"
          onClick={resetMiniGame2}
          className="px-6 py-3 rounded-full font-bold shadow-lg bg-gradient-to-r from-red-500 to-red-600 text-white"
        >
          Chơi lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {!memorizePhase && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-[#8b6f47]">
            <h3 className="text-xl font-bold text-[#4a3f2e] mb-4 text-center" style={{ fontFamily: 'serif' }}>
              Chọn màu sợi
            </h3>
            <div className="space-y-3">
              {PATTERN_COLORS.map((color, index) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCurrentColorIndex(index)}
                  className={`
                    w-full h-16 rounded-xl transition-all duration-200
                    ${currentColorIndex === index ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Click đúng ô + đúng màu theo thứ tự đã nhớ. Click lại ô đã chọn để xóa từ bước đó.
            </p>
          </div>
        )}

        <div
          className={`${memorizePhase ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-[#8b6f47]`}
        >
          <h3 className="text-2xl font-bold text-[#4a3f2e] mb-6 text-center" style={{ fontFamily: 'serif' }}>
            {memorizePhase ? 'Hình mẫu (thứ tự các ô màu)' : 'Khung dệt — căng sợi'}
          </h3>
          <div
            className="inline-grid gap-1 mx-auto"
            style={{ gridTemplateColumns: `repeat(${MG2_COLS}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: MG2_ROWS * MG2_COLS }).map((_, i) => {
              const row = Math.floor(i / MG2_COLS);
              const col = i % MG2_COLS;
              const cellColor = getCellColor(row, col);
              const isHint =
                hintFlash &&
                hintFlash.row === row &&
                hintFlash.col === col;
          const current = memorizePhase ? pattern[memorizeIndex] : null;
          const isCurrentCell =
            memorizePhase && current && current.row === row && current.col === col;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCellClick(row, col)}
                  className={`
                    relative w-12 h-12 border-2 rounded transition-all duration-200
                    ${!memorizePhase && !completed ? 'cursor-pointer hover:scale-110 border-gray-300' : 'border-gray-300'}
                    ${isHint ? 'ring-4 ring-purple-500 scale-110 z-10' : ''}
                  `}
                  style={{ backgroundColor: cellColor || '#f3f4f6' }}
                >
                {isCurrentCell && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {memorizeIndex + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {completed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-[#f59e0b]">
            <div className="mb-6">
              <Award className="w-20 h-20 mx-auto text-[#f59e0b]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4a3f2e] mb-2" style={{ fontFamily: 'serif' }}>
              Đã căng đủ sợi!
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Thời gian chơi: {playSeconds}s · Lần sai: {wrongTries} · Gợi ý: {hintsUsed}
            </p>
            <div className="mb-6">
              <StarScoreRow score={finalStars} />
              <p className="text-sm text-gray-500 mt-2">Sao mini game 2: {finalStars}/3</p>
            </div>
            <button
              type="button"
              onClick={handleFinishLevel}
              className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] hover:from-[#5d9e3a] hover:to-[#4a7c2f] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg w-full"
            >
              Hoàn thành Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Level4Page() {
  const navigate = useNavigate();
  const { triggerEvent } = useAI();
  const [currentMiniGame, setCurrentMiniGame] = useState<1 | 2 | 'complete'>(1);
  const [miniGame1Stars, setMiniGame1Stars] = useState(0);
  const [miniGame2Stars, setMiniGame2Stars] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    const key = 'ai:new_player:level4';
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '1');
      triggerEvent({ event: 'new_player', level: 4, step: 1 }).catch(() => {});
    }
  }, [triggerEvent]);

  const handleMiniGame1Complete = (stars: number) => {
    setMiniGame1Stars(stars);
    setCurrentMiniGame(2);
  };

  const handleMiniGame2Complete = (stars: number) => {
    setMiniGame2Stars(stars);
    setCurrentMiniGame('complete');
  };

  const finalStars = clampHalfStar((miniGame1Stars + miniGame2Stars) / 2);

  const confirmExitToGameHub = () => {
    setShowExitConfirm(false);
    navigate('/game');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#fef3c7] to-[#fed7aa] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#4a7c2f]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] py-6 px-8 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'serif' }}>
                Level 4 - Lắp khung dệt chiếu
              </h1>
              <p className="text-white/90">Làng dệt chiếu Đinh Yên</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => triggerEvent({ event: 'ask_info', level: 4, step: currentMiniGame === 'complete' ? 3 : currentMiniGame })}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                Trợ giúp
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirm(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Thoát
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10 max-w-4xl mx-auto mt-8 px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-4 border-[#8b6f47]">
            <div className="flex items-center justify-between">
              <div className={`flex-1 text-center ${currentMiniGame === 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${currentMiniGame === 1 ? 'bg-gradient-to-br from-[#4a7c2f] to-[#5d9e3a]' : 'bg-gray-400'}`}>
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <p className="mt-2 font-semibold text-[#4a3f2e]">Lắp khung dệt</p>
              </div>
              <div className="w-16 h-1 bg-gray-300"></div>
              <div className={`flex-1 text-center ${currentMiniGame === 2 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${currentMiniGame === 2 ? 'bg-gradient-to-br from-[#4a7c2f] to-[#5d9e3a]' : 'bg-gray-400'}`}>
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <p className="mt-2 font-semibold text-[#4a3f2e]">Dệt chiếu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="relative z-10 mt-8">
          {currentMiniGame === 1 && <MiniGame1 onComplete={handleMiniGame1Complete} />}
          {currentMiniGame === 2 && <MiniGame2 onComplete={handleMiniGame2Complete} />}
          {currentMiniGame === 'complete' && (
            <div className="max-w-2xl mx-auto px-8 py-16 text-center">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-4 border-[#f59e0b]">
                <Award className="w-24 h-24 mx-auto text-[#f59e0b] mb-6" />
                <h2 className="text-4xl font-bold text-[#4a3f2e] mb-6">
                  Chúc mừng!
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Bạn đã hoàn thành Level 4
                </p>
                
                {/* Final Stars */}
                <div className="mb-8">
                  <div className="flex justify-center scale-125 mb-4">
                    <StarScoreRow score={finalStars} />
                  </div>
                  <p className="text-lg text-gray-600">
                    Điểm tổng: {finalStars} / 3 sao (trung bình 2 mini game)
                  </p>
                </div>

                {/* Mini Games Results */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Mini Game 1 — Lắp khung</p>
                    <StarScoreRow score={miniGame1Stars} />
                    <p className="text-xs text-gray-500 mt-2 text-center">{miniGame1Stars}/3</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Mini Game 2 — Căng sợi</p>
                    <StarScoreRow score={miniGame2Stars} />
                    <p className="text-xs text-gray-500 mt-2 text-center">{miniGame2Stars}/3</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setCurrentMiniGame(1);
                      setMiniGame1Stars(0);
                      setMiniGame2Stars(0);
                    }}
                    className="bg-gradient-to-r from-[#64748b] to-[#475569] hover:from-[#475569] hover:to-[#64748b] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Chơi lại
                  </button>
                  <Link to="/craft-selection">
                    <button className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] hover:from-[#5d9e3a] hover:to-[#4a7c2f] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Về menu
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {showExitConfirm && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-[#8b6f47]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="exit-title"
            >
              <h2 id="exit-title" className="text-2xl font-bold text-[#4a3f2e] mb-3" style={{ fontFamily: 'serif' }}>
                Thoát Level 4?
              </h2>
              <p className="text-gray-600 mb-6">
                Tiến độ hiện tại sẽ không được lưu. Bạn chỉ nhận kết quả khi hoàn thành cả hai mini game.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-6 py-3 rounded-full font-bold border-2 border-gray-300 text-[#4a3f2e] hover:bg-gray-50"
                >
                  Ở lại
                </button>
                <button
                  type="button"
                  onClick={confirmExitToGameHub}
                  className="px-6 py-3 rounded-full font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                >
                  Thoát về màn chờ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
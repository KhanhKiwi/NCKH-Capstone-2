import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Star, Clock, Award, ArrowRight, Home, RotateCcw, RotateCw } from 'lucide-react';
import { Link } from 'react-router';

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
      [1, 0],
    ],
    color: '#f59e0b',
  },
  {
    id: 'piece-2',
    name: 'Thanh ngang',
    shape: [
      [1, 1, 1, 1],
    ],
    color: '#d97706',
  },
  {
    id: 'piece-3',
    name: 'Bàn đạp',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
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
      [0, 1],
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
        ref={drag}
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

  const MAX_HINTS = 3;

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

  const handleRotate = (pieceId: string) => {
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
    if (!piece) return;

    const rotatedShape = getRotatedShape(piece.shape, piece.rotation);

    if (!canPlacePiece(rotatedShape, row, col)) return;

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
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId ? { ...p, placed: true, position: { row, col } } : p
      )
    );

    // Check completion
    const allTargetsFilled = newBoard.every((row) =>
      row.every((cell) => cell.type !== 'target' || cell.occupiedBy)
    );

    if (allTargetsFilled) {
      setCompleted(true);
      setTimeout(() => setShowLoom(true), 1000);
    }
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
    setBoard(createInitialBoard());
    setPieces(PUZZLE_PIECES.map((p) => ({ ...p, rotation: 0, placed: false })));
    setTimer(0);
    setCompleted(false);
    setShowLoom(false);
    setPlacementHistory([]);
  };

  const handleUndo = () => {
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
    placePiece(item.id, row, col);
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
      if (cell.occupiedBy) {
        removePiece(cell.occupiedBy);
      }
    };

    return (
      <div
        ref={drop}
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

  const handleClickLoom = () => {
    let stars = 1;
    if (timer < 30) stars = 2;
    if (timer < 15) stars = 3;
    onComplete(stars);
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

      {/* Completion - Show Loom */}
      {showLoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl text-center">
            <div className="mb-6">
              <Award className="w-20 h-20 mx-auto text-[#f59e0b]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4a3f2e] mb-4">
              Puzzle hoàn thành!
            </h2>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-10 h-10 ${
                    i < (timer < 15 ? 3 : timer < 30 ? 2 : 1)
                      ? 'text-[#f59e0b] fill-[#f59e0b]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Thời gian: {timer}s
            </p>

            {/* Complete Loom Image */}
            <div 
              className="mb-8 mx-auto w-80 h-80 bg-cover bg-center rounded-2xl border-4 border-[#8b6f47] shadow-xl cursor-pointer hover:scale-105 transition-transform"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1694855475416-64d819d20648?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBsb29tJTIwd2VhdmluZyUyMGZyYW1lJTIwcGFydHN8ZW58MXx8fHwxNzczNDgwNjMxfDA&ixlib=rb-4.1.0&q=80&w=1080')`
              }}
              onClick={handleClickLoom}
            >
              <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent rounded-2xl flex items-end justify-center pb-6">
                <p className="text-white text-xl font-bold">Click để tiếp tục</p>
              </div>
            </div>

            <button
              onClick={handleClickLoom}
              className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] hover:from-[#5d9e3a] hover:to-[#4a7c2f] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              Tiếp tục
              <ArrowRight className="w-6 h-6" />
            </button>
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

const PATTERN_COLORS = ['#d97706', '#4a7c2f', '#8b5cf6', '#f59e0b', '#059669'];

function MiniGame2({ onComplete }: { onComplete: (stars: number) => void }) {
  const [showPattern, setShowPattern] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [pattern, setPattern] = useState<PatternCell[]>([]);
  const [playerPattern, setPlayerPattern] = useState<PatternCell[]>([]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);

  const GRID_SIZE = 8;

  // Generate random pattern
  useEffect(() => {
    const generated: PatternCell[] = [];
    for (let i = 0; i < 16; i++) {
      generated.push({
        row: Math.floor(Math.random() * GRID_SIZE),
        col: Math.floor(Math.random() * GRID_SIZE),
        color: PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)],
      });
    }
    setPattern(generated);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (showPattern && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showPattern && countdown === 0) {
      setShowPattern(false);
    }
  }, [showPattern, countdown]);

  const handleCellClick = (row: number, col: number) => {
    if (showPattern || completed) return;

    const currentColor = PATTERN_COLORS[currentColorIndex];
    const newCell: PatternCell = { row, col, color: currentColor };

    // Check if already placed
    const exists = playerPattern.some((c) => c.row === row && c.col === col);
    if (exists) {
      // Remove cell
      setPlayerPattern((prev) => prev.filter((c) => !(c.row === row && c.col === col)));
      return;
    }

    // Add cell
    setPlayerPattern((prev) => [...prev, newCell]);

    // Check if correct
    const isCorrect = pattern.some(
      (c) => c.row === row && c.col === col && c.color === currentColor
    );
    
    if (!isCorrect) {
      setErrors((e) => e + 1);
    }

    // Check if complete
    if (playerPattern.length + 1 >= pattern.length) {
      setTimeout(() => setCompleted(true), 500);
    }
  };

  const getCellColor = (row: number, col: number) => {
    if (showPattern) {
      const cell = pattern.find((c) => c.row === row && c.col === col);
      return cell ? cell.color : 'transparent';
    } else {
      const cell = playerPattern.find((c) => c.row === row && c.col === col);
      return cell ? cell.color : 'transparent';
    }
  };

  const handleComplete = () => {
    let stars = 1;
    if (errors < 3) stars = 2;
    if (errors === 0) stars = 3;
    onComplete(stars);
  };

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border-4 border-[#8b5cf6]">
          <h2 className="text-xl font-bold text-[#4a3f2e]">
            {showPattern ? `Ghi nhớ pattern: ${countdown}s` : 'Dệt lại pattern'}
          </h2>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border-4 border-red-500">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-[#4a3f2e]">Lỗi:</span>
            <span className="text-2xl font-bold text-red-500">{errors}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Color Palette */}
        {!showPattern && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-[#8b6f47]">
            <h3 className="text-xl font-bold text-[#4a3f2e] mb-4 text-center">
              Chọn màu
            </h3>
            <div className="space-y-3">
              {PATTERN_COLORS.map((color, index) => (
                <button
                  key={color}
                  onClick={() => setCurrentColorIndex(index)}
                  className={`
                    w-full h-16 rounded-xl transition-all duration-200
                    ${currentColorIndex === index ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Weaving Grid */}
        <div className={`${showPattern ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border-4 border-[#8b6f47]`}>
          <h3 className="text-2xl font-bold text-[#4a3f2e] mb-6 text-center">
            {showPattern ? 'Hình mẫu chiếu' : 'Dệt chiếu của bạn'}
          </h3>
          <div className="inline-grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const row = Math.floor(i / GRID_SIZE);
              const col = i % GRID_SIZE;
              const cellColor = getCellColor(row, col);
              
              return (
                <div
                  key={i}
                  onClick={() => handleCellClick(row, col)}
                  className={`
                    w-12 h-12 border-2 border-gray-300 rounded transition-all duration-200
                    ${!showPattern && !completed ? 'cursor-pointer hover:scale-110' : ''}
                  `}
                  style={{ backgroundColor: cellColor || '#f3f4f6' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {completed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
            <div className="mb-6">
              <Award className="w-20 h-20 mx-auto text-[#f59e0b]" />
            </div>
            <h2 className="text-3xl font-bold text-[#4a3f2e] mb-4">
              Hoàn thành Mini Game 2!
            </h2>
            <div className="flex justify-center gap-2 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-10 h-10 ${
                    i < (errors === 0 ? 3 : errors < 3 ? 2 : 1)
                      ? 'text-[#f59e0b] fill-[#f59e0b]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-lg text-gray-600 mb-6">Số lỗi: {errors}</p>
            <button
              onClick={handleComplete}
              className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] hover:from-[#5d9e3a] hover:to-[#4a7c2f] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg"
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
  const [currentMiniGame, setCurrentMiniGame] = useState<1 | 2 | 'complete'>(1);
  const [miniGame1Stars, setMiniGame1Stars] = useState(0);
  const [miniGame2Stars, setMiniGame2Stars] = useState(0);

  const handleMiniGame1Complete = (stars: number) => {
    setMiniGame1Stars(stars);
    setTimeout(() => setCurrentMiniGame(2), 1000);
  };

  const handleMiniGame2Complete = (stars: number) => {
    setMiniGame2Stars(stars);
    setTimeout(() => setCurrentMiniGame('complete'), 1000);
  };

  const finalStars = Math.round((miniGame1Stars + miniGame2Stars) / 2);

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
              <Link to="/craft-selection">
                <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Quay lại
                </button>
              </Link>
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
                  <div className="flex justify-center gap-3 mb-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-16 h-16 ${
                          i < finalStars
                            ? 'text-[#f59e0b] fill-[#f59e0b]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-lg text-gray-600">
                    Điểm tổng: {finalStars} sao
                  </p>
                </div>

                {/* Mini Games Results */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Mini Game 1</p>
                    <div className="flex justify-center gap-1">
                      {Array.from({ length: miniGame1Stars }).map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-[#f59e0b] fill-[#f59e0b]" />
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-2">Mini Game 2</p>
                    <div className="flex justify-center gap-1">
                      {Array.from({ length: miniGame2Stars }).map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-[#f59e0b] fill-[#f59e0b]" />
                      ))}
                    </div>
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
      </div>
    </DndProvider>
  );
}
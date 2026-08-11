import { useEffect } from 'react';
import { gridPoints } from '../../../constants/quickRepair/quickRepair.constants';

interface PatternDeps {
  drawnPattern: number[];
  setDrawnPattern: (v: number[]) => void;
  setPatternPoints: (v: string) => void;
  setPatternSequence: (v: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function usePatternCanvas({ drawnPattern, setDrawnPattern, setPatternPoints, setPatternSequence, canvasRef }: PatternDeps) {
  const drawPattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gridPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = drawnPattern.includes(point.id) ? '#3b82f6' : '#e5e7eb';
      ctx.fill();
      ctx.strokeStyle = drawnPattern.includes(point.id) ? '#2563eb' : '#9ca3af';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    if (drawnPattern.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const firstPoint = gridPoints.find(p => p.id === drawnPattern[0]);
      if (firstPoint) ctx.moveTo(firstPoint.x, firstPoint.y);
      for (let i = 1; i < drawnPattern.length; i++) {
        const point = gridPoints.find(p => p.id === drawnPattern[i]);
        if (point) ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }

    gridPoints.forEach(point => {
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.id.toString(), point.x, point.y);
    });
  };

  useEffect(() => { drawPattern(); }, [drawnPattern]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedPoint = gridPoints.find(point => {
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2));
      return distance < 20;
    });

    if (clickedPoint && !drawnPattern.includes(clickedPoint.id)) {
      const newPattern = [...drawnPattern, clickedPoint.id];
      setDrawnPattern(newPattern);
      setPatternPoints(newPattern.map(id => id.toString()).join(','));
      setPatternSequence(newPattern.map(id => id.toString()).join(','));
    }
  };

  const clearPattern = () => {
    setDrawnPattern([]);
    setPatternPoints('');
    setPatternSequence('');
  };

  return { handleCanvasClick, clearPattern };
}

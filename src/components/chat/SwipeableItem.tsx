import { useState, useRef, TouchEvent, MouseEvent, ReactNode } from "react";

interface SwipeableItemProps {
  id: string;
  onSwipeComplete: () => Promise<void>;
  onItemClick?: () => void;
  children: ReactNode;
}

export const SwipeableItem = ({ id, onSwipeComplete, onItemClick, children }: SwipeableItemProps) => {
  const [isActive, setIsActive] = useState(false);
  const touchStartX = useRef<number>(0);
  const currentOffset = useRef<number>(0);
  const isSwiping = useRef(false);
  const isDragging = useRef(false);
  const hasSwipedSignificantly = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsActive(true);
    isSwiping.current = false;
    hasSwipedSignificantly.current = false;
  };

  const handleMouseDown = (e: MouseEvent) => {
    touchStartX.current = e.clientX;
    setIsActive(true);
    isSwiping.current = false;
    isDragging.current = true;
    hasSwipedSignificantly.current = false;
  };

  const handleMove = (clientX: number) => {
    if (!isActive) return;
    const diff = touchStartX.current - clientX;
    if (Math.abs(diff) > 5) {
      isSwiping.current = true;
    }
    if (Math.abs(diff) > 20) {
      hasSwipedSignificantly.current = true;
    }
    currentOffset.current = Math.max(0, Math.min(diff, 100));
    
    const element = document.getElementById(`swipeable-${id}`);
    if (element) {
      element.style.transform = `translateX(-${currentOffset.current}px)`;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleDragEnd = async () => {
    if (!isActive) return;
    
    const element = document.getElementById(`swipeable-${id}`);
    if (!element) return;

    if (currentOffset.current > 50) {
      await onSwipeComplete();
    } else {
      element.style.transform = 'translateX(0)';
      if (!isSwiping.current && !hasSwipedSignificantly.current && onItemClick) {
        onItemClick();
      }
    }

    currentOffset.current = 0;
    setIsActive(false);
    isSwiping.current = false;
    isDragging.current = false;
    hasSwipedSignificantly.current = false;
  };

  return (
    <div
      id={`swipeable-${id}`}
      className="relative touch-pan-y cursor-pointer select-none overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {children}
    </div>
  );
};
import React, { useState, useRef, TouchEvent, MouseEvent, ReactElement } from "react";
import { ChatItem } from "./ChatItem";

interface SwipeableItemProps {
  id: string;
  onSwipeComplete: () => Promise<void>;
  children: ReactElement<{ isSwiping?: boolean }>;
}

export const SwipeableItem = ({ id, onSwipeComplete, children }: SwipeableItemProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number>(0);
  const currentOffset = useRef<number>(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsActive(true);
    setIsSwiping(false);
  };

  const handleMouseDown = (e: MouseEvent) => {
    touchStartX.current = e.clientX;
    setIsActive(true);
    setIsSwiping(false);
    isDragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isActive) return;
    
    const diff = touchStartX.current - clientX;
    if (Math.abs(diff) > 5) {
      setIsSwiping(true);
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
    }

    currentOffset.current = 0;
    setIsActive(false);
    isDragging.current = false;
    // Don't reset isSwiping here to prevent click after swipe
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
      {React.cloneElement(children, { isSwiping })}
    </div>
  );
};
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StickyHeaderProps {
  title: string;
  rightElement?: ReactNode;
  emoji?: string;
  description?: string;
}

const StickyHeader = ({ title, rightElement, emoji, description }: StickyHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
      <header className="px-6 py-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold leading-none">{title}</h1>
          {rightElement}
        </div>
        {(emoji || description) && (
          <div className="flex items-center gap-3">
            {emoji && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                <span className="text-2xl">{emoji}</span>
              </div>
            )}
            {description && (
              <div className="flex items-center bg-muted rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default StickyHeader;
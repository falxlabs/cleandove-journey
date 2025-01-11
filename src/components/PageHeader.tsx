import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  emoji: string;
  description: string;
}

const PageHeader = ({ title, emoji, description }: PageHeaderProps) => {
  return (
    <header className="px-6 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
          <span className="text-2xl">{emoji}</span>
        </div>
        <div className="flex items-center bg-muted rounded-lg px-4 py-2">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
import { Star, MessageSquare, Calendar, Trash2 } from "lucide-react";

interface ChatItemProps {
  id: string;
  title: string;
  preview: string;
  date: string;
  replies: number;
  favorite: boolean;
  onFavorite: () => void;
  onClick: () => void;
  isSwiping?: boolean;
}

export const ChatItem = ({ 
  id, 
  title, 
  preview, 
  date, 
  replies, 
  favorite, 
  onFavorite,
  onClick,
  isSwiping = false
}: ChatItemProps) => {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite();
  };

  const handleClick = () => {
    if (!isSwiping) {
      onClick();
    }
  };

  return (
    <>
      <div 
        className="p-4 bg-card rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{title}</h3>
          <button
            onClick={handleFavoriteClick}
            className={`p-1 rounded-full transition-colors ${
              favorite
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Star className={`h-5 w-5 ${favorite ? "fill-current" : ""}`} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {truncateText(preview, 150)}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-4">{date}</span>
          <MessageSquare className="h-4 w-4 mr-1" />
          <span>{replies} replies</span>
        </div>
      </div>
      <div 
        className="absolute inset-0 bg-destructive flex items-center justify-end"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="px-4">
          <Trash2 className="text-white h-6 w-6" />
        </div>
      </div>
    </>
  );
};
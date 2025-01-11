import { X, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StreakHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <button onClick={handleBack} className="hover:opacity-70 transition-opacity">
        <X className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-semibold">Streak</h1>
      <Share2 className="w-6 h-6" />
    </div>
  );
};
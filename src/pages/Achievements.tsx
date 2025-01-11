import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonalRecordsSection from "@/components/achievements/PersonalRecordsSection";
import AwardsSection from "@/components/achievements/AwardsSection";

const Achievements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center p-4 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Achievements</h1>
        </div>
      </div>

      <div className="px-4 space-y-8">
        <PersonalRecordsSection />
        <AwardsSection />
      </div>
    </div>
  );
};

export default Achievements;
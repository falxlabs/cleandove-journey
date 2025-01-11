import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonalRecordsSection from "@/components/achievements/PersonalRecordsSection";
import AwardsSection from "@/components/achievements/AwardsSection";

const Achievements = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-accent hover:text-accent-foreground rounded-md p-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold">Achievements</h1>
        </div>
      </div>

      <div className="px-4 space-y-8 mb-8 mt-6">
        <PersonalRecordsSection />
        <AwardsSection />
      </div>
    </div>
  );
};

export default Achievements;
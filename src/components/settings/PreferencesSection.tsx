import { ChristianContentToggle } from "./ChristianContentToggle";
import { ContentTypePreference } from "./ContentTypePreference";

const PreferencesSection = () => {
  return (
    <div className="px-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Preferences</h2>
      <div className="space-y-6 bg-card rounded-lg p-6 shadow-sm">
        <ChristianContentToggle />
        <ContentTypePreference />
      </div>
    </div>
  );
};

export default PreferencesSection;
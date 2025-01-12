import AwardCard from "./AwardCard";
import { awards } from "@/data/awards";

const AwardsSection = () => {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Awards</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {awards.map((award, index) => (
          <AwardCard key={index} {...award} />
        ))}
      </div>
    </section>
  );
};

export default AwardsSection;
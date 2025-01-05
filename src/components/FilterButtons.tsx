import { Button } from "@/components/ui/button";

interface FilterButtonsProps {
  filter: "all" | "favorites";
  onFilterChange: (filter: "all" | "favorites") => void;
}

const FilterButtons = ({ filter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
        className="flex-1"
      >
        All Chats
      </Button>
      <Button
        variant={filter === "favorites" ? "default" : "outline"}
        onClick={() => onFilterChange("favorites")}
        className="flex-1"
      >
        Favorites
      </Button>
    </div>
  );
};

export default FilterButtons;
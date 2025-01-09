import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterButtonsProps {
  filter: "all" | "favorites";
  onFilterChange: (filter: "all" | "favorites") => void;
  isLoading?: boolean;
}

const FilterButtons = ({ filter, onFilterChange, isLoading = false }: FilterButtonsProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    );
  }

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
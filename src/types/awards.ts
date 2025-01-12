export interface Level {
  value: number;
  requirement: string;
}

export interface Award {
  title: string;
  levels: Level[];
  currentLevel: number;
  progress: string;
  icon: string;
  color: string;
  description: string;
  isSecret?: boolean;
}
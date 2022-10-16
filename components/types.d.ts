export type LearningUnit = {
  category: 1;
};

export type Cluster = {
  category: 0;
};

export type Item = {
  type: Cluster | LearningUnit;
  tags: string[] | null;
  title: string;
  description: string;
  host: string;
  room: string | null;
  participants: string[];
  maxParticipants: number;
};

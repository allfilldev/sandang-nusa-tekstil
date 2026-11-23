export type AuthorKind = "organization" | "person";

export interface AuthorStats {
  yearsOfExperience?: number;
  completedProjects?: number;
}

export interface Author {
  id: string;
  kind: AuthorKind;
  name: string;
  jobTitle: string;
  bio: string;
  stats?: AuthorStats;
  profiles?: string[];
}

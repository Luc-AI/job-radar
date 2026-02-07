export type JobStatus = "saved" | "applied" | "interviewing" | "offered" | "rejected";

export type WorkMode = "remote" | "hybrid" | "onsite";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  salary?: string;
  status: JobStatus;
  url?: string;
  postedAt: string;
  tags: string[];
  description: string;
}

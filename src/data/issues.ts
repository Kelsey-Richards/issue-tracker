// Defines a user connected to an issue
export interface IssueUserRef {
  userId: string;
  fullName: string;
}

// Defines what an issue looks like
export interface Issue {
  title: string;
  description: string;
  status: "open" | "in-progress" | "closed";
  priority: "low" | "medium" | "high";

  // The person who created the issue
  author: IssueUserRef;

  // The person currently assigned to the issue
  assignedTo?: IssueUserRef;

  // Comments added to the issue
  comments?: {
    _id: string;
    userId: string;
  }[];

  // Stores the hours worked on this issue
  timeLog?: {
    userId: string;
    hoursWorked: number;
    loggedOn: Date;
  }[];

  // Track who last updated the issue and when
  updatedBy?: IssueUserRef;
  updatedAt?: Date;

  // Track who closed the issue and when
  closedBy?: IssueUserRef;
  closedAt?: Date;
}

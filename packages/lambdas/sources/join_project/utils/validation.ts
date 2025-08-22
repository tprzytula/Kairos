import { IProject, IProjectMember } from "@kairos-lambdas-libs/dynamodb/types/projects";

export const validateProjectJoinability = (project: IProject): string | null => {
  if (project.isPersonal) {
    return "Cannot join personal projects.";
  }
  return null;
};

export const validateUserProjectLimit = (userProjects: IProjectMember[]): string | null => {
  if (userProjects.length >= 5) {
    return "Maximum number of projects reached (5 projects per user).";
  }
  return null;
};

export const validateProjectCapacity = (project: IProject, currentMembers: IProjectMember[]): string | null => {
  const maxMembers = project.maxMembers || 5;
  if (currentMembers.length >= maxMembers) {
    return "Project is at maximum capacity.";
  }
  return null;
};

export const validateExistingMembership = (existingMembership: IProjectMember | null): string | null => {
  if (existingMembership) {
    return "You are already a member of this project.";
  }
  return null;
};

import { IProject, ProjectRole } from "@kairos-lambdas-libs/dynamodb/types/projects";

export const sortProjects = (projects: (IProject & { userRole: ProjectRole })[]): (IProject & { userRole: ProjectRole })[] => {
  return projects.sort((a, b) => {
    if (a.isPersonal !== b.isPersonal) {
      return a.isPersonal ? -1 : 1;
    }
    return b.createdAt - a.createdAt;
  });
};

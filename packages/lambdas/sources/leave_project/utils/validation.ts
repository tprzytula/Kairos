import {
  IProject,
  IProjectMember,
  ProjectRole,
} from '@kairos-lambdas-libs/dynamodb/types/projects';

export const validateMembershipExists = (membership: IProjectMember | null): string | null => {
  if (!membership) {
    return 'You are not a member of this project.';
  }
  return null;
};

export const validateNotOwner = (membership: IProjectMember): string | null => {
  if (membership.role === ProjectRole.OWNER) {
    return 'Project owner cannot leave the project.';
  }
  return null;
};

export const validateNotPersonalProject = (project: IProject | null): string | null => {
  if (project?.isPersonal) {
    return 'Cannot leave a personal project.';
  }
  return null;
};

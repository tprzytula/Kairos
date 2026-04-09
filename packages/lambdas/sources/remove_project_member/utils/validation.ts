import { IProjectMember, ProjectRole } from '@kairos-lambdas-libs/dynamodb/types/projects';

export const validateIsOwner = (membership: IProjectMember | null): string | null => {
  if (!membership || membership.role !== ProjectRole.OWNER) {
    return 'Only the project owner can remove members.';
  }
  return null;
};

export const validateTargetMemberExists = (membership: IProjectMember | null): string | null => {
  if (!membership) {
    return 'The specified user is not a member of this project.';
  }
  return null;
};

export const validateTargetIsNotOwner = (membership: IProjectMember): string | null => {
  if (membership.role === ProjectRole.OWNER) {
    return 'Cannot remove the project owner.';
  }
  return null;
};

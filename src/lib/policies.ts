import type { Role, User, Post } from '@/types';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';
export type Subject = 'Post' | 'User' | 'all';

type DynamicRule = (user: User, subject: any) => boolean;

type Policy = {
  static: Partial<Record<Subject, Action[]>>;
  dynamic?: Partial<Record<Subject, Partial<Record<Action, DynamicRule>>>>;
};

const isOwner: DynamicRule = (user, subject) => {
  if (!subject?.authorId) return false;
  return user.id === subject.authorId;
};

export const policies: Record<Role, Policy> = {
  ADMIN: {
    static: { all: ['manage'] },
    dynamic: {
      Post: {
        update: isOwner,
      },
    },
  },
  SECRETARY: {
    static: {},
  },
  TEACHER: {
    static: {},
  },
  STUDENT: {
    static: {},
  },
};

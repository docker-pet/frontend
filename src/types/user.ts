export enum UserRole {
  'guest' = 'guest',
  'user' = 'user',
  'admin' = 'admin',
}

export interface IUser {
  id: string;
  telegramId: number;
  telegramUsername: string;
  name: string;
  language: string;
  role: UserRole;
  premium: boolean;
  joinPending: boolean;
  avatar: string;

  collectionId: string;
  collectionName: string;

  outlineToken: string;
  outlineServer: string;

  created: string;
  updated: string;
  synced: string;
}

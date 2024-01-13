export type TAuthState = {
  profile: TProfile;
  error: TError | null;
};

export type TProfile = {
  email?: string;
  name?: string;
  uid?: string;
  createdAt?: string;
};

export type TError = {
  type: string;
  message: string;
} | null;

export type TConversations = {
  [id: string]: Array<TMessage>;
};

export type TMessage = {
  authorID: string;
  message: string;
  createdAt: string;
};

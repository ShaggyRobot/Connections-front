export type TGroupsHttpResponse = {
  Count: number;
  Items: Array<TGroupsHttpResponseItem>;
};

export type TUsersHttpResponse = {
  Count: number;
  Items: Array<TUsersHttpResponseItem>;
};

type TUsersHttpResponseItem = {
  name: {
    S: string;
  };
  uid: {
    S: string;
  };
};

type TGroupsHttpResponseItem = {
  id: {
    S: string;
  };
  name: {
    S: string;
  };
  createdAt: {
    S: string;
  };
  createdBy: {
    S: string;
  };
};

export type TUser = {
  name: string;
  uid: string;
};

export type TUserList = {
  count: number;
  users: Array<TUser>;
};

export type TGroup = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
};

export type TGroupList = {
  count: number;
  groups: Array<TGroup>;
};

export type TConversationsListHttpResponse = {
  Count: number;
  Items: Array<TConversationsListHttpResponseItem>;
};

export type TConversationsListHttpResponseItem = {
  id: {
    S: string;
  };
  companionID: {
    S: string;
  };
};

export type TConversation = {
  id: string;
  companionId: string;
};

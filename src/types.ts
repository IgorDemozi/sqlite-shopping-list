export type Item = {
  id: string;
  name: string;
  listId?: string;
};

export type List = {
  id: string;
  name: string;
};

export type ListItem = {
  id: string;
  listId: string;
  itemId: string;
};

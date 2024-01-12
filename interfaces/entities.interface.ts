export type IDefault = {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type IUser = {
  first_name: string;

  last_name: string;

  email: string;

  password: string;

  //   todos: Todo[];
} & IDefault;

export type ITodo = {
  title: string;
  description: string;
  is_done: boolean;
  user:IUser
};

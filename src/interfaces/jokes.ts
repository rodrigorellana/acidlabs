export interface IJoke {
  views: number;
  body: string;
  title: string;
  author: string;

  id?: string;
  createdAt?: string;
}

export interface IUser {
  name: string;
}


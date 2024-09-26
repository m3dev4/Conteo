export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Author {
  _id: string;
  name: string;
}

export interface Story {
  _id: string;
  title: string;
  description: string;
  author: Author; // Doit être de type Author
  coverImage: string;
  category: string | Category
  status: string;
  createdAt: string;
}



export type User = {
  _id: string;
  nameOfUser: string;
  username: string;
  email: string;
  isAdmin: boolean;
};
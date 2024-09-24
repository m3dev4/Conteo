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
  author: Author;
  coverImage: string;
  category: Category; // Modifier ici pour utiliser l'objet Category
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
// Mise à jour de la définition du type Story
export type Category = {
  _id: string
  name: string
  slug: string
  coverImage: string
};

export type Story = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  category: {
    _id: string;
  name: string;
  slug: string
  }
  status: string;
  createdAt: string;
};
import { Edit3, Trash, Trash2 } from "lucide-react";
import React from "react";

type User = {
  _id: string;
  nameOfUser: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

const usersData: User[] = [
    {
        _id: "1",
    nameOfUser: "Alice Dupont",
    username: "alice",
    email: "alice@example.com",
    isAdmin: false,
    }
];

const UserLIst: React.FC = () => {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg mt-8 ">
      <h2 className="font-bold mb-6 text-white">Gestion des utilisateurs</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-left uppercase font-bold">
              <th className="p-4">Nom User</th>
              <th className="p-4">Nom complet</th>
              <th className="p-4">Email</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-700 hover:bg-gray-700 htransition duration-200"
              >
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.nameOfUser}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  {user.isAdmin ? "Admin" : "Utilisateur"}
                </td>
                <td className="p-4 flex jsutify-center space-x-4">
                  <button className="text-blue-400 hover:text-blue-600 transition duration-200">
                    <Edit3 size={20} />
                  </button>
                  <button className="text-blue-400 hover:text-blue-600 transition duration-200">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLIst;

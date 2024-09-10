import React from "react";

type User = {
  _id: string;
  nameOfUser: string;
  email: string;
  registrationDate: string;
};

const recentRegistrations: User[] = [
    {
        _id: "1",
        nameOfUser: "Alice Dupont",
        email: "johndoe@exemple.com",
        registrationDate: "2024-09-05",
      },
];

const RecentRegistration: React.FC = () => {
  return (
    <div className="-p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg mt-8">
      <h2 className="text-white text-lg font-bold mb-4">
        Dernières inscription
      </h2>
      <ul className="space-y-4">
        {recentRegistrations.map((user) => (
          <li
            key={user._id}
            className="flex justify-between bg-gray-700 p-4 rounded-lg shadow"
          >
            <div>
              <p className="text-white font-semibold">{user.nameOfUser}</p>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {new Date(user.registrationDate).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentRegistration;

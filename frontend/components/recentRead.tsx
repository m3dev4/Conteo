import React from "react";

type RecentRead = {
  userId: string;
  username: string;
  storytitle: string;
  readDate: string;
};

const recentread: RecentRead[] = [
    {
        userId: "1",
        username: "Alice Dupont",
        storytitle: "Le Petit Prince",
        readDate: "2024-09-05",
    },
];

const RecentRead: React.FC = () => {
  return (
    <div className="p-6 bg-gardient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg mt-8">
      <h2 className="text-white text-kg font-bold mb-4">
        Dernières histoires lues
      </h2>
      <ul>
        {recentread.map((read) => (
          <li
            key={read.userId}
            className="flex justify-between bg-gary-700 p-4 rounded-lg shadow"
          >
            <p className="text-white font-semibold">
              {read.username} a lu{" "}
              <span className="font-semibold text-white">
                {read.storytitle}
              </span>
            </p>
            <div>
              <p className="text-gray-400 text-sm">{new Date(read.readDate).toISOString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentRead;

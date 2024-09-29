import React from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

const UserTable = ({ onOpenedit, userData, userId, onDeleteUser }) => {
  
  const handleEdit = (user_id) => {
    onOpenedit(true);
    userId(`${user_id}`);
  };

  const handleDelete = (user_id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      onDeleteUser(user_id);
    }
  };

  return (
    <div className="px-28">
      <table className="w-full bg-white border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="border py-2">Name</th>
            <th className="border py-2">Email</th>
            <th className="border py-2">Age</th>
            <th className="border py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData && userData.length > 0 ? (
            userData.map((user) => (
              <tr key={user.id}>
                <td className="border py-2">{user.name}</td>
                <td className="border py-2">{user.email}</td>
                <td className="border py-2">{user.age}</td>
                <td className="border py-2">
                  <div className="flex justify-around">
                    <button 
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-100 w-auto p-1 flex text-blue-700 rounded hover:bg-blue-300"
                      aria-label={`Edit ${user.name}`}
                    >
                      <GrEdit className="mt-2 h-3 mx-1" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-700 bg-red-200 w-auto p-1 flex rounded hover:bg-red-300"
                      aria-label={`Delete ${user.name}`}
                    >
                      <RiDeleteBin6Line className="mt-2 h-3 mx-1" />
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border py-2">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

import React, { useState, useEffect } from 'react';
import CrudForm from './components/Create';
import Edit from './components/Edit';
import UserTable from './components/AllData';
import { getDocs, getFirestore, collection, doc, getDoc, deleteDoc } from 'firebase/firestore';


const App = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userId, setUserID] = useState(null);
  const [userData, setUserData] = useState([]);
  const [singleUser, setSingleUser] = useState(null);

  const db = getFirestore();
  const collectionRef = collection(db, 'user');

  const fetchSingleUser = async () => {
    if (!userId) return; // Exit if no userId is set
    try {
      const userDocRef = doc(db, 'user', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setSingleUser({ id: userDoc.id, ...userDoc.data() });
      } else {
        console.log("No such document!");
        setSingleUser(null); // Clear singleUser if no document is found
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  // Fetch all users
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserData(users);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    
    fetchUserData();
  }, [collectionRef]); 

  // Fetch single user 
  useEffect(() => {
    fetchSingleUser();
  }, [userId]);

  const handleDeleteUser = async (userId) => {
    try {
      const userDocRef = doc(db, 'user', userId);
      await deleteDoc(userDocRef); // Assuming deleteDoc is imported from firebase/firestore
      // Optionally refresh the user data here
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };
  return (
    <div>
      <div className="flex justify-around py-4 my-16 bg-slate-500 mx-28 rounded">
        <div className="text-4xl p-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          CRUD
        </div>
        <button onClick={() => setShowAdd(true)} className="text-2xl font-semibold p-3 bg-blue-600 text-white rounded">
          Add User
        </button>
      </div>
      {userData.length > 0 ? (
        <UserTable userId={setUserID} onOpenedit={setShowEdit} userData={userData} onDeleteUser={handleDeleteUser}/>
      ) : (
        <div className="text-center text-gray-500">No users found. Please add a user.</div>
      )}
      {showAdd && <CrudForm onClose={setShowAdd} />}
      {showEdit && <Edit onClose={setShowEdit} user={singleUser} />}
    </div>
  );
};

export default App;

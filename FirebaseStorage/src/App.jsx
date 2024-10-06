import React, { useState, useRef, useEffect } from 'react';
import { firebaseApp } from './firebase.connect.js';
import { getFirestore, addDoc, getDocs, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const App = () => {
  const db = getFirestore(firebaseApp);
  const userCollection = collection(db, 'user');
  const storage = getStorage(firebaseApp);

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [file, setFile] = useState(null); 
  const [users, setUsers] = useState([]); // State to hold retrieved users
  const [selectedUser, setSelectedUser] = useState(null); // State for the user to be updated
  const fileInputRef = useRef(null); // Use ref for file input

  // Fetch all users from Firestore on component mount

  const fetchUsers = async () => {
    try {
      const userSnapshot = await getDocs(userCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  useEffect(() => {
    

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Save the selected file to state
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // File upload to Firebase Storage
      const fileRef = storageRef(storage, `images/${formData.name}`);
      await uploadBytes(fileRef, file);

      // Get the file's URL after upload
      const imgURL = await getDownloadURL(fileRef);

      // If updating an existing user
      if (selectedUser) {
        await updateDoc(doc(db, 'user', selectedUser.id), { ...formData, imgURL });
      } else {
        // Add document to Firestore with formData and imgURL
        await addDoc(userCollection, { ...formData, imgURL });
      }
      
      // Reset form data and file state
      setFormData({ name: '', email: '' });
      setFile(null);
      setSelectedUser(null); // Reset selected user

      // Clear file input field by resetting the ref
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      // Fetch updated users list after adding/updating a user
      fetchUsers();
    } catch (error) {
      console.error('Error adding/updating document: ', error);
    }
  };

  // Delete a user
  const handleDelete = async (userId, imgURL) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'user', userId));

      // If you want to delete the associated file from storage
      const fileRef = storageRef(storage, imgURL); // Use the URL path to reference the file
      await deleteObject(fileRef);
      
      // Fetch updated users list after deletion
      fetchUsers();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  // Update a user
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setSelectedUser(user); // Set the selected user for updating
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <br />
        <div>
          <label>File: </label>
          <input
            type="file"
            name="file"
            ref={fileInputRef} // Attach the ref to the file input
            onChange={handleFileChange} 
            required={!selectedUser} // Make file required only when adding a new user
          />
        </div>
        <br />
        <div>
          <button type="submit">{selectedUser ? 'Update' : 'Add'}</button>
        </div>
      </form>

      {/* Display all users */}
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>Name:</strong> {user.name}, <strong>Email:</strong> {user.email}<br/>
             <img src={user.imgURL} alt={user.name} height={100} /><br />
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.id, user.imgURL)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

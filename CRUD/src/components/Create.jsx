import { useState,useRef } from "react";
import {firebaseApp} from '../firebase.connect.js'
import {getFirestore,addDoc,collection} from 'firebase/firestore'

const CrudForm = ({onClose}) => {

  const db=getFirestore(firebaseApp)
  const userCollection=collection(db,'user')


  const [formData, setFormData] = useState({ name: "", email: "", age: "" });

  const modalRef=useRef();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await addDoc(userCollection, formData);

      setFormData({ name: "", email: "", age: "" });
      onClose(false); 
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  //close form after clicking outside the form
  const closeModel=(e)=>{
    if(modalRef.current===e.target){
        onClose(false)
    }
  }

  return (
    <div ref={modalRef} onClick={closeModel} className="container mx-auto p-4 fixed z-30 inset-0 h-screen flex justify-center items-center  bg-black bg-opacity-40">
      <div className="bg-white p-8 rounded shadow-md w-1/2">
      <p className="text-end "><button onClick={()=>onClose(false)} className="p-2 rounded hover:bg-gray-100" >&#10060;</button></p>
      
      <form
        onSubmit={handleSubmit}
        className="bg-white  "
      >
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="flex justify-between">
        <button
          type="submit"
          className="px-4 py-2 w-20 text-gray-700 border rounded-lg duration-100 hover:text-indigo-600 hover:border-indigo-600 active:shadow-lg"
        >
          Add
        </button>
        <button
        onClick={()=>onClose(false)}
          type="button"
          className="px-4 py-2 w-20 text-gray-700 border rounded-lg duration-100 hover:text-red-600 hover:border-red-600 active:shadow-lg"
        >
          Cancel
        </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CrudForm;

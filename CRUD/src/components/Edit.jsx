import { useState, useRef, useEffect } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const Edit = ({ onClose, user }) => {
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });
  const modalRef = useRef();

  // Set form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, age: user.age });
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();
    const userDocRef = doc(db, "user", user.id); // Use user.id to find the document

    try {
      await updateDoc(userDocRef, formData); // Update user data in Firestore
      console.log("User updated successfully!");
    } catch (error) {
      console.error("Error updating user data: ", error);
    } finally {
      setFormData({ name: "", email: "", age: "" }); // Reset form data
      onClose(false); // Close the modal
    }
  };

  // Close modal after clicking outside the form
  const closeModel = (e) => {
    if (modalRef.current === e.target) {
      onClose(false);
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={closeModel}
      className="container mx-auto p-4 fixed z-30 inset-0 h-screen flex justify-center items-center bg-black bg-opacity-40"
    >
      <div className="bg-white p-8 rounded shadow-md w-1/2">
        <p className="text-end">
          <button onClick={() => onClose(false)} className="p-2 rounded hover:bg-gray-100">
            &#10060;
          </button>
        </p>

        <form onSubmit={handleSubmit} className="bg-white">
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
              Update
            </button>
            <button
              onClick={() => onClose(false)}
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

export default Edit;

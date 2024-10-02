import React, { useState } from 'react';
import { firebaseApp, storage } from './firebase.connect.js';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

const App = () => {
  const [file, setFile] = useState(null);
  const storageRef = ref(storage, `${file?.name}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      console.log('Submitted file:', file.name);
      
      // Upload the file and metadata
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          console.log(error.message)
        }, 
        () => {
          // Handle successful uploads on complete
          
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );
    } else {
      console.log('No file selected');
    }
  };

  const handleDownload=()=>{
    getDownloadURL(storageRef)
    .then((url) => {
      // Insert url into an <img> tag to "download"
    })
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          break;
      }
    });
  }

  return (
  <>
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <button type="submit">
        Submit
      </button>
    </form>
    <button onClick={handleDownload}>
      download
    </button>
  </>
  );
};

export default App;

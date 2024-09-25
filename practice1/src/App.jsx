import React from 'react'
import { getDatabase,ref,set } from "firebase/database";
import app from "./firebase/firebase.connect.js"

const database=getDatabase(app);

const App = () => {

  const putData=()=>{
    set(ref(database,'user/saurav'),{
      id:1,
      name:'Saurav',
      age:20
    })
  }
   

  return (
    <div>
      <h1>Firebase react app Getting started</h1>
      <button onClick={putData}>Send Data</button>
    </div>
  )
}

export default App
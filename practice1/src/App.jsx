import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Signup from './components/Register'
import Login from './components/Login'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
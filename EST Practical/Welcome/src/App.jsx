import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Welcome({ name }) {
  return <h1>Welcome, {name || 'Guest'}!</h1>
}

function App() {

  return (
    <>
      <Welcome name="Chandan" />
      <Welcome />
      
      
    </>
  )
}

export default App


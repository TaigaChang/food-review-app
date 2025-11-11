import { useState } from 'react'
import './App.css'
import AuthPage from './AuthPage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Umami</h1>
      <AuthPage />
    </>
  )
}

export default App

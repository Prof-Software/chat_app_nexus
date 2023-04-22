import React, { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
const App = () => {
  const [theme, setTheme] = useState('')
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  const switchtheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }
  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
      <ThemeProvider theme={darkTheme}>

        <Routes>
          <Route path='login' element={<Login />} />
          <Route path='/*' element={<Home themeset={setTheme} />} />
        </Routes>
      </ThemeProvider>
    </GoogleOAuthProvider>

  )
}

export default App
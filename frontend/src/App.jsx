import React from 'react'
import Navbar from './components/navbar/Navbar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home/Home'
import Signup from './pages/signup/Signup'
import Login from './pages/login/Login'
import Settings from './pages/settings/Settings'
import Profile from './pages/profile/Profile'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
import { CreateGroupModal } from './components/groups/CreateGroupModal'
import JoinGroup from './pages/joinGroup/JoinGroup'

function App() {
  const { authUser, checkAuth, checkingAuth } = useAuthStore();
  const {theme} = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if (checkingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
  )
  return (
    <div   data-theme={theme}>
      <Navbar />
          {/* <h1 className='mt-20'>current : {theme}</h1> */}

      {/* <div className='mt-16'> */}
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Login />} />
          <Route path='/signup' element={!authUser ? <Signup /> : <Home />} />
          <Route path='/login' element={!authUser ? <Login /> : <Home />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={authUser ? <Profile /> : <Login />} />
          <Route path="/join-group/:token" element={<JoinGroup />} />
        </Routes>
      {/* </div> */}
      <CreateGroupModal />
      <Toaster />
    </div>

  )
}

export default App
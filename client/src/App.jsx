// import React, { useEffect } from 'react'
// import { Route, Routes } from 'react-router-dom'
// import Login from './pages/Login'
// import Feed from './pages/Feed'
// import Messages from './pages/Messages'
// import Connections from './pages/Connections'
// import ChatBox from './pages/ChatBox'
// import Profile from './pages/Profile'
// import Discover from './pages/Discover'
// import CreatePost from './pages/CreatePost'
// import {useUser, useAuth} from "@clerk/clerk-react"
// import Layout from './pages/Layout'
// import {Toaster} from 'react-hot-toast'
// import { useDispatch } from 'react-redux'
// import { fetchUser } from './features/user/userSlice'
  
// const App = () => {

//   const {user} = useUser();
//   const {getToken} = useAuth();

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchData = async () => {
//       if (user) {
//         const token = await getToken();
//         dispatch(fetchUser(token))
//       }
//     }
//     fetchData();
//   },[user, getToken, dispatch])

//   return (
//     <>
//     <Toaster/>
//       <Routes>
//         <Route path="/" element={ !user ? <Login/> : <Layout/>}>
//           <Route index element={<Feed/>}/>
//           <Route path="messages" element={<Messages/>}/>
//           <Route path="messages/:userId" element={<ChatBox/>}/>
//           <Route path="connections" element={<Connections/>}/>
//           <Route path="discover" element={<Discover/>}/>
//           <Route path="profile" element={<Profile/>}/>
//           <Route path="profile/:userId" element={<Profile/>}/>
//           <Route path="create-post" element={<CreatePost/>}/>
//         </Route>
//       </Routes>
//     </>
//   )
// }

// export default App


import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import Connections from './pages/Connections';
import ChatBox from './pages/ChatBox';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import CreatePost from './pages/CreatePost';
import Layout from './pages/Layout';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './features/user/userSlice';
import Loading from './components/Loading';

const App = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  if (loading) {
    return (
      <>
        <Toaster />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;

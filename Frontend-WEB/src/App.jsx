import { Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import Cursor from './Cursor'
import About from './Components/About'
import Header  from "./Components/Header";
import Footer from "./Components/Footer";
import Contact from "./Components/Contact";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Services from "./Components/Services";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import CommunityForum from "./Components/CommunityForum";
import WeatherPage from "./Components/WeatherPage";


function App() {
  const location = useLocation();
  const showChatbot = !['/signin', '/signup'].includes(location.pathname);

  return (
    <>
    <Cursor/>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forum" element={<CommunityForum />} />
        <Route path="/weather" element={<WeatherPage />} />

      </Routes>
      <Footer/>
    </>
  )
}

export default App
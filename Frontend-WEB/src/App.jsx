import { Routes, Route } from "react-router-dom";
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

function App() {

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
      </Routes>
      <Footer/>
    </>
  )
}

export default App

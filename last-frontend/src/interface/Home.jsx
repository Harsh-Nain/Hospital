import React from "react";
import Hero from "./Hero";
import Services from "./Services";
import Doctor from "./doctor";
import Nav from "./Nav";
import Footer from "./Footer";

export default function Home() {
  return (
    <div className="bg-gray-50">

     <Nav/> 
<Hero/>
<Doctor/>
<Services/>

<Footer/>
     
    
     
    </div>
  );
}
import React from "react"
import Header from '../Pages/Header';
import SideBar from '../SideBar/SideBar';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductAdd from "../Product/CardsAdmin";
import ProductView from "../Product/ProductView"
import ProductItinerary from "../Product/ProductItinerary";
import ProductInclusionExclusion from "../Product/ProductInclusionExclusion";
import User from "./User Detail/User";
import Home from "./Home";

export default function Mainfile(){
    return (
        <>
    
        <Header/>
        <div className='main d-flex'>
          <div className='sideBarwrapper'>
              <SideBar/>
          </div>
          <div className='content'>
    
          <ProductAdd/>
 
          </div>
        </div>
        </>
    );
}
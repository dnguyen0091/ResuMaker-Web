import React from 'react';
import logo from '../../assets/Resumaker.png';
import '../../index.css';
import NavBar from '../Navigation/navBar.jsx';
import './header.css';
export default function Header() {
    return (
        <div className="header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={logo} alt="ResuMaker Logo" className="logo"/>
                </div>
                
                <div className="right-content">
                    <NavBar/>
                </div>
            </div>
        </div>
    );
}
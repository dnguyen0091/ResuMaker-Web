import React, { useState } from 'react';
import ConnectUser from "../../Components/Forms/SignInUp/connectUser";
import Header from "../../Components/Header/header";
import NavPill from "../../Components/Navigation/navPill";
import "./landing.css";

export default function Landing() {
    const [showModal, setShowModal] = useState(false);
    
    const handleOpenModal = () => {
        setShowModal(true);
    };
    
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="landing-container">
            
            <Header />

            {/* Your existing landing page content*/}
            <button className="sign-in-button" onClick={handleOpenModal}>Sign In</button>
            
            {/* ConnectUser component now handles the modal */}
            <ConnectUser 
                isOpen={showModal} 
                onClose={handleCloseModal} 
            /> 
            <NavPill />
        </div>
    );
}
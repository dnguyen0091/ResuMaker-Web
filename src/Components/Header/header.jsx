import React, { useRef, useState } from 'react';
import logo from '../../assets/Resumaker.png';
import '../../index.css';
import NavBar from '../Navigation/navBar.jsx';
import './header.css';
export default function Header() {
    const [timesClicked, setTimesClicked] = useState(0);
    const easterEggAudio = useRef(new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3'));

    const handleClick = () => {
        setTimesClicked(prev => {
            const newCount = prev + 1;
            if (newCount % 5 === 0) {
                console.log('You have clicked the logo 5 times!');
                easterEggAudio.current.play();
            }
            return newCount;
        });
    };
    return (
        <div className="header">
            <div className="header-content">
                <div className="logo-container">
                    <img src={logo} alt="ResuMaker Logo" className="logo" onClick={handleClick}/>
                </div>
                
                <div className="right-content">
                    <NavBar/>
                </div>
            </div>
        </div>
    );
}
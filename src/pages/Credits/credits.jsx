import andrew from "../../assets/Devs/andrew.jpg";
import david from "../../assets/Devs/david.jpg";
import james from "../../assets/Devs/james.jpg";
import juniper from "../../assets/Devs/juniper.jpg";
import lucas from "../../assets/Devs/lucas.png";
import profile from "../../assets/Icons/profile.svg";
import "../../index.css";
import "./credits.css";
export default function Credits()
{

    const handleClick = (e) => {
        // Get the className of the clicked image
        const clickedClass = e.target.className;
        
        if (clickedClass.includes("David")) {
            console.log("David was clicked");
            // Perform David-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/david.mp3");    
        } else if (clickedClass.includes("Lucas")) {
            console.log("Lucas was clicked");
            // Perform Lucas-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/lucas.mp3");
        } else if (clickedClass.includes("Juniper")) {
            console.log("Juniper was clicked");
            // Perform Juniper-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/juniper.mp3"); 
        } else if (clickedClass.includes("James")) {
            console.log("James was clicked");
            // Perform James-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/james.mp3"); 
        } else if (clickedClass.includes("Prasaad")) {
            console.log("Prasaad was clicked");
            // Perform Prasaad-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/prasaad.mp3"); 
        } else if (clickedClass.includes("Andrew")) {
            console.log("Andrew was clicked");
            // Perform Andrew-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/andrew.mp3"); 
        } else if (clickedClass.includes("Logan")) {
            console.log("Logan was clicked");
            // Perform Logan-specific logic
            // const easterEggAudio=new Audio("../../assets/EasterEgg/logan.mp3"); 
        } else {
            console.log("Unknown developer clicked");
        }

        // Play the audio
        // easterEggAudio.current.play();
    };


    return (
        <div className="creditsContainer">
            <h1>Developers</h1>
            <div className="developer-container">
                <div className="developer-row">
                    <div className="developer">
                        <img src={david} alt="David Nguyen" onClick={handleClick} className="David" />
                        <h2>David Nguyen</h2>
                        <p>Project Manager/Front-End Developer</p>
                    </div>
                    <div className="developer">
                        <img src={lucas} alt="Lucas Santana" onClick={handleClick} className="Lucas" />
                        <h2>Lucas Santana</h2>
                        <p>AI API Developer</p>
                    </div>
                    <div className="developer">
                        <img src={juniper} alt="Juniper Desanto" onClick={handleClick} className="Juniper" />
                        <h2>Juniper Desanto</h2>
                        <p>API Developer</p>
                    </div>
                    <div className="developer">
                        <img src={james} alt="James Barnett" onClick={handleClick} className="James" />
                        <h2>James Barnett</h2>
                        <p>Database/API Developer</p>
                    </div>
                </div>
                <div className="developer-row">
                    <div className="developer">
                        <img src={profile} alt="Prasaad Joshi-Guske" onClick={handleClick} className="Prasaad" />
                        <h2>Prasaad Joshi-Guske</h2>
                        <p>Front-End Developer</p>
                    </div>
                    <div className="developer">
                        <img src={andrew} alt="Andrew Terry" onClick={handleClick} className="Andrew" />
                        <h2>Andrew Terry</h2>
                        <p>AI API Developer</p>
                    </div>
                    <div className="developer">
                        <img src={profile} alt="Logan Russell" onClick={handleClick} className="Logan" />
                        <h2>Logan Russell</h2>
                        <p>Front-End Developer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
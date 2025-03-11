import { useState } from "react";
import ConnectUser from "../../Components/Forms/SignInUp/connectUser";
import "./landing.css"; // We'll create this CSS file

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
            {/* Your existing landing page content */}
            <button className="sign-in-button" onClick={handleOpenModal}>Sign In</button>
            
            {/* Modal Overlay */}
            {showModal && (
                <div className="modal-overlay bg-blue">
                    <div className="modal-content bg-white">
                        <button className="modal-close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        <ConnectUser />
                    </div>
                </div>
            )}
        </div>
    );
}
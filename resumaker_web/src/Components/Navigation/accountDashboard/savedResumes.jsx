import './savedResumes.css';

export default function SavedResumes({ closePopup }) {
    const handleClose = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log("Close button clicked in SavedResumes");
        closePopup();
    };
    
    return(
        <>
            <div className="overlay" onClick={closePopup}></div>
            <div className="savedResumes" onClick={(e) => e.stopPropagation()}>
                <button className="close" onClick={handleClose}>X</button>
                <p id="title">Saved Resumes</p>
                
                <div className="resumeList">
                    {/* FOR TESTING */}
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                    <ResumeCard/>
                </div>
            </div>
        </>
    )
}

function ResumeCard() {
    return(
        <div className="resumeCard">
            <h2>Resume Name</h2>
            <p>Created on: 01/01/2021</p>
            <button>View</button>
        </div>
    )
}


function RetrieveResumes() {
    //Retrieve resumes from database
    //Return array of resume objects
}
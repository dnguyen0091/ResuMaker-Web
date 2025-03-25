export default function PersonalInfo({ personalInfo, onChange }) {
    return (
        <div className="personalInfoContainer">
            <p className="sectionHeader">Personal Details</p>
            
            <div className="formGroup">
                <div className="inputWrapper">
                    <label htmlFor="name">Full Name</label>
                    <input 
                        id="name"
                        className="input" 
                        type="text" 
                        value={personalInfo.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="Enter Name" 
                    />
                </div>
                
                <div className="inputWrapper">
                    <label htmlFor="location">Location</label>
                    <input 
                        id="location"
                        className="input" 
                        type="text" 
                        value={personalInfo.location}
                        onChange={(e) => onChange('location', e.target.value)}
                        placeholder="Orlando, FL"
                    />
                </div>
                
                <div className="inputWrapper">
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        className="input" 
                        type="email" 
                        value={personalInfo.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        placeholder="yourname@example.com"
                    />
                </div>
                
                <div className="inputWrapper">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                        id="phone"
                        className="input" 
                        type="tel" 
                        value={personalInfo.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        placeholder="(123) 456-7890"
                    />
                </div>
                
                {/* <div className="inputWrapper">
                    <label htmlFor="linkedin">LinkedIn (Optional)</label>
                    <input 
                        id="linkedin"
                        className="input" 
                        type="text" 
                        value={personalInfo.linkedin}
                        onChange={(e) => onChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/yourname"
                    />
                </div> */}
            </div>
        </div>
    );
}
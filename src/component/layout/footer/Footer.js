import React from 'react';
import "../../styles/_footer.scss";
import playstore from "../../../images/playstore.png";
import appstore from "../../../images/Appstore.png";

function Footer() {
    return (
        <div className='footer'>
            <div className='download'>
                <span style={{fontWeight:"700", fontFamily:"Roboto"}}>DOWNLOAD OUR APP</span>
                <span style={{fontFamily:"Lucida Sans"}}>Download App for Andriod and IOS mobile phone</span>
                <img src={playstore} alt='google playstore'/>
                <img src={appstore} alt='google playstore'/>
            </div>
            <div className='details'>
                <h1>ECOMMERCE</h1>
                <span>High Quality is our first priority</span>
                <span>Copyright 2023 ©️Shivam_Saurabh</span>
            </div>
            <div className='follow'>
                <h4>Follow Us</h4>
                <a href='https://instagram.com/sshivam88881' target="_blank" rel="noreferrer">Instagram</a>
                <a href='https://www.linkedin.com/in/shivam-saurabh-36760b1aa' target="_blank" rel="noreferrer">LinkedIn</a>
                <a href='https://github.com/Shivam88881' target="_blank" rel="noreferrer">GitHub</a>
            </div>
        </div>
    )
}

export default Footer

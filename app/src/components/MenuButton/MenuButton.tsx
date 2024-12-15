import React from 'react';
import './MenuButton.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import bg from "../../assets/buttonmenu.svg";

interface MenuButtonProps {
    text: string;
    icon: string; // Change the type of icon to string
    link?: string; // Optional link prop
    onClick?: () => void; // Optional onClick prop
    className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ text, icon, link, onClick, className }) => {
    const isMobile = window.innerWidth <= 768;
    const menuButtonStyle: React.CSSProperties = {
        background: 'rgba(255,255, 255, 0.3)',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: "black",
        border: '3px solid rgba(79, 40, 233, 0.3)',
        boxShadow: '-29px 6px 45px rgba(255, 249, 249, 0.25), ' +
            '0 0 15px rgba(41, 141, 255, 0.5)',

        borderRadius: 16,
        fontSize: isMobile ? "13px" : "22px",
        width: "170px",
        height: "100px",
        // boxSizing: 'border-box',
    };

    return link ? (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <button className={`menu-button ${className}`} style={menuButtonStyle}>
                <img
                    src={icon}
                    alt="icon"
                    className="menu-button-icon mb-2"
                    style={{ width: '50px', height: '50px' }} // Adjust the size here
                />
                <br />
                <span className="menu-button-text">{text}</span>
            </button>
        </Link>
    ) : (
        <button className={`menu-button ${className}`} style={menuButtonStyle} onClick={onClick}>
            <img
                src={icon}
                alt="icon"
                className="menu-button-icon mb-2"
                style={{ width: '50px', height: '50px' }} // Adjust the size here
            />
            <br />
            <span className="menu-button-text">{text}</span>
        </button>
    );

};

export default MenuButton;

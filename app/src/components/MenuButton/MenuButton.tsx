import React from 'react';
import './MenuButton.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Link } from "react-router-dom";
import bg from "../../assets/buttonmenu.svg";


interface MenuButtonProps {
    text: string;
    icon: IconDefinition;
   // color: string;
    link?: string; // Optional link prop
    onClick?: () => void; // Optional onClick prop
    className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ text, icon, link, onClick, className }) => {
    const isMobile = window.innerWidth <= 768;
    const menuButtonStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px)',
        backgroundImage: `url(${bg})`,
        backgroundSize: 'auto',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        color: "black",
        border: '3px solid #50C5FF',
        borderRadius: 16,
        fontSize: isMobile ? "13px" : "16px",
        width: "170px",
        height: "100px",
    };

    return link ? (
        <Link to={link} style={{ textDecoration: 'none' }}>
            <button className={`menu-button ${className}`} style={menuButtonStyle}>
                <FontAwesomeIcon icon={icon} size="2x" className="mb-2"/> <br></br>
                <span className="menu-button-text">{text}</span>
            </button>
        </Link>
    ) : (
        <button className={`menu-button ${className}`} style={menuButtonStyle} onClick={onClick}>
            <FontAwesomeIcon icon={icon} size="2x" className="mb-2"/><br></br>
            <span className="menu-button-text">{text}</span>
        </button>
    );
};



export default MenuButton;
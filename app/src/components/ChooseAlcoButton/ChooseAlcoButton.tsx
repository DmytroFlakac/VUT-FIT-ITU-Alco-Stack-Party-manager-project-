import React from 'react';
import './ChooseAlcoButton.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import alcoback from "../../assets/alcobuttonpopupBack.svg"
interface AlcoButtonProps {
    text: string;
    icon: string;
    color: string;
    onClick: () => void;
    className?: string;
}

const AlcoButton: React.FC<AlcoButtonProps> = ({ text, icon, color = 'primary', onClick, className }) => {
    const AlcoButtonStyle: React.CSSProperties = {
        backgroundImage: `url(${alcoback})`,
        color: color,
        border: '3px solid #50C5FF',
        borderRadius: '16px',
    };

    return (
        <button
            className={`btn choose-alco-button`}
            style={AlcoButtonStyle}
            onClick={onClick}
        >
            <img src={icon} alt="" style={{width: '40px', height: '40px'}}/><br></br>
            <span className={`choose-alco-button-text ${className}`}>

                {text}
            </span>
        </button>
    );
};

export default AlcoButton;

﻿import React from 'react';
import './Slider.css';

// Define the type for the component props
interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    imageSrc: string; // Add a new prop for the image source
    // toggle: boolean;
    // onToggleChange: () => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange, imageSrc /* toggle, onToggleChange */ }) => {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value, 10));
    };

    return (
        <div className="slider-container">
            <div className="slider-header">
                <img src={imageSrc} alt="" className="slider-image" /> {/* Image element */}
                <span className="slider-label">{label}</span>
            </div>
            <input
                type="range"
                className="slider-range"
                min="0"
                max="10"
                value={value}
                onChange={handleSliderChange}
            />
            {/*<button className={`slider-toggle ${toggle ? 'on' : 'off'}`} onClick={onToggleChange}>*/}
            {/*    <div className="toggle-circle"></div>*/}
            {/*</button>*/}
            <span className="slider-value">{value}</span> {/* Display current value */}
        </div>
    );
};

export default Slider;

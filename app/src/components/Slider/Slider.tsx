import React from 'react';
import './Slider.css';

// Define the type for the component props
interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    imageSrc: string; // Add a new prop for the image source
}

const Slider: React.FC<SliderProps> = ({ label, value, onChange, imageSrc }) => {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value, 10));
    };

    return (
        <div className="slider-container">
            <div className="slider-header">
                <img src={imageSrc} alt="" className="slider-image" />
                <span className="slider-label">{label}</span>
            </div>
            <input
                type="range"
                className="slider-range"
                min="0"
                max="10"
                value={value}
                onChange={handleSliderChange}
                style={{
                    '--value': value,
                    '--thumb-color': value === 0 ? 'gray' : '#007bff', // Set thumb color dynamically
                } as React.CSSProperties} // Use inline styles to pass custom CSS variables
            />
            <span className="slider-value">{value}</span>
        </div>
    );
};

export default Slider;

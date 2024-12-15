import React from "react";
import "./AlcoVolumeSlider.css";

// Define the type for the component props
interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
}

const AlcoVolumeSlider: React.FC<SliderProps> = ({
                                                     label,
                                                     value,
                                                     onChange,
                                                 }) => {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value)); // Parse as a float to handle decimal values
    };

    return (
        <div className="select-slider-container" style={{ width: "100%" }}>
            <div className="select-alcohol-slider-header">
                <span className="select-alcohol-slider-label">{label}</span>
            </div>
            <input
                type="range"
                className="select-alcohol-slider-range"
                min="0"
                max="1"
                step="0.1" // Allow decimal steps
                value={value}
                onChange={handleSliderChange}
                style={{
                    "--value": value, // Normalize to a 0-1 range for gradient
                    "--thumb-color": value === 0 ? "gray" : "#007bff", // Dynamically set thumb color
                } as React.CSSProperties} // Pass custom CSS properties
            />
            <span className="select-alcohol-slider-value">
                {value.toFixed(1)} l
            </span>{" "}
            {/* Display current value with one decimal place */}
        </div>
    );
};

export default AlcoVolumeSlider;

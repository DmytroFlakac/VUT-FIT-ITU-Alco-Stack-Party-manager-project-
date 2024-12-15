import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlcoVolumeSlider from "../AlcoVolumeSlider/AlcoVolumeSlider.tsx";

interface SliderItem {
    label: string;
    value: number;

    onChange: (value: number) => void;
}

interface SliderListProps {
    sliders: SliderItem[]; // Array of sliders
}

const AlcoVolumeSliderList: React.FC<SliderListProps> = ({ sliders }) => {
    return (
        <div className="sliderlist-container d-flex flex-column align-items-center" >
            <div className="row justify-content-center "  style={{width: '100%'}}>
                {sliders.map((slider, index) => (
                    <div key={index} className="col-12 mb-3 mt-2 d-flex justify-content-center">
                        <AlcoVolumeSlider
                            label={slider.label}
                            value={slider.value}
                            onChange={slider.onChange}

                        />

                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlcoVolumeSliderList;

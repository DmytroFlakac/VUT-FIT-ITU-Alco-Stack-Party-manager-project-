import React from 'react';
import './ChooseAlcoButtonList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChooseAlcoButton from '../ChooseAlcoButton/ChooseAlcoButton';

interface ChooseAlcoButtonProps {
    text: string;
    icon: string;
    color: string;
    onClick: () => void;
}

interface ChooseAlcoButtonListProps {
    alcoButtons: ChooseAlcoButtonProps[];
}

const ChooseAlcoButtonList: React.FC<ChooseAlcoButtonListProps> = ({ alcoButtons }) => {
    return (
        <div className="alco-container d-flex flex-column align-items-center">
            <div className="alco-button-list d-flex justify-content-center">
                {alcoButtons.map((button, index) => (
                    <div key={index} className="alco-button-wrapper mb-4 mt-2">
                        <ChooseAlcoButton
                            text={button.text}
                            icon={button.icon}
                            color={button.color}
                            onClick={button.onClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChooseAlcoButtonList;

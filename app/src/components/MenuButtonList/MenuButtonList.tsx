﻿import React from 'react';
import MenuButton from '../MenuButton/MenuButton';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './MenuButtonList.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Halant from '../../assets/fonts/halant/Halant-SemiBold.ttf';

interface MenuButton {
    text: string;
    icon: IconDefinition;
    color: string;
    link?: string; // Optional link prop
    onClick?: () => void; // Optional onClick prop
}

interface MenuButtonListProps {
    menuButtons: MenuButton[];
}

const MenuButtonList: React.FC<MenuButtonListProps> = ({ menuButtons }) => {
    return (
        <div className="container">
            <style>
                {`
                @font-face {
                    font-family: 'Halant';
                    src: url(${Halant}) format('truetype');
                }

                .custom-font {
                    font-family: 'Halant', serif;
                }
                `}
            </style>
            <div className="row justify-content-center">
                {menuButtons.map((menuButton, index) => (
                    <div key={index} className="col-md-4 col-4 mb-4 mt-2">
                        <MenuButton
                            text={menuButton.text}
                            icon={menuButton.icon}
                            color={menuButton.color}
                            link={menuButton.link}
                            onClick={menuButton.onClick}
                            className="custom-font"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuButtonList;

import React from 'react';
import popBack from '../../assets/signUp_card.svg';
import './DescriptionPopUp.css';

type DescriptionPopUpProps = {
    name: string;
    description: string;
    photo?: string;
    preparationDate: string;
    date: string;
    location: string;
    liquors: boolean;
    lowAlcohol: boolean;
    midAlcohol: boolean;
    highAlcohol: boolean;
    rankLimit: number;
    onClose: () => void; // Function to handle closing the pop-up
};

const DescriptionPopUp: React.FC<DescriptionPopUpProps> = ({
                                                               name,
                                                               description,
                                                               photo,
                                                               preparationDate,
                                                               date,
                                                               location,
                                                               liquors,
                                                               lowAlcohol,
                                                               midAlcohol,
                                                               highAlcohol,
                                                               rankLimit,
                                                               onClose,
                                                           }) => {
    // Dynamically create categories based on boolean values
    const categories = [];
    if (liquors) categories.push('Liquors');
    if (lowAlcohol) categories.push('Low Alcohol');
    if (midAlcohol) categories.push('Mid Alcohol');
    if (highAlcohol) categories.push('High Alcohol');

    return (
        <div
            className="description-popup-container"
        >
            <div
                style={{
                    backgroundImage: `url(${popBack})`,
                    backgroundSize: 'cover',
                    border: '3px solid rgba(79, 40, 233, 0.5)',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    padding: '30px',
                    borderRadius: '10px',
                    maxWidth: '500px',
                    textAlign: 'center',

                }}
            >
                {/* Заголовок */}
                <h2 className="description-title-card">Party Description</h2>

                {/* Основной контент */}
                <h3>{name}</h3>
                <p
                    style={{
                        wordWrap: 'break-word', // Break long words
                        overflowWrap: 'break-word', // Ensure content wraps properly
                        overflow: 'hidden', // Prevent overflow
                        textOverflow: 'ellipsis', // Add ellipsis for long text
                        maxHeight: '150px', // Restrict maximum height
                        overflowY: 'auto', // Enable vertical scrolling if content exceeds max height
                    }}>{description || 'No description provided.'}</p>
                {photo && (
                    <img
                        src={photo}
                        alt="Party"
                        style={{
                            width: '100%',
                            borderRadius: '10px',
                            marginBottom: '15px',
                        }}
                    />
                )}
                <p>
                    <strong>Preparation Date:</strong> {preparationDate}
                </p>
                <p>
                    <strong>Date:</strong> {date}
                </p>
                <p>
                    <strong>Location:</strong> {location}
                </p>
                <p>
                    <strong>Categories:</strong>{' '}
                    {categories.length > 0 ? categories.join(', ') : 'None'} ({categories.length})
                </p>
                <p>
                    <strong>Rank Limit:</strong> {rankLimit}
                </p>

                {/* Кнопка Confirm */}
                <button
                    className="descrioption-confirm  "
                    onClick={onClose}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default DescriptionPopUp;

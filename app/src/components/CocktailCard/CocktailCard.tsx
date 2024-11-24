import React from 'react';
import './CocktailCard.css';

export type CocktailCardProps = {
    cocktail: {
        id: string;
        name: string;
        photo: string;
    };
    onClick: (id: string) => void;
};

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onClick }) => {
    return (
        <div className="cocktail-card" onClick={() => onClick(cocktail.id)}>
            <img
                src={cocktail.photo}
                alt={cocktail.name}
                className="cocktail-card-photo"
            />
            <span className="cocktail-card-title">{cocktail.name}</span>
            <button
                className="cocktail-card-button"
                onClick={(e) => {
                    e.stopPropagation();
                    alert(`Ingredients for ${cocktail.name}`);
                }}
            >
                Ingredients ▼
            </button>
        </div>
    );
};

export default CocktailCard;
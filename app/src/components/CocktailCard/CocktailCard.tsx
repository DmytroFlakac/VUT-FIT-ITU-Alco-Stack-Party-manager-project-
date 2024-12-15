import React from 'react';
import './CocktailCard.css';

export type CocktailCardProps = {
    cocktail: {
        idDrink: string;
        strDrink: string;
        strCategory?: string;
        strAlcoholic?: string;
        strGlass?: string;
        strInstructions?: string;
        strDrinkThumb: string;
        ingredients?: string[];
    };
    onClick: (idDrink: string) => void;
};

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onClick }) => {
    return (
        <div className="cocktail-card" onClick={() => onClick(cocktail.idDrink)}
             style={{

             }}>
            <img
                src={cocktail.strDrinkThumb}
                alt={cocktail.strDrink}
                className="cocktail-card-photo"
            />
            <span className="cocktail-card-title">{cocktail.strDrink}</span>
            <div
                className="cocktail-ingr">
                Ingredients ▼
            </div>

        </div>
    );
};

export default CocktailCard;
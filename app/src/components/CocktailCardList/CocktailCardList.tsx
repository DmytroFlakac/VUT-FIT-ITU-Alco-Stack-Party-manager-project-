import React from 'react';
import CocktailCard from '../CocktailCard/CocktailCard';

export type Cocktail = {
    id: string;
    name: string;
    photo: string;
};

export type CocktailListProps = {
    cocktails: Cocktail[];
    onClickCocktail: (id: string) => void; // Handler for clicking a cocktail
};

const CocktailList: React.FC<CocktailListProps> = ({ cocktails, onClickCocktail }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap',
            overflowY: 'auto',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', }}>
            {cocktails.map((cocktail) => (
                <CocktailCard
                    key={cocktail.id}
                    cocktail={cocktail}
                    onClick={onClickCocktail} // Pass handler to each CocktailCard
                />
            ))}
        </div>
    );
};

export default CocktailList;

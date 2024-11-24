﻿import React from 'react';
import CocktailCard from '../CocktailCard/CocktailCard';
import './CocktailPopup.css';
import cocktailback from '../../assets/signIn_card.svg';

export type Cocktail = {
    id: string;
    name: string;
    photo: string;
};

export type CocktailDetails = {
    idDrink: string;
    strDrink: string;
    strCategory: string;
    strAlcoholic: string;
    strGlass: string;
    strInstructions: string;
    strDrinkThumb: string;
    ingredients: string[]; // Массив строк для ингредиентов
};

export type CocktailPopupProps = {
    cocktails: Cocktail[]; // Список коктейлей
    details: CocktailDetails | null; // Детали выбранного коктейля
    onClickCocktail: (id: string) => void; // Обработчик кликов на коктейль
    onBackToCocktails: () => void; // Обработчик для возврата к списку коктейлей
    isOpen: boolean; // Открыт ли попап
    onClose: () => void; // Функция для закрытия попапа
};

const CocktailPopup: React.FC<CocktailPopupProps> = ({
                                                         cocktails,
                                                         details,
                                                         onClickCocktail,
                                                         onBackToCocktails,
                                                         isOpen,
                                                         onClose,
                                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="cocktail-popup-overlay">
            <div
                className="cocktail-popup"
                style={{
                    backgroundImage: `url(${cocktailback})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    padding: '20px',
                    borderRadius: '10px',
                    maxWidth: '500px',
                    textAlign: 'center',
                }}
            >
                <h3
                    className="cocktail-popup-title"
                    style={{
                        fontFamily: 'Halant, serif',
                        fontWeight: 600,
                        textAlign: 'center',
                    }}
                >
                    View Cocktails
                </h3>

                {!details ? (
                    <div className="cocktail-list-scroll">
                        {cocktails.map((cocktail) => (
                            <CocktailCard
                                key={cocktail.id}
                                cocktail={cocktail}
                                onClick={onClickCocktail}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '10px',
                            padding: '15px',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '20px',
                        }}
                    >
                        {/* Левая часть - детали коктейля */}
                        <div style={{ flex: 1, fontFamily: 'Halant, serif' }}>
                            <h4 style={{ fontWeight: 600 }}>{details.strDrink}</h4>
                            <img
                                src={details.strDrinkThumb}
                                alt={details.strDrink}
                                style={{
                                    width: '100%',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                }}
                            />
                            <p>
                                <strong>Category:</strong> {details.strCategory}
                            </p>
                            <p>
                                <strong>Type:</strong> {details.strAlcoholic}
                            </p>
                            <p>
                                <strong>Glass:</strong> {details.strGlass}
                            </p>
                            <p>
                                <strong>Instructions:</strong> {details.strInstructions}
                            </p>
                        </div>

                        {/* Правая часть - список ингредиентов */}
                        <div style={{ flex: 1, fontFamily: 'Halant, serif' }}>
                            <h4 style={{ fontWeight: 600 }}>Ingredients:</h4>
                            <ul style={{ paddingLeft: '20px' }}>
                                {details.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Кнопки "Back" и "Close" */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    {details && (
                        <button
                            className="cocktail-confirm"
                            onClick={onBackToCocktails}
                            style={{
                                fontFamily: 'Halant, serif',
                                fontSize: '16px',
                            }}
                        >
                            Back to Cocktails
                        </button>
                    )}
                    <button
                        className="cocktail-confirm"
                        onClick={onClose}
                        style={{
                            fontFamily: 'Halant, serif',
                            fontSize: '16px',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CocktailPopup;

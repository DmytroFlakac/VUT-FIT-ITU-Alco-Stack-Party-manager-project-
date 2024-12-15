import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

export type CocktailDetailsCardProps = {
    cocktail: {
        idDrink: string;
        strDrink: string;
        strCategory: string;
        strAlcoholic: string;
        strGlass: string;
        strInstructions: string;
        strDrinkThumb: string;
        ingredients: string[];
    };
};

const CocktailDetailsCard: React.FC<CocktailDetailsCardProps> = ({ cocktail }) => {
    return (
        <Card style={{ width: '10px', height: '100px', margin: '20px',
        }}>
            <Card.Img variant="top" src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            <Card.Body>
                <Card.Title>{cocktail.strDrink}</Card.Title>
                <Card.Text>
                    <strong>Category:</strong> {cocktail.strCategory} <br />
                    <strong>Type:</strong> {cocktail.strAlcoholic} <br />
                    <strong>Glass:</strong> {cocktail.strGlass} <br />
                    <strong>Instructions:</strong> {cocktail.strInstructions}
                </Card.Text>
            </Card.Body>
            <ListGroup variant="flush">
                <ListGroup.Item><strong>Ingredients:</strong></ListGroup.Item>
                {cocktail.ingredients && cocktail.ingredients.length > 0 ? (
                    cocktail.ingredients.map((ingredient, index) => (
                        <ListGroup.Item key={index}>{ingredient}</ListGroup.Item>
                    ))
                ) : (
                    <ListGroup.Item>No ingredients available</ListGroup.Item>
                )}
            </ListGroup>
        </Card>
    );
};

export default CocktailDetailsCard;

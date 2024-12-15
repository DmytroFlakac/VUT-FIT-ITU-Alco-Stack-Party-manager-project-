/**
 * ==============================================================
 * Component: AlcoholCard
 * Author: Yaroslav Hryn
 * Description: Displays an alcohol item with its ranking visually styled.
 * ==============================================================
 */
import React from 'react';
import alcorankback from "../../assets/alcorankback.svg";
import { AlcoholGet } from '../../Models/Alcohol.tsx';


export type AlcoholCardProps = {
    alcohol: AlcoholGet;
    rank: number;
};


const AlcoholCard: React.FC<AlcoholCardProps> = ({ alcohol, rank }) => {
    return (
        <div
            style={{
                width: '520px',
                height: '50px',
                backgroundImage: `url(${alcorankback})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                color: 'white',
                fontFamily: 'Halant, serif',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                textAlign: 'center',
                fontSize: '1.5rem',
            }}
        >
            {alcohol.name}
            <span
                style={{
                    position: 'absolute',
                    right: '30px',
                    fontSize: '1.5rem',
                    fontFamily: 'Halant, serif',
                }}
            >
                {rank}
            </span>
        </div>
    );
};

export default AlcoholCard;

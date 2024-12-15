/**
 * =====================================================
 * Component: AlcoholList
 * Author: Yaroslav Hryn (xhryny00)
 * =====================================================
 */

import React from 'react';
import { Container } from 'react-bootstrap';
import AlcoholCard from '../AlcoholCard/AlcoholCard';
import alcorankborder from '../../assets/alko rank border.svg';
import { AlcoholGet } from '../../Models/Alcohol.tsx';

export type AlcoholListProps = {
    alcohols: AlcoholGet[];
};

const AlcoholList: React.FC<AlcoholListProps> = ({ alcohols }) => {
    return (
        <div style={{ position: 'absolute', top: 500, left: '35%', transform: 'translateX(-50%)' }}>
            <div
                style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <img
                    src={alcorankborder}
                    alt="Alco Ranking Border"
                    style={{ width: '500px', height: 'auto' }}
                />
            </div>

            <Container
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '15px 0',
                    maxHeight: '200px',
                    width: '520px',
                    zIndex: 10,
                    overflowY: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none', // For Internet Explorer and Edge
                }}
            >
                {alcohols.map((alcohol, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px',
                            borderRadius: '10px',
                            background: 'transparent',
                            position: 'relative',
                        }}
                    >
                        <AlcoholCard alcohol={alcohol} rank={index + 1} />
                    </div>
                ))}
            </Container>
        </div>
    );
};

export default AlcoholList;

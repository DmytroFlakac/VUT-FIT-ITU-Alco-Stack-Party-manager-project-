import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/useAuth.tsx";
import {Bounce, toast} from "react-toastify";
import { GETAlcoholRatingsAPI } from "../../../Services/AlcoholService.tsx";
import StrongAlcoRatingPopUP from "../../../Pages/AlcoRatingPopUp/StrongAlcoRatingPopUp/StrongAlcoRatingPopUp.tsx";
import "./HighAlcoCard.css";
import alcoback from "../../../assets/alcocard.svg";
import Base_Liquor from '../../../assets/Base_liquor.png'

import light_rum from "../../../assets/alcophotos/light rum.svg";
import bourbon from "../../../assets/alcophotos/bourbon.svg";
import vodka from "../../../assets/alcophotos/vodka.svg";
import gin from "../../../assets/alcophotos/gin.svg";
import blended_whiskey from "../../../assets/alcophotos/blended wisk.svg";
import tequila from "../../../assets/alcophotos/tekila.svg";
import southern_comfort from "../../../assets/alcophotos/s comfort.svg";
import brandy from "../../../assets/alcophotos/brandy.svg";
import lemon_vodka from "../../../assets/alcophotos/lemon vodka.svg";
import dark_rum from "../../../assets/alcophotos/dark rum.svg";
import applejack from "../../../assets/alcophotos/applejk.svg";
import scotch from "../../../assets/alcophotos/scotch.svg";
import anejo_rum from "../../../assets/alcophotos/anh rum.svg";
import irish_whiskey from "../../../assets/alcophotos/irish wisk.svg";
import apple_brandy from "../../../assets/alcophotos/apple brandy.svg";
import cognac from "../../../assets/alcophotos/cognac.svg";

interface AlcoholPreference {
    id: string;
    label: string;
    value: number;
    imageSrc: string;
}

const HighAlcoCard: React.FC = () => {
    const { user, token } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [preferences, setPreferences] = useState<AlcoholPreference[]>([
        { id: '4cb3947a-8395-4e18-b777-9053e452035a', label: 'Light rum', value: 0, imageSrc: light_rum,  },
        { id: 'ec7f6294-79a3-4122-8d00-097748b588a2', label: 'Bourbon', value: 0, imageSrc: bourbon,  },
        { id: 'abf08396-a626-4dc1-834c-80153f66bcdb', label: 'Vodka', value: 0, imageSrc: vodka, },
        { id: 'd6f0f193-e3fd-4136-b3f2-1613f2e24f84', label: 'Gin', value: 0, imageSrc: gin, },
        { id: 'e8310620-73fb-4496-9cfb-32f554e737e3', label: 'Blended whiskey', value: 0, imageSrc: blended_whiskey,},
        { id: 'dced866c-0c83-4d72-8b2f-f944bcdb93e8', label: 'Tequila', value: 0, imageSrc: tequila, },
        { id: '689dfe25-f0e2-4b04-824f-966dd77cb85f', label: 'Southern Comfort', value: 0, imageSrc: southern_comfort,},
        { id: '8664ee76-6e53-4c4d-b7c2-7934c1ef31b8', label: 'Brandy', value: 0, imageSrc: brandy,  },
        { id: '9ff6743e-bcff-48fc-88c7-82bc33163b17', label: 'Lemon vodka', value: 0, imageSrc: lemon_vodka,},
        { id: 'bb9b2884-9380-4b6c-b324-f8865e703532', label: 'Dark rum', value: 0, imageSrc: dark_rum, },
        { id: 'bbc9c593-d7ae-4646-bc7a-0596810b932f', label: 'Applejack', value: 0, imageSrc: applejack,},
        { id: '8c3f326d-64b3-4d94-8d17-a0aea279de69', label: 'Scotch', value: 0, imageSrc: scotch,},
        { id: 'eec85749-6c16-42ee-a5bd-5a81e7630609', label: 'Añejo rum', value: 0, imageSrc: anejo_rum, },
        { id: '11d02786-4530-46ef-a68a-be6db24b290d', label: 'Irish whiskey', value: 0, imageSrc: irish_whiskey,},
        { id: '1f3f3072-94cb-4164-968e-af39f8f3f502', label: 'Apple brandy', value: 0, imageSrc: apple_brandy, },
        { id: 'eb010028-3630-4ee6-99e7-cbd5bbff8ec2', label: 'Cognac', value: 0, imageSrc: cognac, },
    ]);

    const fetchUserPreferences = async () => {
        if (!token) {

            toast.error('You must be logged in to view your preferences',{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );
            return;
        }

        try {
            const response = await GETAlcoholRatingsAPI(user?.userName, token);
            if (response && response.data) {
                const updatedPreferences = preferences.map((pref) => {
                    const matchingRating = response.data.find(
                        (rating: { alcoholId: string }) => rating.alcoholId === pref.id
                    );
                    return matchingRating ? { ...pref, value: matchingRating.rating } : pref;
                });
                setPreferences(updatedPreferences);
            }
        } catch (error) {
            console.error("Failed to fetch preferences:", error);
            toast.error('Failed to fetch preferences. Please try again.',{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );

        }
    };

    useEffect(() => {
        fetchUserPreferences();
    }, []);

    useEffect(() => {
        if (!showPopup) {
            fetchUserPreferences();
        }
    }, [showPopup]);

    const handleCardClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const cardStyle: React.CSSProperties = {
        backgroundImage: `url(${alcoback})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: "#000",
        // border: "3px solid #50C5FF",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
    };

    return (
        <>
            <div className="strongalco-card" style={cardStyle} onClick={handleCardClick}>
                <div className="strongalco-card-header">
                    <img src={Base_Liquor} alt="High Alcohol Icon" className="strongalco-card-image-top" />
                    <span className="strongalco-card-text">High Alcohol</span>
                </div>
                <div className="strongalco-card-preferences">
                    {preferences.map((pref) => (
                        <div key={pref.id} className="strongalco-preference">
                            <img
                                src={pref.imageSrc}
                                alt={pref.label}
                                className="strongalco-preference-icon"
                            />
                            <span className="strongalco-preference-label">{pref.label}</span>
                            <span className="strongalco-preference-value">{pref.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <StrongAlcoRatingPopUP show={showPopup} handleClose={handleClosePopup} />}
        </>
    );
};

export default HighAlcoCard;

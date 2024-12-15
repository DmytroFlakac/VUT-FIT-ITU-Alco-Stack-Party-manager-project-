import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/useAuth.tsx";
import {Bounce, toast} from "react-toastify";
import { GETAlcoholRatingsAPI } from "../../../Services/AlcoholService.tsx";
import LowAlcoRatingPopUp from "../../../Pages/AlcoRatingPopUp/LowAlcoRatingPopUp/LowAlcoRatingPopUp.tsx";
import "./LowAlcoCard.css";
import alcoback from "../../../assets/alcocard.svg";
import Beer from "../../../assets/beer.png";
import beer from "../../../assets/alcophotos/beer.svg";
import cider from "../../../assets/alcophotos/cider.svg";
import lb from "../../../assets/alcophotos/lager beer.svg";
import ale from "../../../assets/alcophotos/ale.svg";
import db from "../../../assets/alcophotos/dark beer.svg";

interface AlcoholPreference {
    id: string;
    label: string;
    value: number;
    imageSrc: string;
}

const LowAlcoCard: React.FC = () => {
    const { user, token } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [preferences, setPreferences] = useState<AlcoholPreference[]>([
        { id: 'a745bc6e-14d2-45f5-a0b4-9ee8b7936754', label: 'Beer', value: 0, imageSrc: beer },
        { id: '0dec2807-98c9-4d48-a698-81ca5c3fd04c', label: 'Cider', value: 0, imageSrc: cider },
        { id: 'dccfaddc-7907-42a4-85a1-ed392926beaa', label: 'Lager beer', value: 0, imageSrc: lb },
        { id: 'be695724-d48f-4131-b9df-9d2bbb028796', label: 'Ale', value: 0, imageSrc: ale },
        { id: '94544897-cd6a-45b4-9bbc-1eaf7929fac9', label: 'Dark beer', value: 0, imageSrc: db },
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
            } else {
                toast.info("No preferences available");
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

    // Refetch preferences after the popup is closed
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
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
            <div className="lowalco-card" style={cardStyle} onClick={handleCardClick}>
                <div className="lowalco-card-header">
                    <img src={Beer} alt="Low Alcohol Icon" className="lowalco-card-image-top" />
                    <span className="lowalco-card-text">Low Alcohol</span>
                </div>
                <div className="lowalco-card-preferences">
                    {preferences.map((pref) => (
                        <div key={pref.id} className="lowalco-preference">
                            <img
                                src={pref.imageSrc}
                                alt={pref.label}
                                className="lowalco-preference-icon"
                            />
                            <span className="lowalco-preference-label">{pref.label}</span>
                            <span className="lowalco-preference-value">{pref.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <LowAlcoRatingPopUp show={showPopup} handleClose={handleClosePopup} />}
        </>
    );
};

export default LowAlcoCard;

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/useAuth.tsx";
import {Bounce, toast} from "react-toastify";
import { GETAlcoholRatingsAPI } from "../../../Services/AlcoholService.tsx";
import "./LiquorCard.css";
import alcoback from "../../../assets/alcocard.svg";
import Liquor from '../../../assets/Liquor.png';
import LiquorRatingPopUp from "../../../Pages/AlcoRatingPopUp/LiquorRatingPopUP/LiquorRatingPopUP.tsx";

import apricot_brandy from "../../../assets/alcophotos/apricot brandy.svg";
import triple_sec from "../../../assets/alcophotos/tripple sec.svg";
import amaretto from "../../../assets/alcophotos/amaretto.svg";
import coffee_liquor from "../../../assets/alcophotos/coffe lik.svg";
import kahlua from "../../../assets/alcophotos/kahlua.svg";


interface AlcoholPreference {
    id: string;
    label: string;
    value: number;
    imageSrc: string;
}

const LiquorCard: React.FC = () => {
    const { user, token } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [preferences, setPreferences] = useState<AlcoholPreference[]>([
        { id: '302002bb-75cf-4f3e-bcfa-879094873128', label: 'Apricot brandy', value: 0, imageSrc: apricot_brandy },
        { id: '775ca315-06ed-46c3-8c25-8eb11c06eb43', label: 'Triple sec', value: 0, imageSrc: triple_sec },
        { id: '9bc1c58a-6065-4525-9a9b-03faeca93557', label: 'Amaretto', value: 0, imageSrc: amaretto },
        { id: '80575096-0f64-4ef4-8e1c-bb73eecb2cab', label: 'Coffee liqueur', value: 0, imageSrc: coffee_liquor },
        { id: 'c5c71908-0a99-4e14-9b46-0008919c14e5', label: 'Kahlua', value: 0, imageSrc: kahlua },
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
            <div className="liquor-card" style={cardStyle} onClick={handleCardClick}>
                <div className="liquor-card-header">
                    <img src={Liquor} alt="Liquor Icon" className="liquor-card-image-top" />
                    <span className="liquor-card-text"> Liquors </span>
                </div>
                <div className="liquor-card-preferences">
                    {preferences.map((pref) => (
                        <div key={pref.id} className="liquor-preference">
                            <img
                                src={pref.imageSrc}
                                alt={pref.label}
                                className="liquor-preference-icon"
                            />
                            <span className="liquor-preference-label">{pref.label}</span>
                            <span className="liquor-preference-value">{pref.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <LiquorRatingPopUp show={showPopup} handleClose={handleClosePopup} />}
        </>
    );
};

export default LiquorCard;

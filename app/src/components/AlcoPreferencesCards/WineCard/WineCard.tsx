import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Context/useAuth.tsx";
import {Bounce, toast} from "react-toastify";
import { GETAlcoholRatingsAPI } from "../../../Services/AlcoholService.tsx";import "./WineCard.css";
import alcoback from "../../../assets/alcocard.svg";
import Wine from '../../../assets/Wine.png';
import WineAlcoRatingPopUp from "../../../Pages/AlcoRatingPopUp/WineAlcoRatingPopUp/WineAlcoRatingPopUp.tsx";
import sweet_vermouth from "../../../assets/alcophotos/sweet verm.svg";
import martini from "../../../assets/alcophotos/dry verm.svg";
import champagne from "../../../assets/alcophotos/champ.svg";
import dubonnet from "../../../assets/alcophotos/rouge.svg";
import prosecco from "../../../assets/alcophotos/prosecco.svg";

interface AlcoholPreference {
    id: string;
    label: string;
    value: number;
    imageSrc: string;
}

const WineCard: React.FC = () => {
    const { user, token } = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [preferences, setPreferences] = useState<AlcoholPreference[]>([
        {id: "45505103-792d-44b1-a3fd-595016820885", label: 'Sweet Vermouth', value: 0 ,imageSrc: sweet_vermouth },
        {id: "6841e096-c169-4d51-96ed-382937403d80",  label: 'Dry Vermouth',value: 0,imageSrc: martini },
        {id: "3a7737b9-9b9a-49b2-a247-7bdab2cc203e", label: 'Champagne',  value: 0 , imageSrc: champagne},
        {id: "3a12ed91-e016-48a9-9c89-adf99c83e6e9",  label: 'Dubonnet Rouge', value: 0,  imageSrc: dubonnet },
        {id: "da66009b-09ae-4fc6-a9f9-471b5fb8fda7",  label: 'Prosecco', value: 0 ,  imageSrc: prosecco}
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
            <div className="wine-card" style={cardStyle} onClick={handleCardClick}>
                <div className="wine-card-header">
                    <img src={Wine} alt="Wine Icon" className="wine-card-image-top" />
                    <span className="lowalco-card-text"> Mid Alcohol</span>
                </div>
                <div className="wine-card-preferences">
                    {preferences.map((pref) => (
                        <div key={pref.id} className="wine-preference">
                            <img
                                src={pref.imageSrc}
                                alt={pref.label}
                                className="wine-preference-icon"
                            />
                            <span className="wine-preference-label">{pref.label}</span>
                            <span className="wine-preference-value">{pref.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && <WineAlcoRatingPopUp show={showPopup} handleClose={handleClosePopup} />}
        </>
    );
};

export default WineCard;

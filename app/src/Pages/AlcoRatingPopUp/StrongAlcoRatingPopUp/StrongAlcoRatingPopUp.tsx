import React, {useEffect, useState} from "react";
import './StrongAlcoRatingPopUp.css';

import SliderList from "../../../components/SliderList/SliderList";
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
import {Bounce, toast} from "react-toastify";
import {GETAlcoholRatingsAPI, UpdateAlcoholRatingsAPI} from "../../../Services/AlcoholService.tsx";
import {useAuth} from "../../../Context/useAuth.tsx";
import alcopopup from "../../../assets/alcopopup.svg";

interface HighAlcoRatingPopUpProps {
    show: boolean;
    handleClose: () => void;
}

const HighAlcoRatingPopUp: React.FC<HighAlcoRatingPopUpProps> = ({ show, handleClose }) => {
    const { user, token } = useAuth();
    const [sliders, setSliders] = useState([
        { id: '4cb3947a-8395-4e18-b777-9053e452035a', label: 'Light rum', value: 0, imageSrc: light_rum, toggle: false },
        { id: 'ec7f6294-79a3-4122-8d00-097748b588a2', label: 'Bourbon', value: 0, imageSrc: bourbon, toggle: false },
        { id: 'abf08396-a626-4dc1-834c-80153f66bcdb', label: 'Vodka', value: 0, imageSrc: vodka, toggle: false },
        { id: 'd6f0f193-e3fd-4136-b3f2-1613f2e24f84', label: 'Gin', value: 0, imageSrc: gin, toggle: false },
        { id: 'e8310620-73fb-4496-9cfb-32f554e737e3', label: 'Blended whiskey', value: 0, imageSrc: blended_whiskey, toggle: false },
        { id: 'dced866c-0c83-4d72-8b2f-f944bcdb93e8', label: 'Tequila', value: 0, imageSrc: tequila, toggle: false },
        { id: '689dfe25-f0e2-4b04-824f-966dd77cb85f', label: 'Southern Comfort', value: 0, imageSrc: southern_comfort, toggle: false },
        { id: '8664ee76-6e53-4c4d-b7c2-7934c1ef31b8', label: 'Brandy', value: 0, imageSrc: brandy, toggle: false },
        { id: '9ff6743e-bcff-48fc-88c7-82bc33163b17', label: 'Lemon vodka', value: 0, imageSrc: lemon_vodka, toggle: false },
        { id: 'bb9b2884-9380-4b6c-b324-f8865e703532', label: 'Dark rum', value: 0, imageSrc: dark_rum, toggle: false },
        { id: 'bbc9c593-d7ae-4646-bc7a-0596810b932f', label: 'Applejack', value: 0, imageSrc: applejack, toggle: false },
        { id: '8c3f326d-64b3-4d94-8d17-a0aea279de69', label: 'Scotch', value: 0, imageSrc: scotch, toggle: false },
        { id: 'eec85749-6c16-42ee-a5bd-5a81e7630609', label: 'Añejo rum', value: 0, imageSrc: anejo_rum, toggle: false },
        { id: '11d02786-4530-46ef-a68a-be6db24b290d', label: 'Irish whiskey', value: 0, imageSrc: irish_whiskey, toggle: false },
        { id: '1f3f3072-94cb-4164-968e-af39f8f3f502', label: 'Apple brandy', value: 0, imageSrc: apple_brandy, toggle: false },
        { id: 'eb010028-3630-4ee6-99e7-cbd5bbff8ec2', label: 'Cognac', value: 0, imageSrc: cognac, toggle: false },
    ]);


    const fetchUserRatings = async () => {
        if (!token) {
            toast.error('You must be logged in to view your ratings.',{
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
                const updatedSliders = sliders.map(slider => {
                    const ratingData = response.data.find(alcohol => alcohol.alcoholId === slider.id);
                    return ratingData ? { ...slider, value: ratingData.rating } : slider;
                });

                setSliders(updatedSliders);
            } else {
                setSliders(sliders.map(slider => ({ ...slider, value: 0 }))); // Reset to default if no data
            }
        } catch (error) {
            console.error('Failed to fetch ratings', error);
            toast.error('Failed to fetch ratings. Please try again.',{
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
            setSliders(sliders.map(slider => ({ ...slider, value: 0 }))); // Reset to default in case of error
        }
    };

    useEffect(() => {
        fetchUserRatings(); // Fetch ratings when component mounts
    }, []);
    const [isSaving, setIsSaving] = useState(false);


    const handleSliderChange = (index: number, value: number) => {
        const newSliders = [...sliders];
        newSliders[index] = { ...newSliders[index], value };
        setSliders(newSliders);
    };


    const saveRatings = async () => {
        if (!user || !token) {

            console.error("userName or authToken are not defined");
            return;
        }

        setIsSaving(true);
        const type = 3;
        const ratings = sliders.map(slider => ({
            AlcoholId: slider.id,
            rating: slider.value
        }));

        try {
            const result = await UpdateAlcoholRatingsAPI(user.userName, type, ratings, token);
            console.log("Updated ratings:", result);

            handleClose();
        } catch (error) {
            console.error("Failed to update ratings", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!show) return null;

    const sliderItems = sliders.map((slider, index) => ({
        ...slider,
        onChange: (value: number) => handleSliderChange(index, value)
    }));

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };
    return (
        <>
            <div className="strongalco-modal-backdrop-blur" onClick={handleBackdropClick}/>
            <div className="strongalco-modal-container">
                <div className="strongalco-modal-content" style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    backgroundImage: `url(${alcopopup})`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    border: '3px solid rgba(79, 40, 233, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '16px',
                    overflowY: 'auto', /* Enable vertical scrolling */
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none', // For Internet Explorer and Edge
                }}
                >
                    <div className="strong-alco-title">Choose Strong Alcohols</div>
                    <div className="strongalco-slider-list-container">
                        <SliderList sliders={sliderItems}/>
                    </div>
                    <button
                        className="liquor-btn-save"
                        onClick={saveRatings}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </>
    );
}

export default HighAlcoRatingPopUp;

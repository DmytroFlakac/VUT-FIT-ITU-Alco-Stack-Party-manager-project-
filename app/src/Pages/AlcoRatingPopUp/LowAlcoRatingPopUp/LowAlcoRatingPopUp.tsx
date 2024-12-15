import React, {useEffect, useState} from "react";
import './LowAlcoRatingPopUp.css';

import SliderList from "../../../components/SliderList/SliderList";
import {useAuth} from "../../../Context/useAuth.tsx";
import {Bounce, toast} from "react-toastify";
import {GETAlcoholRatingsAPI, UpdateAlcoholRatingsAPI} from "../../../Services/AlcoholService.tsx";
import beer from "../../../assets/alcophotos/beer.svg";
import cider from "../../../assets/alcophotos/cider.svg";
import ale from "../../../assets/alcophotos/ale.svg";
import lb from "../../../assets/alcophotos/lager beer.svg";
import db from "../../../assets/alcophotos/dark beer.svg";
import alcopopup from "../../../assets/alcopopup.svg";

interface LowAlcoRatingPopUpProps {
    show: boolean;
    handleClose: () => void;
}

const LowAlcoRatingPopUp: React.FC<LowAlcoRatingPopUpProps> = ({ show, handleClose }) => {
    const { user, token } = useAuth();
    const [sliders, setSliders] = useState([
        { id: 'a745bc6e-14d2-45f5-a0b4-9ee8b7936754', label: 'Beer', value: 0, imageSrc: beer },
        { id: '0dec2807-98c9-4d48-a698-81ca5c3fd04c', label: 'Cider', value: 0, imageSrc: cider },
        { id: 'dccfaddc-7907-42a4-85a1-ed392926beaa', label: 'Lager beer', value: 0, imageSrc: lb },
        { id: 'be695724-d48f-4131-b9df-9d2bbb028796', label: 'Ale', value: 0, imageSrc: ale},
        { id: '94544897-cd6a-45b4-9bbc-1eaf7929fac9', label: 'Dark beer', value: 0, imageSrc: db},
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
    const [isSaving, setIsSaving] = useState(false); // Додано стан для індикації збереження

    // Обробник зміни значення слайдера
    const handleSliderChange = (index: number, value: number) => {
        const newSliders = [...sliders];
        newSliders[index] = { ...newSliders[index], value };
        setSliders(newSliders);
    };

    // Функція для збереження значень слайдерів
    const saveRatings = async () => {
        if (!user || !token) {

            console.error("userName or authToken are not defined");
            return;
        }

        setIsSaving(true);
        const type = 1;
        const ratings = sliders.map(slider => ({
            AlcoholId: slider.id,
            rating: slider.value
        }));

        try {
            const result = await UpdateAlcoholRatingsAPI(user.userName, type, ratings, token);
            console.log("Updated beer ratings:", result);

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
            <div className="lowalco-modal-backdrop-blur" onClick={handleBackdropClick}/>
            <div className="lowalco-modal-container">
                <div className="lowalco-modal-content" style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    backgroundImage: `url(${alcopopup})`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    border: '3px solid rgba(79, 40, 233, 0.5)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <div className="low-alco-title">Choose Low Alcohols</div>
                    <SliderList sliders={sliderItems}/>
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

export default LowAlcoRatingPopUp;

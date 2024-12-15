import React, { useState, useEffect } from "react";
import './WineAlcoRatingPopUp.css';
import SliderList from "../../../components/SliderList/SliderList";
import martini from "../../../assets/alcophotos/dry verm.svg";
import sweet_vermouth from "../../../assets/alcophotos/sweet verm.svg";
import champagne from "../../../assets/alcophotos/champ.svg";
import dubonnet from "../../../assets/alcophotos/rouge.svg";
import prosecco from "../../../assets/alcophotos/prosecco.svg";
import { UpdateAlcoholRatingsAPI, GETAlcoholRatingsAPI } from "../../../Services/AlcoholService.tsx";
import {useAuth} from "../../../Context/useAuth.tsx";

import {Bounce, toast} from "react-toastify";
import alcopopup from "../../../assets/alcopopup.svg";
interface WineRatingPopUpProps {
    show: boolean;
    handleClose: () => void;
}

const WineRatingPopUp: React.FC<WineRatingPopUpProps> = ({ show, handleClose }) => {
    const { user, token } = useAuth();
    const [sliders, setSliders] = useState([
        {id: "45505103-792d-44b1-a3fd-595016820885", label: 'Sweet Vermouth', value: 0 ,imageSrc: sweet_vermouth },
        {id: "6841e096-c169-4d51-96ed-382937403d80",  label: 'Dry Vermouth',value: 0,imageSrc: martini },
        {id: "3a7737b9-9b9a-49b2-a247-7bdab2cc203e", label: 'Champagne',  value: 0 , imageSrc: champagne},
        {id: "3a12ed91-e016-48a9-9c89-adf99c83e6e9",  label: 'Dubonnet Rouge', value: 0,  imageSrc: dubonnet },
        {id: "da66009b-09ae-4fc6-a9f9-471b5fb8fda7",  label: 'Prosecco', value: 0 ,  imageSrc: prosecco}
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
    // Обробник зміни значення слайдера
    const saveRatings = async () => {
        if (!user || !token) {

            console.error("userName або authToken are not defined");
            return;
        }

        setIsSaving(true); // Починаємо процес збереження
        const type = 2; // Приклад типу алкоголю
        const ratings = sliders.map(slider => ({
            AlcoholId: slider.id,
            rating: slider.value
        }));

        try {
            const result = await UpdateAlcoholRatingsAPI(user.userName, type, ratings, token);
            console.log("Updated wine ratings:", result);
            handleClose();
        } catch (error) {
            console.error("Failed to update ratings", error);
        } finally {
            setIsSaving(false);
        }
    };
    const handleSliderChange = (index: number, value: number) => {
        const newSliders = [...sliders];
        newSliders[index] = { ...newSliders[index], value };
        setSliders(newSliders);
    };

    if (!show) return null;

    const sliderItems = sliders.map((slider, index) => ({
        ...slider,
        onChange: (value: number) => handleSliderChange(index, value)
    }));

    // Обробник для кліку по фону
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <>
            <div className="midalco-modal-backdrop-blur" onClick={handleBackdropClick}> {/* Фон, що закриває вікно */}
                <div className="midalco-modal-container">
                    <div className="midalco-modal-content" style={{
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
                        borderRadius: '16px'
                    }}>
                        <div className="mid-alco-title">Choose Wines</div>
                        <SliderList sliders={sliderItems}/>


                        <button className="midalco-btn-save" onClick={saveRatings}
                                disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WineRatingPopUp;

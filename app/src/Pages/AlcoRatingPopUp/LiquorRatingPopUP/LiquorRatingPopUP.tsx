import React, { useState, useEffect } from "react";
import './LiquorRatingPopUp.css';
import SliderList from "../../../components/SliderList/SliderList";
import apricot_brandy from "../../../assets/alcophotos/apricot brandy.svg";
import triple_sec from "../../../assets/alcophotos/tripple sec.svg";
import amaretto from  "../../../assets/alcophotos/amaretto.svg";
import coffee_liquor from "../../../assets/alcophotos/coffe lik.svg";
import kahlua from "../../../assets/alcophotos/kahlua.svg";
import { UpdateAlcoholRatingsAPI, GETAlcoholRatingsAPI } from "../../../Services/AlcoholService.tsx";
import {useAuth} from "../../../Context/useAuth.tsx";

import {Bounce, toast} from "react-toastify";
import alcopopup from "../../../assets/alcopopup.svg";

interface LiquorRatingPopUpProps {
    show: boolean;
    handleClose: () => void;

}

const LiquorRatingPopUp: React.FC<LiquorRatingPopUpProps> = ({ show, handleClose}) => {
    const { user, token } = useAuth();

    const [sliders, setSliders] = useState([
        { id: '302002bb-75cf-4f3e-bcfa-879094873128', label: 'Apricot brandy', value: 0, imageSrc: apricot_brandy, toggle: false },
        { id: '775ca315-06ed-46c3-8c25-8eb11c06eb43', label: 'Triple sec', value: 0, imageSrc: triple_sec, toggle: false },
        { id: '9bc1c58a-6065-4525-9a9b-03faeca93557', label: 'Amaretto', value: 0, imageSrc: amaretto, toggle: false },
        { id: '80575096-0f64-4ef4-8e1c-bb73eecb2cab', label: 'Coffee liqueur', value: 0, imageSrc: coffee_liquor, toggle: false },
        { id: 'c5c71908-0a99-4e14-9b46-0008919c14e5', label: 'Kahlua', value: 0, imageSrc: kahlua, toggle: false },
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
        const type = 0;
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
            <div className="liquor-modal-backdrop-blur"  onClick={handleBackdropClick}/>
            <div className="liquor-modal-container">
                <div className="liquor-modal-content" style={{background: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(20px)',
                    backgroundImage: `url(${alcopopup})`,
                    backgroundSize: 'auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    border: '3px solid rgba(79, 40, 233, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                borderRadius: '16px'}}>
                    <div className="liquor-title">Choose Liquors</div>
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

export default LiquorRatingPopUp;

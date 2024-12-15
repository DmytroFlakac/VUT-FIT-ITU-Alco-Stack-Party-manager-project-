import './ProfilePage.css';
import { GETAlcoholRatingsAPI } from "../../Services/AlcoholService.tsx";
import ProfileCard from "../../components/ProfileCard/ProfileCard.tsx";
import LowAlcoCard from "../../components/AlcoPreferencesCards/LowAlcoCard/LowAlcoCard.tsx";
import WineCard from "../../components/AlcoPreferencesCards/WineCard/WineCard.tsx";
import HighAlcoCard from "../../components/AlcoPreferencesCards/HighAlcoCard/HighAlcoCard.tsx";
import LiquorCard from "../../components/AlcoPreferencesCards/LiquorCard/LiquorCard.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from "react-router-dom";
import Disco from '../../assets/disco.svg';
import { useAuth } from "../../Context/useAuth.tsx";
import {SliderAlcoholPatch} from "../../Models/Alcohol.tsx";
import React, { useState, useEffect } from "react";
import homeIcon from '../../assets/Home.svg';
import LowAlcoRatingPopUp from '../../Pages/AlcoRatingPopUp/LowAlcoRatingPopUp/LowAlcoRatingPopUp';
import WineAlcoRatingPopUp from '../AlcoRatingPopUp/WineAlcoRatingPopUp/WineAlcoRatingPopUp';
import LiquorRatingPopUP from '../AlcoRatingPopUp/LiquorRatingPopUP/LiquorRatingPopUP';
import StrongAlcoRatingPopUp from '../AlcoRatingPopUp/StrongAlcoRatingPopUp/StrongAlcoRatingPopUp';

import './ProfilePage.css';
import backgroundImage from "../../assets/backgroundFinal.svg";



const ProfilePage: React.FC = () => {
    const { user, token} = useAuth();
    const [preferences, setPreferences] = useState<SliderAlcoholPatch[]>([]);
  //  const [showModal, setShowModal] = useState(false);
    const [showLowAlcoModal, setShowLowAlcoModal] = useState(false);
    const [showWineModal, setShowWineModal] = useState(false);
    const [showLiquorModal, setShowLiquorModal] = useState(false);
    const [showStrongAlcoModal, setShowStrongAlcoModal] = useState(false);

    const fetchPreferences = async () => {
        if (!token) return;
        try {
            const response = await GETAlcoholRatingsAPI(user?.userName, token);
            if (response && response.data) {
                setPreferences(response.data);

            }
        } catch (error) {
            console.error("Failed to fetch preferences:", error);
        }
    };
    useEffect(() => {
        fetchPreferences();
    }, []);

    // Refetch preferences whenever a modal is closed
    useEffect(() => {
        if (!showLowAlcoModal && !showWineModal && !showLiquorModal && !showStrongAlcoModal) {
            fetchPreferences();
        }
    }, [showLowAlcoModal, showWineModal, showLiquorModal, showStrongAlcoModal]);
    useEffect(() => {
        console.log("Updated Preferences:", preferences);
    }, [preferences]);
    // const handleLowAlcoButtonClick = () => {
    //     setShowLowAlcoModal(true);
    // };
    //
    //
    // const handleWineButtonClick = () => {
    //     setShowWineModal(true);
    // };
    //
    // const handleLiquorButtonClick = () => {
    //     setShowLiquorModal(true);
    // };
    // const handleStrongAlcoButtonClick = () => {
    //     setShowStrongAlcoModal(true);
    // };


    const handleCloseModal = () => {
        setShowLowAlcoModal(false);
        setShowWineModal(false);
        setShowLiquorModal(false);
        setShowStrongAlcoModal(false);
    };



    // const alcoButtons = [
    //     { text: 'Low Alcohol', icon: Beer, color: '#D9D9D9', onClick: handleLowAlcoButtonClick },
    //     { text: 'Mid Alcohol', icon: Wine, color: '#D9D9D9', onClick: handleWineButtonClick },
    //     { text: 'Liquor', icon: Liquor, color: '#D9D9D9', onClick: handleLiquorButtonClick },
    //     { text: 'High Alcohol', icon: Base_Liquor, color: '#D9D9D9', onClick: handleStrongAlcoButtonClick }
    // ];

    return (
        <div className="container-fluid-profile d-flex p-0 full-height-profile"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
                 backgroundAttachment: 'fixed',
             }}>

            <div className="video-left flex-grow-1"></div>


            <div className="container-fluid-profile p-0 d-flex flex-column align-items-center custom-background square-container-profile flex-grow-7">

                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        <img
                            src={Disco}
                            alt="Party Icon"
                            className="party-icon-profile"
                        />
                    </div>
                    <Link
                        to="/home"
                        className="home-link-profile"
                        aria-label="Go to Homepage"
                        style={{
                            position: 'absolute',
                            top: '-25px',
                            right: '10px',
                        }}
                    >
                        <img
                            src={homeIcon}
                            alt="Home Icon"
                            style={{
                                width: '120px',
                                height: '120px',
                            }}
                        />
                    </Link>
                </div>
                <div className="centered-container-profile" style={{
                    position: 'relative',
                    // top: '-15px',
                    left: '-70px'
                }}>
                    <ProfileCard
                        UserName={user?.userName || ""}
                        name={user?.firstName || ""}
                        Surname={user?.lastName || ""}
                        Phone={user?.phoneNumber || ""}
                        Email={user?.email || ""}
                        Gender={user?.gender || 0}
                        photoSrc={user?.photoSrc || ""}
                        formBackgroundSrc={user?.formBackgroundSrc || ""}
                    />
                    <h3 className="profile-alco-header">
                        Сhoose Your Alcohol Preferences🍾
                    </h3>
                    <div className="alco-cards-container">
                        <div className="alco-cards-row">
                            <LowAlcoCard/>
                            <WineCard/>
                        </div>
                        <div className="alco-cards-row">
                            <HighAlcoCard/>
                            <LiquorCard/>
                        </div>
                    </div>



                    <LowAlcoRatingPopUp show={showLowAlcoModal} handleClose={handleCloseModal}/>
                    <WineAlcoRatingPopUp show={showWineModal} handleClose={handleCloseModal}/>
                    <LiquorRatingPopUP show={showLiquorModal} handleClose={handleCloseModal}/>
                    <StrongAlcoRatingPopUp show={showStrongAlcoModal} handleClose={handleCloseModal}/>
                </div>
                </div>


            </div>
            );
            }

            export default ProfilePage;

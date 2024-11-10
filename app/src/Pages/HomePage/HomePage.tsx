import React, { useEffect, useState } from 'react';
import MenuButtonList from '../../components/MenuButtonList/MenuButtonList';
import PartyButtonList from '../../components/PartyButtonList/PartyButtonList';
import { faUser, faUsers, faCake, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/logo.svg';
import Disco from '../../assets/disco.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
// import JejuHallasan from '../../assets/fonts/JejuHallasan-Regular.ttf';
// import Halant from '../../assets/fonts/halant/Halant-SemiBold.ttf';
import backgroundImage from '../../assets/backcov1.svg';
import video from '../../assets/viddd2.mp4';
import CreatePartyPopUp from '../../components/CreatePartyPopUp/CreatePartyPopUp';
import JoinPartyPopUp from "../../components/JoinPartyPopUp/JoinPartyPopUp";
import { useAuth } from "../../Context/useAuth.tsx";
import { toast } from "react-toastify";
import { GetPartyListAPI } from "../../Services/PartyService";
import { PartyListGet } from "../../Models/Party.tsx";
import './HomePage.css';


const HomePage: React.FC = () => {
    const isMobile = window.innerWidth <= 768;

    const { token } = useAuth();
    const [parties, setParties] = useState<PartyListGet[]>([]);

    const UserPartiesGet = async () => {
        if (!token) {
            toast.error("You must be logged in to view your parties");
            return;
        }
        try {
            const response = await GetPartyListAPI(token);
            if (response && response.data) {
                setParties(response.data);
                console.log(`lololol ${response.data}`)
                console.log(parties);// Update state with the party data
            } else {
                setParties([]); // If response is undefined or empty, set an empty array
            }
        } catch (error) {
            console.error('Failed to fetch parties', error);
            toast.error('Failed to fetch parties. Please try again.');
            setParties([]); // Set an empty array in case of error
        }
    };

    useEffect(() => {
        UserPartiesGet();
    }, []);

    const [showCreatePartyPopUp, setShowCreatePartyPopUp] = useState(false);
    const [showJoinPartyPopUp, setShowJoinPartyPopUp] = useState(false);

    const handleShowCreateParty = () => setShowCreatePartyPopUp(true);
    const handleShowJoinParty = () => setShowJoinPartyPopUp(true);

    const handleCloseCreateParty = () => {
        setShowCreatePartyPopUp(false);
        UserPartiesGet(); // Refresh the party list after closing the pop-up
    };
    const handleCloseJoinParty = () => {
        setShowJoinPartyPopUp(false);
        UserPartiesGet(); // Refresh the party list after closing the pop-up
    };

    const menuButtons = [
        { text: 'your profile', icon: faUser, color: 'rgba(225, 219, 101, 0.9)', link: '/profile' },
        { text: 'join party', icon: faCake, color: 'rgba(112, 140, 231, 0.9)', onClick: handleShowJoinParty },
        { text: 'create party', icon: faUsers, color: 'rgba(224, 122, 122, 0.9)', onClick: handleShowCreateParty },
    ];

    const videoStyles : React.CSSProperties = {
        position: isMobile ? 'static' : 'fixed',
        top: 0,
        // width: isMobile ? '100%' : `${28 / zoomLevel}%`,
        height: isMobile ? '0vh' : '100vh',
        objectFit: 'cover' as const,
        zIndex: -1,
        boxSizing: 'border-box',

    };

    return (
        <div className="container-fluid d-flex p-0" style={{minHeight: '100vh'}}>

            <div className="video-left flex-grow-1">

            </div>

            <div
                className="container-fluid p-0 d-flex flex-column align-items-center custom-background square-container-home flex-grow-7"
                style={{
                    // backgroundColor: '#DDE4EE',
                    // backgroundImage: `url(${backgroundImage})`,
                    // backgroundSize: 'cover',
                    // backgroundPosition: isMobile ? '-3px 10px' : '31px 6px',
                    // backgroundRepeat: 'no-repeat',
                    // backgroundAttachment: 'fixed',
                    // minHeight: isMobile ? '100vh' : '100vh',
                }}>

                <div className="d-flex justify-content-between align-items-center w-100">
                    <div className="disco-container" style={{marginTop: '-1.5px'}}>
                        <img
                            src={Disco}
                            alt="Party Icon"
                            width="80"
                            height="80"
                        />
                    </div>
                    <Link to={"/welcome"} className="p-2" aria-label="Go to Welcome Page">
                        <FontAwesomeIcon icon={faCircleInfo} size="2x" color="black"/>
                    </Link>
                </div>

                <div className="logo-container d-flex align-items-center">
                    <img
                        src={Logo}
                        alt="Logo"
                        width="200"
                        height="90"
                    />
                    <span className="logo-text" style={{
                        position: 'relative',
                        top: '-5px',
                        left: '-102px',
                        fontSize: '13px',
                        fontFamily: 'JejuHallasan, sans-serif',
                        lineHeight: '1'
                    }}>
                    <span style={{
                        display: 'inline-block',
                        transform: 'translateX(4px)'
                    }}>
                        ALCO
                    </span>
                    <br/>
                    STACK
                </span>
                </div>

                <div className="centered-container-home">
                    <h2 className="custom-heading-home">Your party, your rules!
                        <p>Your unforgettable night!🎉</p>
                    </h2>
                </div>



                {showCreatePartyPopUp && (
                    <CreatePartyPopUp show={showCreatePartyPopUp} handleClose={handleCloseCreateParty}/>
                )}

                <MenuButtonList menuButtons={menuButtons}/>
                {/*<div className="slider-list-container">*/}
                <PartyButtonList parties={parties}/>
                {/*// </div>*/}
                {showJoinPartyPopUp && (
                    <JoinPartyPopUp show={showJoinPartyPopUp} handleClose={handleCloseJoinParty}/>
                )}

            </div>


        </div>
    );
};

export default HomePage;

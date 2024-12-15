import React, { useEffect, useState } from 'react';
import MenuButtonList from '../../components/MenuButtonList/MenuButtonList';
import PartyButtonList from '../../components/PartyButtonList/PartyButtonList';
// import { faUser, faUsers, faCake } from '@fortawesome/free-solid-svg-icons';
import Logo from '../../assets/logo.svg';
import Disco from '../../assets/disco.svg';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
// import JejuHallasan from '../../assets/fonts/JejuHallasan-Regular.ttf';
// import Halant from '../../assets/fonts/halant/Halant-SemiBold.ttf';
import backgroundImage from '../../assets/backgroundFinal.svg';
//import video from '../../assets/viddd2.mp4';
import infoLogo from '../../assets/About.svg';
import CreatePartyPopUp from '../../components/CreatePartyPopUp/CreatePartyPopUp';
import JoinPartyPopUp from "../../components/JoinPartyPopUp/JoinPartyPopUp";
import { useAuth } from "../../Context/useAuth.tsx";
import {Bounce, toast} from "react-toastify";
import { GetPartyListAPI } from "../../Services/PartyService";
import { PartyListGet } from "../../Models/Party.tsx";
import yourProfile from "../../assets/vector.svg";
import joinParty from "../../assets/join_party.svg";
import creatyParty from "../../assets/creat_party.svg";

import './HomePage.css';

import regparty from '../../assets/Emojipartytext.svg';


const HomePage: React.FC = () => {
    // const isMobile = window.innerWidth <= 768;

    const { token } = useAuth();
    const [parties, setParties] = useState<PartyListGet[]>([]);

    const UserPartiesGet = async () => {
        if (!token) {

            toast.error('You must be logged in to view your parties',{
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
            const response = await GetPartyListAPI(token);
            if (response && response.data) {
                setParties(response.data);
                // console.log(`lololol ${response.data}`)
                console.log(parties);// Update state with the party data
            } else {
                setParties([]); // If response is undefined or empty, set an empty array
            }
        } catch (error) {
            console.error('Failed to fetch parties', error);

            toast.error('Failed to fetch parties. Please try again.',{
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
        { text: 'your profile', icon: yourProfile, link: '/profile' },
        { text: 'join party', icon: joinParty, onClick: handleShowJoinParty },
        { text: 'create party', icon: creatyParty, onClick: handleShowCreateParty },
    ];



    return (
        <div className="container-fluid-home d-flex p-0 full-height-home"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
                 backgroundAttachment: 'fixed',
             }}>
            <div className="video-left flex-grow-1"></div>

            <div className="container-fluid-home p-0 d-flex flex-column align-items-center custom-background square-container-home flex-grow-7">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <div>
                        <img
                            src={Disco}
                            alt="Disco Icon"
                            className="party-icon-home"
                        />
                    </div>

                    <Link
                        to="/welcome"
                        className="home-link-welcome"
                        aria-label="Go to Welcome"
                        style={{
                            position: 'absolute',
                            top: '-25px',
                            right: '10px',
                        }}
                    >
                        <img
                            src={infoLogo}
                            alt="Wlecome Icon"
                            style={{
                                width: '120px',
                                height: '120px',
                            }}
                        />
                    </Link>
                </div>
                    <div className="logo-container d-flex align-items-center" style={{
                        marginTop: '100px',
                        position: 'relative',
                        // top: '-50px',
                        left: '20px'
                    }}>
                        <img
                            src={Logo}
                            alt="Logo"
                            width="200"
                            height="90"
                        />
                        <span className="logo-text" style={{
                            position: 'relative',
                            top: '-8px',
                            left: '-100px',
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


                    <div className="centered-container-home" style={{
                        position: 'relative',
                        top: '-20px', // Сдвигаем контейнер текста вверх
                        left: '18px'
                    }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                            <h2 className="custom-heading-home" style={{margin: 0}}>
                                Your party, your rules!
                                <p>Your unforgettable night!</p>
                            </h2>
                            <img
                                src={regparty}
                                alt="Party Emoji"
                                style={{
                                    position: 'relative',
                                    top: '15px',
                                    left: '-10px',
                                    width: '40px', // Устанавливаем размер иконки
                                    height: '40px',
                                }}
                            />
                        </div>
                    </div>


                    {showCreatePartyPopUp && (
                        <CreatePartyPopUp show={showCreatePartyPopUp} handleClose={handleCloseCreateParty}/>
                    )}

                    <MenuButtonList menuButtons={menuButtons}/>
                    {/*<div className="slider-list-container">*/}
                    <PartyButtonList  parties={parties} />
                    {/*// </div>*/}
                    {showJoinPartyPopUp && (
                        <JoinPartyPopUp show={showJoinPartyPopUp} handleClose={handleCloseJoinParty}/>
                    )}

                </div>


            </div>
            );
            };

            export default HomePage;

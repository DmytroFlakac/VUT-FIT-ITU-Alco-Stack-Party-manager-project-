import React, {useEffect, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import './PartyPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faCopy } from '@fortawesome/free-solid-svg-icons';
import Disco from '../../assets/disco.svg';
import { GetPartyDetailAPI, UpdatePartyAPI, DeletePartyAPI } from '../../Services/PartyService.tsx';
import { GetAllAlcoholByRankListAPI, UpdateAllAlcoholsByRankAPI } from '../../Services/AlcoholService.tsx';
import { PartyDetailGet, PartyDetailPut } from '../../Models/Party.tsx';
import { AlcoholGet } from '../../Models/Alcohol.tsx';
import { useAuth } from '../../Context/useAuth.tsx';
import PartySettingsPopUp from '../../components/PartySettingsPopUp/PartySettingsPopUp.tsx';
import AlcoholList from '../../components/AlcoholCardList/AlcoholCardList';
import { CocktailDetailsGet} from "../../Models/Cocktail.tsx";
import CocktailPopup from "../../components/CocktailPopup/CocktailPopup.tsx";
import {Bounce, toast} from 'react-toastify';

import {GetCocktailListAPI} from '../../Services/CocktailService.tsx';
import DescriptionPopUp from "../../components/DescriptionPopUp/DescriptionPopUp.tsx";
import CountdownTimer from '../../components/CountdownTimer/CountdownTimer.tsx';
import ViewAmountPopUp   from "../../components/ViewAmountPopUp/ViewAmountPopUp.tsx";
import SelectAlcoholPopUp from "../../components/SelectAlcoholPopUp/SelectAlcoholPopUp.tsx";
import backgroundImage from "../../assets/backgroundFinal.svg";
import buttonDescription from "../../assets/descr.svg";
import editIcon from "../../assets/editparty.svg";
import userlist from "../../assets/userlist.svg";
import deleteIcon from "../../assets/Delete.svg";
import leaveIcon from "../../assets/Leave.svg";
import homeIcon from '../../assets/Home.svg';
import viewcocktails from "../../assets/viewcocktails.svg";
import selectamount from "../../assets/selectamount.svg";
import updateRankingButton from '../../assets/updaterankingButton.svg';
import viewamount from '../../assets/viewamount.svg';
import icon_timer from '../../assets/timer_info.svg';
import {leavePartyAPI} from '../../Services/UserService.tsx';
import UserListPopUp from "../../components/UserListPopUp/UserListPopUp.tsx";

const PartyPage: React.FC = () => {
    const { partyId } = useParams<{ partyId: string }>();
    const [party, setParty] = useState<PartyDetailGet | null>(null);
    const [alcohols, setAlcohols] = useState<AlcoholGet[]>([]); // State for alcohol data
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showUserListModal, setShowUserListModal] = useState(false);
    const { token } = useAuth();
    const [cocktails, setCocktails] = useState<CocktailDetailsGet[] | undefined>([]);
    const [selectedCocktailDetails, setSelectedCocktailDetails] = useState<CocktailDetailsGet | null>(null);
    const [showDescription, setShowDescription] = useState(false);
    const [allowUpdates, setAllowUpdates] = useState(true);
    const [showSelectAmountPopUp, setShowSelectAmountPopUp] = useState(false); // State to control the modal visibility
    const [showViewAmountPopUp, setShowViewAmountPopUp] = useState(false);
    const [allowSelect, setAllowSelect] = useState(false); // State to control the button's enabled/disabled state
    const [isFinalState, setIsFinalState] = useState(false);
    const handleShowDescription = () => setShowDescription(true);
    const handleCloseDescription = () => setShowDescription(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [timerState, setTimerState] = useState<"DEFAULT" | "PREPARATION" | "EXTRA_DAY" | "FINAL">("DEFAULT");
    const [infoMessage, setInfoMessage] = useState<string>("");
    // Fetch party details when partyId changes
    useEffect(() => {
        const fetchPartyDetails = async () => {
            try {
                const response = await GetPartyDetailAPI(partyId!, token);
                setParty(response!.data);


                await updateAlcoholData();
            } catch {
                setError('Failed to fetch party details');
            } finally {
                setLoading(false);
            }
        };

        fetchPartyDetails();
        // handleViewCocktails();

    }, [partyId, token]);

    const handleOpenSelectAmount = () => {
        setShowSelectAmountPopUp(true);
    };

    const handleBackToCocktails = () => {
        setSelectedCocktailDetails(null);
    };

    // Function to close the SelectAlcoholPopUp
    const handleCloseSelectAmount = () => {
        setShowSelectAmountPopUp(false);
    };

    const handleOpenViewAmount = () => setShowViewAmountPopUp(true); // New function to open View Amount popup
    const handleCloseViewAmount = () => setShowViewAmountPopUp(false); // New function to close View Amount popup

    const handleTimerComplete = (state: "DEFAULT" | "PREPARATION" | "EXTRA_DAY" | "FINAL") => {
        setTimerState(state);

        if (state === "DEFAULT") {

            setAllowUpdates(true);
            setAllowSelect(false);
            setIsFinalState(false);
        } else if (state === "PREPARATION") {

            setAllowUpdates(false);
            setAllowSelect(true);
            setIsFinalState(false);
        } else if (state === "FINAL") {

            setAllowUpdates(false);
            setAllowSelect(false);
            setIsFinalState(true);
        }else if (state === "EXTRA_DAY") {

            setAllowUpdates(false);
            setAllowSelect(true);
            setIsFinalState(false);
        }
    };

    const handleInfoClick = () => {
        if (infoMessage) {
            // If the message is already displayed, hide it
            setInfoMessage("");
        } else {
            // Otherwise, display the message based on the timer state
            let message = "";

            switch (timerState) {
                case "DEFAULT":
                    message = "Moving to PREPARATION phase. Updates are allowed.";
                    break;
                case "PREPARATION":
                    message = "PREPARATION phase. Alcohol selection allowed.";
                    break;
                case "EXTRA_DAY":
                    message = "EXTRA DAY phase. Alcohol selection allowed.";
                    break;
                case "FINAL":
                    message = "Moving to PARTY start. No updates allowed.";
                    break;
                default:
                    message = "Unknown timer state.";

            }

            setInfoMessage(message); // Update the message state
        }
    };
// Function to update alcohol data
    const updateAlcoholData = async () => {
        try {
            console.log("ssdfsdfdsf");
            const alcoholResponse = await GetAllAlcoholByRankListAPI(partyId!, token);

            setAlcohols(alcoholResponse!.data); // Update state with new data
        } catch (error) {
            console.error("Failed to fetch alcohol data", error);
        }
    };

    const handleUpdateRanking = async () => {
        if (!allowUpdates) {


            toast.warning('Updates are not allowed during this period.',{
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
            setIsDisabled(true);
            const updatedAlcohols = await UpdateAllAlcoholsByRankAPI(party!.rankLimit, partyId!, token);

            if (updatedAlcohols) {

                setAlcohols(updatedAlcohols); // Update the alcohol list state
                await handleViewCocktails();
            }else{
                return;
            }
        } catch (error) {
            console.error("Error updating alcohol rankings:", error);


        }
        finally {

                setIsDisabled(false);

        }
    };
    const hasUpdated = useRef(false);

    useEffect(() => {
        if (party && !hasUpdated.current) {
            hasUpdated.current = true; // Prevent duplicate calls
            handleUpdateRanking().finally(() => {
                hasUpdated.current = false; // Reset after API call
            });
        }
    }, [party]);


    const removeDuplicates = (cocktails: (CocktailDetailsGet | undefined)[]) => {
        const uniqueCocktails: CocktailDetailsGet[] = [];
        const seenIds = new Set<string>();

        for (let i = 0; i < cocktails.length; i++) {
            const currentCocktail = cocktails[i];
            if (currentCocktail && !seenIds.has(currentCocktail.idDrink)) {
                uniqueCocktails.push(currentCocktail);
                seenIds.add(currentCocktail.idDrink);
            }
        }

        return uniqueCocktails;
    };

    const handleCocktailDetails = (id: string) => {
        const details = cocktails?.find((c) => c.idDrink === id);
        if (details) {
            setSelectedCocktailDetails(details);
            setIsPopupOpen(true);
        }
    };


    const handleViewCocktails = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {

            const cocktailPromises = alcohols.map(alcohol => {

                return GetCocktailListAPI(partyId!, alcohol.name, token);
            });
            console.log(cocktailPromises);

// Wait for all API calls to complete
            const cocktailResponses = await Promise.all(cocktailPromises);

// Flatten the results into a single array of cocktails
            const combinedCocktails = cocktailResponses
                .flat(); // Flatten array if each response contains an array of cocktails

// Update the cocktails state with the combined results


            const filteredCocktails = removeDuplicates(combinedCocktails);
            setCocktails(filteredCocktails);
            console.log("filteredCocktails", filteredCocktails);
            setIsPopupOpen(false);



            if (filteredCocktails.length > 0) {

                toast.success('Cocktails loaded successfully!',{
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                } );
            }/*else {
                toast.error('Failed to load cocktails.',{
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
            }*/
        } catch (error) {
            console.error("Error fetching cocktails:", error);
            toast.error('Failed to load cocktails.',{
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

        } finally {
            setIsLoading(false);
        }
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);


        // setIsDisabled(true);
        // setTimeout(() => {
        //     setIsDisabled(false);
        // }, 5000);
    };



    // const handleCocktailDetails = async (id: string) => {
    //     try {
    //
    //
    //         const cocktailDetails = await GetCocktailDetailsAPI(id, token);
    //         console.log("cocktail photo", cocktailDetails.strDrinkThumb);
    //         if (cocktailDetails) {
    //             setSelectedCocktailDetails(cocktailDetails); // Save the selected cocktail details
    //         }
    //     } catch (error) {
    //         console.error('Error fetching cocktail details:', error);
    //
    //     }
    // };
    // Function to handle copying party ID
    const handleCopy = () => {
        const inputElement = document.getElementById("partyIdInput") as HTMLInputElement;
        inputElement.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const deleteParty = async () => {
        try {
            const response = await DeletePartyAPI(partyId!, token);

            if (!response) {

                toast.error('Failed to delete party.',{
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

            toast.success('Party deleted successfully!',{
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );
            window.location.href = "/home";
        } catch (error) {
            console.error("Failed to delete party", error);

        }
    }

    const leaveParty = async () => {
        try {
            const response = await leavePartyAPI(partyId!, token); // Виклик API для виходу з вечірки
            if (!response) {

                toast.error('Failed to leave party!',{
                    position: "top-center",
                    autoClose: 3000,
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
            toast.success('Party leaved successfully!',{
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );
            window.location.href = "/home";
        } catch (error) {
            console.error("Error leaving the party:", error);

        }
    };

    // Handle save action from modal
    const handleSave = async (updatedParty: PartyDetailPut) => {
        if (!allowUpdates) {


            toast.error('Updates to the party details are not allowed during this period.',{
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
            const response = await UpdatePartyAPI(
                partyId!,
                updatedParty.name,
                updatedParty.description || "",
                updatedParty.date,
                updatedParty.preparationDate,
                updatedParty.photo || "",
                updatedParty.location || "",
                updatedParty.liquors,
                updatedParty.lowAlcohol,
                updatedParty.midAlcohol,
                updatedParty.highAlcohol,
                updatedParty.rankLimit,
                token
            );

            if (!response) {

                toast.error('Failed to update party!',{
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
            setParty(prevParty => prevParty ? { ...prevParty, ...updatedParty } : null);


            setShowModal(false);
        } catch (error) {
            console.error("Failed to update party", error);

        }
    };

    // If the data is still loading
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there was an error fetching the party details
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div
            className="container-fluid-partypage p-0 d-flex full-height-partypage"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed'
            }}
        >
            <div className="video-left flex-grow-1"></div>

            <div
                className="container-fluid-partypage p-0 d-flex flex-column align-items-center custom-background square-container-partypage flex-grow-7">
                <div
                    className="party-id-display"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '35%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                    }}
                >
                    <div className="party-id-container">

                        <div className="input-group">
                            <input
                                id="partyIdInput"
                                type="text"
                                value={partyId}
                                readOnly
                                className="form-control"
                                aria-label="Party ID"
                                style={{
                                    width: '200px',
                                    textAlign: 'center',
                                }}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                onClick={handleCopy}
                                aria-label="Copy Party ID"
                                style={{
                                    marginLeft: '10px',
                                }}
                            >
                                <FontAwesomeIcon icon={faCopy}/>
                            </button>
                        </div>
                    </div>
                    {copied && (
                        <small
                            className="text-success mt-2"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                            }}
                        >
                            Copied!
                        </small>
                    )}
                </div>

                <h2
                    className="main-text-partypage"
                    style={{
                        position: 'absolute',
                        top: '80px',
                        left: '35%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        textAlign: 'center',
                    }}
                >
                    WELCOME to {party!.name}!!!
                </h2>


                <div>
                    <img
                        src={Disco}
                        alt="Disco Icon"
                        className="party-icon-partypage"
                    />
                </div>

                <Link
                    to="/home"
                    className="home-link-welcome"
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

                {party && (
                    <div className="party-details mt-4">


                        {/*<p>Created by me: {party.createdByMe ? "Yes" : "No"}</p>*/}
                        {party.createdByMe && (
                            <button
                                className="btn-edit-partypage"
                                onClick={() => setShowModal(true)}
                                aria-label="Edit Party"
                            >
                                <img src={editIcon} alt="Edit Party"/>
                            </button>
                        )}

                        {!party.createdByMe && (
                            <button
                                className="btn-userlist"
                                onClick={() => setShowUserListModal(true)}
                                aria-label="User List"
                            >
                                <img src={userlist} alt="Userlist"/>
                            </button>
                        )}

                        {party.createdByMe && (
                            <button
                                className="btn-delete-partypage"
                                onClick={deleteParty}
                                aria-label="Delete Party"
                            >
                                <img src={deleteIcon} alt="Delete Party"/>
                            </button>
                        )}
                        {!party.createdByMe && (
                            <button className="btn-leave-partypage"
                                    onClick={leaveParty}
                                    aria-label="Leave Party"
                            >
                                <img src={leaveIcon} alt="Leave Party"/>
                            </button>
                        )}
                        {party.createdByMe && (
                            <button
                                className="btn-creator-userlist"
                                onClick={() => setShowUserListModal(true)}
                                aria-label="User List"
                            >
                                <img src={userlist} alt="Userlist"/>
                            </button>
                        )}
                    </div>
                )}



                <div className="d-flex justify-content-between align-items-center w-100">


                    {/* Party Description Button */}
                    {/* Party Description Button */}
                    <button
                        className="btn"
                        style={{
                            position: 'absolute',
                            top: '306px',
                            right: '423px',
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                        }}
                        onClick={handleShowDescription}
                    >
                        <img
                            src={buttonDescription}
                            alt="Party Description"
                            style={{
                                width: '200px',
                                height: '100px',
                                cursor: 'pointer',
                            }}
                        />
                    </button>
                </div>
                {/* Description PopUp */}
                {showDescription && (
                    <DescriptionPopUp
                        name={party?.name || 'Unnamed Party'} // Fallback value for name
                        description={party?.description || 'No description available'}
                        photo={party?.photo}
                        preparationDate={new Date(party?.preparationDate || '').toLocaleDateString()}
                        date={new Date(party?.date || '').toLocaleDateString()} // Provide fallback for date
                        location={party?.location || 'Unknown location'} // Fallback value for location
                        liquors={party?.liquors || false}
                        lowAlcohol={party?.lowAlcohol || false}
                        midAlcohol={party?.midAlcohol || false}
                        highAlcohol={party?.highAlcohol || false}
                        rankLimit={party?.rankLimit || 0}
                        onClose={handleCloseDescription}
                    />
                )}

                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {party?.preparationDate && (
                        <CountdownTimer
                            preparationDate={party.preparationDate}
                            eventDate={party.date}
                            onTimerComplete={handleTimerComplete}
                        />
                    )}
                    <div style={{position: 'absolute', top: '125px', left: '480px'}}>
                        <img
                            src={icon_timer}
                            alt="Info Icon"
                            style={{width: '24px', height: '24px', cursor: 'pointer'}}
                            onClick={handleInfoClick} // Toggle the message on click
                        />
                    </div>
                    {infoMessage && (
                        <div
                            style={{
                                position: 'absolute', top: '115px', left: '120px',
                                marginTop: '10px',
                                fontFamily: 'Halant, sans-serif',
                                fontSize: '14px',
                                color: 'black',
                            }}
                        >
                            {infoMessage}
                        </div>
                    )}
                </div>

                {/* Кнопка Select Amount */}
                <div className="mt-3">
                    {isFinalState ? (
                        <button
                            className="btn"
                            onClick={handleOpenViewAmount}
                            style={{
                                position: 'absolute',
                                top: '307px',
                                left: '350px',
                                padding: 0,
                                border: 'none',

                            }}
                        >
                            <img
                                src={viewamount}
                                alt="Select Amount"
                                style={{
                                    width: '200px',
                                    height: '100px',
                                    cursor: 'pointer',

                                }}
                            />
                        </button>
                    ) : (
                        <button
                            className="btn"
                            style={{
                                position: 'absolute',
                                top: '307px',
                                left: '350px',
                                padding: 0,
                                border: 'none',

                            }}
                            onClick={handleOpenSelectAmount}
                            disabled={!allowSelect}
                        >
                            <img
                                src={selectamount}
                                alt="Select Amount"
                                style={{
                                    width: '200px',
                                    height: '100px',
                                    cursor: 'pointer',

                                }}
                            />
                        </button>
                    )}


                    {/* Select Amount PopUp */}
                    <SelectAlcoholPopUp
                        show={showSelectAmountPopUp}
                        handleClose={handleCloseSelectAmount}
                        alcohols={alcohols}
                        partyId={partyId!}
                    />

                    {/* View Amount PopUp */}
                    <ViewAmountPopUp
                        show={showViewAmountPopUp}
                        handleClose={handleCloseViewAmount}
                        partyId={partyId!} // Pass the party ID
                    />


                </div>



                <div className="mt-4">
                    <AlcoholList alcohols={alcohols}/>
                    <button
                        className="btn"
                        onClick={handleUpdateRanking}
                        style={{
                            position: "absolute",
                            top: "450px",
                            left: "550px",
                            padding: 0,
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                        }}
                        disabled={isDisabled}
                    >
                        <img
                            src={updateRankingButton}
                            alt="Update Alko Ranking"
                            style={{
                                width: "40px",
                                height: "40px",
                            }}
                        />
                    </button>
                </div>


                <div >
                    <button
                        className="btn"
                        style={{
                            position: 'absolute',
                            top: '306px',
                            left: '5px',
                            padding: 0,
                            border: 'none',
                            background: 'transparent',
                            opacity: isLoading ? 0.6 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                        onClick={async () => {
                             // Open the popup

                            // Call handleViewCocktails only if cocktails is undefined or empty
                            if (!cocktails || cocktails.length === 0) {
                                await handleViewCocktails();
                            }
                            setIsPopupOpen(true);
                        }}

                        disabled={isLoading}
                    >
                        <img
                            src={viewcocktails}
                            alt="View Cocktails"
                            style={{
                                width: '200px',
                                height: '100px',
                                cursor: 'pointer',
                            }}
                        />

                    </button>
                    {/* Условный рендеринг текста */}
                    {(isLoading) && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '280px',
                                left: '30px',
                                color: 'white',
                                fontSize: '16px',
                                fontFamily: 'Halant, sans-serif',
                                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                            }}
                        >
                            Updating cocktails...
                        </div>
                    )}
                    <CocktailPopup
                        cocktails={cocktails}
                        details={selectedCocktailDetails}
                        onClickCocktail={handleCocktailDetails}
                        onBackToCocktails={handleBackToCocktails}
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                    />

                </div>

                <UserListPopUp
                    partyId={partyId!}
                    token={token}
                    show={showUserListModal}
                    onClose={() => setShowUserListModal(false)}
                />

                {party && (
                    <PartySettingsPopUp
                        partyId={partyId}
                        token={token}
                        name={party.name}
                        description={party.description || ""}
                        date={party.date}
                        preparationDate={party.preparationDate}
                        photo={party.photo || ""}
                        location={party.location || ""}
                        liquors={party.liquors}
                        lowAlcohol={party.lowAlcohol}
                        midAlcohol={party.midAlcohol}
                        highAlcohol={party.highAlcohol}
                        rankLimit={party.rankLimit}
                        show={showModal}
                        allowUpdates={allowUpdates} // Pass allowUpdates to the popup
                        onClose={() => setShowModal(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );

};

export default PartyPage;
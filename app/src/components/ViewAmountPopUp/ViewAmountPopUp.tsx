import React, { useEffect, useState } from "react";
import { AlcoholVolume } from "../../Models/Alcohol.tsx";
import {PartyUserAlcohol} from "../../Models/Party.tsx";
import { GetPartyAlcoholVolumeAPI, UpdateWillBeBoughtAPI } from "../../Services/PartyService.tsx";
import { useAuth } from "../../Context/useAuth.tsx";
import { toast } from "react-toastify";
import "./ViewAmountPopUp.css";

interface ViewAmountPopUpProps {
    show: boolean;
    handleClose: () => void;

    partyId: string;
}

const ViewAmountPopUp: React.FC<ViewAmountPopUpProps> = ({ show, handleClose, partyId }) => {
    const { token } = useAuth();
    const [alcoholVolumes, setAlcoholVolumes] = useState<AlcoholVolume[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (show) {
            fetchAlcoholVolumes();
        }
    }, [show]);



    const fetchAlcoholVolumes = async () => {
        setLoading(true);
        setError(null); // Clear any existing errors
        try {
            const response = await GetPartyAlcoholVolumeAPI(partyId, token);
            // console.log("AAAAAAAAAAAAAAAAAAAAAAAA",response);
            if (response && response.data) {
                setAlcoholVolumes(response.data.alcoholVolume);
            } else {
                setAlcoholVolumes([]);
                setError("Failed to fetch alcohol volumes. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching alcohol volumes:", error);
            setError("Error fetching alcohol volumes. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true); // Indicate the saving process has started
        try {
            // Construct the payload with name and willBeBought properties
            const payload: PartyUserAlcohol = {
                alcoholVolume: alcoholVolumes.map((alcohol) => ({
                    name: alcohol.name,
                    willBeBought: alcohol.willBeBought ?? false, // Ensure willBeBought has a boolean value
                })),
            };

            // Call the API to update the alcohol data
            const response = await UpdateWillBeBoughtAPI(partyId, payload, token!);

            if (response) {
                // Save the updated data to localStorage
                localStorage.setItem(
                    `party-${partyId}-isBoughtVolumes`,
                    JSON.stringify(alcoholVolumes)
                );

                // Save the API response to localStorage for future use
                localStorage.setItem(
                    `party-${partyId}-updateResponse`,
                    JSON.stringify(response)
                );

                toast.success("Alcohol purchase states updated successfully!");
                handleClose(); // Close the popup after successful save
            } else {
                throw new Error("Failed to save alcohol purchase states.");
            }
        } catch (error) {
            console.error("Failed to save alcohol purchase states:", error);
            toast.error("Failed to save alcohol purchase states. Please try again.");
        } finally {
            setIsSaving(false); // Indicate the saving process has ended
        }
    };




    const toggleIsBought = (name: string) => {
        setAlcoholVolumes((prev) =>
            prev.map((alcohol) =>
                alcohol.name === name ? { ...alcohol, willBeBought: !alcohol.willBeBought } : alcohol
            )
        );
    };

    if (!show) return null;

    return (
        <div className="view-amount-popup-backdrop" onClick={handleClose}>
            <div
                className="view-amount-popup-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="view-amount-popup-content">
                    <h3 className="view-amount-popup-title">Manage Alcohol Purchases</h3>
                    {error && <p className="view-amount-popup-error">{error}</p>}
                    {loading ? (
                        <p className="view-amount-popup-loading">Loading...</p>
                    ) : (
                        <ul className="view-amount-popup-list">
                            {alcoholVolumes.length > 0 ? (
                                alcoholVolumes.map((alcohol) => (
                                    <li key={alcohol.name} className="view-amount-popup-list-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={alcohol.willBeBought || false}
                                                onChange={() => toggleIsBought(alcohol.name)}
                                            />
                                            <strong>{alcohol.name}</strong>: {alcohol.volume || 0} l
                                        </label>
                                    </li>
                                ))
                            ) : (
                                <p className="view-amount-popup-loading">No alcohol data available.</p>
                            )}
                        </ul>
                    )}
                    <button
                        className="view-amount-popup-close-btn"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAmountPopUp;

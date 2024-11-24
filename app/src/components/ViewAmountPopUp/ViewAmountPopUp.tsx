import React, { useEffect, useState } from "react";
import { AlcoholVolume } from "../../Models/Alcohol.tsx";
import { GetPartyAlcoholVolumeAPI } from "../../Services/PartyService.tsx";
import { useAuth } from "../../Context/useAuth.tsx";
import { toast } from "react-toastify";
import "./ViewAmountPopUp.css";

interface ViewAmountPopUpProps {
    show: boolean;
    handleClose: () => void;
    partyId: string; // Pass party ID to fetch alcohol volumes
}

const ViewAmountPopUp: React.FC<ViewAmountPopUpProps> = ({ show, handleClose, partyId }) => {
    const { token } = useAuth();
    const [alcoholVolumes, setAlcoholVolumes] = useState<AlcoholVolume[]>([]); // State to hold fetched alcohol volumes
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    useEffect(() => {
        if (show) {
            fetchAlcoholVolumes();
        }
    }, [show]);

    const fetchAlcoholVolumes = async () => {
        setLoading(true);
        try {
            const response = await GetPartyAlcoholVolumeAPI(partyId, token);
            if (response && response.data) {
                setAlcoholVolumes(response.data.alcoholVolume); // Assuming response contains alcoholVolume
            } else {
                setAlcoholVolumes([]);
                toast.error("Failed to fetch alcohol volumes.");
            }
        } catch (error) {
            console.error("Error fetching alcohol volumes:", error);
            toast.error("Error fetching alcohol volumes.");
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="view-amount-popup-backdrop" onClick={handleClose}>
            <div
                className="view-amount-popup-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="view-amount-popup-content">
                    <h3 className="view-amount-popup-title">View Total Alcohol Volumes</h3>
                    {loading ? (
                        <p className="view-amount-popup-loading">Loading...</p>
                    ) : (
                        <ul className="view-amount-popup-list">
                            {alcoholVolumes.length > 0 ? (
                                alcoholVolumes.map((alcohol, index) => (
                                    <li key={index} className="view-amount-popup-list-item">
                                        <strong>{alcohol.name}</strong>: {alcohol.volume || 0} l
                                    </li>
                                ))
                            ) : (
                                <p className="view-amount-popup-loading">No alcohol data available.</p>
                            )}
                        </ul>
                    )}
                    <button
                        className="view-amount-popup-close-btn"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewAmountPopUp;

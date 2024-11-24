import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/useAuth.tsx";
import { toast } from "react-toastify";
import AlcoVolumeSliderList from "../AlcoVolumeSliderList/AlcoVolumeSliderList.tsx";
import { UpdateAlcoholVolumeAPI } from "../../Services/UserService.tsx";
import { PartyUserAlcohol } from "../../Models/Party.tsx";
import { AlcoholVolume } from "../../Models/Alcohol.tsx";
import back from '../../assets/signIn_card.svg';
import './SelectAlcoholPopUp.css';

interface SelectAlcoholPopUpProps {
    show: boolean;
    handleClose: () => void;
    alcohols: AlcoholVolume[]; // Alcohols list with volumes
    partyId: string; // Party ID
}

const SelectAlcoholPopUp: React.FC<SelectAlcoholPopUpProps> = ({
                                                                   show,
                                                                   handleClose,
                                                                   alcohols,
                                                                   partyId,
                                                               }) => {
    const { token } = useAuth();
    const [updatedAlcohols, setUpdatedAlcohols] = useState<AlcoholVolume[]>([]);
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        if (show) {
            const savedVolumes = localStorage.getItem(`party-${partyId}-volumes`);
            if (savedVolumes) {
                setUpdatedAlcohols(JSON.parse(savedVolumes));
            } else {
                setUpdatedAlcohols(alcohols);
            }
        }
    }, [show, alcohols, partyId]);

    const handleVolumeChange = (name: string, newVolume: number) => {
        setUpdatedAlcohols((prev) =>
            prev.map((alcohol) =>
                alcohol.name === name
                    ? { ...alcohol, volume: newVolume }
                    : alcohol
            )
        );
    };

    const saveVolumes = async () => {
        setIsSaving(true);
        try {
            const payload: PartyUserAlcohol = {
                alcoholVolume: updatedAlcohols.map((alcohol) => ({
                    name: alcohol.name,
                    volume: alcohol.volume,
                })),
            };

            const response = await UpdateAlcoholVolumeAPI(partyId, payload, token!);

            if (response) {
                localStorage.setItem(
                    `party-${partyId}-volumes`,
                    JSON.stringify(updatedAlcohols)
                );

                toast.success("Alcohol volumes updated successfully!");
                handleClose();
            } else {
                throw new Error("Failed to save alcohol volumes.");
            }
        } catch (error) {
            console.error("Failed to save alcohol volumes:", error);
            toast.error("Failed to save alcohol volumes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!show) {
        return null;
    }

    return (
        <>
            <div className="select-backdrop-blur" onClick={handleClose} />
            <div className="select-container" style={{ backgroundImage: `url(${back})`}}>
                <div className="modal-content">
                    <h3>Select Alcohol Volumes</h3>
                    <div className="alcohol-slider-list">
                        <AlcoVolumeSliderList
                            sliders={updatedAlcohols.map((alcohol) => ({
                                label: alcohol.name,
                                value: alcohol.volume ?? 0,
                                onChange: (newVolume) =>
                                    handleVolumeChange(alcohol.name, newVolume),
                            }))}
                        />
                    </div>
                        <button
                            className="select-confirm"
                            onClick={saveVolumes}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </>
            );
            };

            export default SelectAlcoholPopUp;

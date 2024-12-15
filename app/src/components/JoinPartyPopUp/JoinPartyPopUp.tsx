import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import {Bounce, toast} from "react-toastify";
import * as yup from "yup";
import { Modal, Button } from "rsuite";
import { JoinPartyAPI } from "../../Services/PartyService.tsx";
import 'rsuite/dist/rsuite.min.css';
import "./JoinPartyPopUp.css";

// Validation schema using yup
const validationSchema = yup.object().shape({
    partyId: yup.string().required("Party ID is required"),
});

interface JoinPartyPopUpProps {
    show: boolean;
    handleClose: () => void;
}

const JoinPartyPopUp: React.FC<JoinPartyPopUpProps> = ({ show, handleClose }) => {
    const { token } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store the error message

    useEffect(() => {
        if (show) {
            const dropdown = document.querySelector('.rs-picker-dropdown');
            if (dropdown) {
                document.getElementById('portal-root')?.appendChild(dropdown);
            }
        }
    }, [show]);

    const onSubmit = async (data: { partyId: string }) => {
        try {
            const response = await JoinPartyAPI(
                data.partyId,
                token
            );

            if (!response) {
                // If response is undefined, show the appropriate error message
                setErrorMessage("Party with that ID is not found");
                return; // Exit the function early
            }

            toast.success('Party joined successfully!',{
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            } );
            console.log(response);
            setErrorMessage(null); // Clear error message on success
            handleClose(); // Close the modal on success
        } catch (error) {
            console.error("Error while joining the party:", error);
            setErrorMessage("Party with that ID is not found"); // Set error message
        }
    };

    return (
        <>
            {show && <div className="modal-backdrop"/>} {/* Add blurred backdrop */}

                <Modal open={show} onClose={handleClose}>

                        <Modal.Header className="text-center w-100">
                            <Modal.Title className="modal-title-bold-join">Join Party</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className="modal-body-scroll-join-party">
                            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column align-items-center">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
                                        placeholder="Enter ID to join the party"
                                        {...register("partyId")}
                                    />
                                    {/* Show error message in red if it exists */}
                                    {errorMessage && (
                                        <span className="text-danger" style={{color: "red"}}>
                                    {errorMessage}
                                </span>
                                    )}
                                    <span className="text-danger">{errors.partyId?.message}</span>
                                </div>
                                <Button type="submit" className="join-button">Confirm</Button>
                            </form>
                        </Modal.Body>

                </Modal>

        </>
);
            }

            export default JoinPartyPopUp;

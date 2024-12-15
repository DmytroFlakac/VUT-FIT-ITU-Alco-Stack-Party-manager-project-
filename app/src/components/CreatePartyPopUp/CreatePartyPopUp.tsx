import React, {  useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../../Context/useAuth";
import {Bounce, toast} from "react-toastify";
import * as yup from "yup";
import { Modal, Button } from "rsuite";
import { CreatePartyAPI } from "../../Services/PartyService.tsx";
import DateTimePickerTime from "../DateTimePicker/DateTimePickerTime.tsx";
import "./CreatePartyPopUp.css";
import icon_calendar from '../../assets/icon _calendar_.svg';
import clear_icon from "../../assets/deldata.svg";
interface DateTimePickerRef {
    focus: () => void;
}


// Validation schema using yup
const validationSchema = yup.object().shape({
    name: yup
        .string()
        .required("Name is required")
        .max(50, "Name must be at most 50 characters"),
    description: yup.string().optional().max(500, "Description must be at most 500 characters"),
    date: yup
        .string()
        .required("Date is required")
        .test("is-future-date", "Date must be today or in the future", function (value) {
            if (!value) return false;
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        }),
    preparationDate: yup
        .string()
        .required("Preparation Date is required")
        .test("is-before-date", "Preparation Date must be earlier than the event date", function (value) {
            const { date } = this.parent;
            if (!value || !date) return true;
            const preparationDate = new Date(value);
            const eventDate = new Date(date);
            return preparationDate < eventDate;
        }),
    photo: yup.string().optional(),
    location: yup.string().optional(),
});

interface CreatePartyPopUpProps {
    show: boolean;
    handleClose: () => void;
}

const CreatePartyPopUp: React.FC<CreatePartyPopUpProps> = ({ show, handleClose }) => {
    const { user, token } = useAuth();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const dateRef = useRef<DateTimePickerRef>(null);
    const preparationDateRef = useRef<DateTimePickerRef>(null);

    const formatDateTimeForDisplay = (value: string | undefined) => {
        if (!value) return "";
        const date = new Date(value);
        return date.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    interface CustomInputProps {
        value?: string;
        onClick?: () => void;
        onClear?: () => void;
    }

    const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
        ({ value, onClick, onClear }, ref) => (
            <div className="datepicker-input-wrapper">
                <input
                    ref={ref}
                    value={formatDateTimeForDisplay(value)}
                    placeholder="Select Date"
                    className="datepicker-input"
                    readOnly
                    onClick={onClick}
                />
                <img
                    src={icon_calendar}
                    alt="Calendar Icon"
                    className="datepicker-icon"
                    onClick={onClick}
                />
                {value && (
                    <img
                        src={clear_icon}
                        alt="Clear Icon"
                        className="clear-icon"
                        onClick={onClear}
                    />
                )}
            </div>
        )
    );

    const onSubmit = async (data: { name: string; description?: string; date: string; preparationDate: string; photo?: string; location?: string; }) => {
        try {
            const response = await CreatePartyAPI(
                data.name,
                data.description || "",
                data.date,
                data.preparationDate,
                data.photo || "",
                data.location || "",
                user?.userName,
                token
            );
            toast.success('Party created successfully!',{
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
            handleClose();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Failed to create party!',{
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

        }
    };

    const dateValue = watch("date");
    const preparationDateValue = watch("preparationDate");

    return (
        <>
            {show && <div className="modal-backdrop create-party" />}
            <Modal open={show} onClose={handleClose}>
                <Modal.Header>
                    <Modal.Title>Create Party</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="name">Party Name <span style={{color: "red"}}>*</span></label>
                            <input
                                type="text"
                                placeholder=" Enter Party Name"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                {...register("name")}
                            />
                            {errors.name && <p className="text-danger">{errors.name.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description">Description</label>
                            <textarea
                                placeholder="Optional description"
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-danger">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="mb-3" >
                            <label htmlFor="preparationDate">Preparation Date <span
                                style={{color: "red"}}>*</span></label>
                            <CustomInput
                                value={preparationDateValue}
                                onClear={() => setValue("preparationDate", "")}
                                onClick={() => preparationDateRef.current?.focus()}
                            />
                            <DateTimePickerTime
                                ref={preparationDateRef}
                                value={preparationDateValue}
                                onChange={(value) => setValue("preparationDate", value || "")}
                            />
                            {errors.preparationDate && (
                                <p className="text-danger">{errors.preparationDate.message}</p>
                            )}
                        </div>

                        <div className="mb-3" >
                            <label htmlFor="date">Date <span style={{color: "red"}}>*</span></label>
                            <CustomInput
                                value={dateValue}
                                onClear={() => setValue("date", "")}
                                onClick={() => dateRef.current?.focus()}
                            />
                            <DateTimePickerTime
                                ref={dateRef}
                                value={dateValue}
                                onChange={(value) => setValue("date", value || "")}
                            />
                            {errors.date && <p className="text-danger">{errors.date.message}</p>}
                        </div>

                        <div className="mb-3" style={{

                        }}>
                            <label htmlFor="location">Location</label>
                            <input
                                placeholder=" Party Location"
                                type="text"
                                className="form-control"
                                {...register("location")}
                            />
                        </div>
                        {/* Buttons */}
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button
                                appearance="primary"
                                type="submit"
                                style={{backgroundColor: "#000000", color: "white"}}
                            >
                                Create Party
                            </Button>
                            <Button
                                onClick={handleClose}
                                appearance="subtle"
                                style={{backgroundColor: "#000000", color: "white"}}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreatePartyPopUp;

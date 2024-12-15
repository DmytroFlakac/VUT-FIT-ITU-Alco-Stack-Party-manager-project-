import React, { useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input, Toggle } from 'rsuite';
import { PartyDetailPut } from '../../Models/Party.tsx';
import './PartySettingsPopUp.css';
import backpop from '../../assets/signUp_card.svg';
import {Bounce, toast} from 'react-toastify';
import icon_calendar from '../../assets/icon _calendar_.svg';
import DateTimePickerTime from "../DateTimePicker/DateTimePickerTime.tsx";
import clear_icon from '../../assets/deldata.svg';
import {UserDeleteList} from "../UserDeleteList/UserDeleteList.tsx";
interface DateTimePickerRef {
    focus: () => void;
}

interface DateTimePickerTimeRef {
    focus: () => void;
}
// Validation schema with Yup
const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().optional(),
    photo: yup.string().optional(),
    date: yup
        .string()
        .required("Date is required")
        .test(
            "is-future-date",
            "Date must be today or in the future",
            function (value) {
                if (!value) return false;
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today;
            }
        )
    ,
    preparationDate: yup
        .string()
        .required("Preparation Date is required")
        .test(
            "is-before-date",
            "Preparation Date must be earlier than the event date",
            function (value) {
                const { date } = this.parent;
                if (!value || !date) return true;
                const preparationDate = new Date(value);
                const eventDate = new Date(date);
                return preparationDate < eventDate;
            }
        )
        .test(
            "is-not-same-day",
            "Preparation Date cannot be the same day as the event date",
            function (value) {
                const { date } = this.parent;
                if (!value || !date) return true;
                const preparationDate = new Date(value).toISOString().split("T")[0];
                const eventDate = new Date(date).toISOString().split("T")[0];
                return preparationDate !== eventDate;
            }
        ),

    location: yup.string().optional(),
    liquors: yup.boolean().required(),
    lowAlcohol: yup.boolean().required(),
    midAlcohol: yup.boolean().required(),
    highAlcohol: yup.boolean().required(),
    rankLimit: yup
        .number()
        .transform((value, originalValue) => (originalValue === "" ? null : value)) // Treat empty string as null
        .nullable()
        .required("Rank limit is required")
        .typeError("Rank limit must be a number") // Handle non-numeric input
        .min(1, "Rank limit must be at least 1")
});

interface PartySettingsPopUpProps {
    partyId: string | undefined;
    token: string | null;
    name: string;
    description: string;
    date: string;
    preparationDate: string;
    photo: string;
    location: string;
    liquors: boolean;
    lowAlcohol: boolean;
    midAlcohol: boolean;
    highAlcohol: boolean;
    rankLimit: number;
    show: boolean;
    allowUpdates: boolean; // Add allowUpdates as a prop
    onClose: () => void;
    onSave: (updatedParty: PartyDetailPut) => Promise<void>;
}


const PartySettingsPopUp: React.FC<PartySettingsPopUpProps> = ({
                                                                   partyId,
                                                                   token,
                                                                   name,
                                                                   description,
                                                                   date,
                                                                   preparationDate,
                                                                   photo,
                                                                   location,
                                                                   liquors,
                                                                   lowAlcohol,
                                                                   midAlcohol,
                                                                   highAlcohol,
                                                                   rankLimit,
                                                                   show,
                                                                   allowUpdates,
                                                                   onClose,
                                                                   onSave,
                                                               }) => {
    const {

        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PartyDetailPut>({
        resolver: yupResolver(validationSchema),
        defaultValues: { name, description, date, preparationDate, photo, location, liquors, lowAlcohol, midAlcohol, highAlcohol, rankLimit },
    });

    useEffect(() => {
        if (show) {
            if (date) setValue('date', date);
            if (preparationDate) setValue('preparationDate', preparationDate);
        }
    }, [show, date, preparationDate, setValue]);




    const watchLiquors = watch("liquors", liquors);
    const watchLowAlcohol = watch("lowAlcohol", lowAlcohol);
    const watchMidAlcohol = watch("midAlcohol", midAlcohol);
    const watchHighAlcohol = watch("highAlcohol", highAlcohol);

    const onSubmit: SubmitHandler<PartyDetailPut> = async (data) => {
        const categoriesSelected = [
            data.liquors,
            data.lowAlcohol,
            data.midAlcohol,
            data.highAlcohol,
        ].some((category) => category);
        if (!allowUpdates) {
            toast.error('Updates to the party details are not allowed during this period.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            return;
        }
        if (!categoriesSelected) {
            setValue("liquors", true);
            data.liquors = true;
        }

        try {
            await onSave(data);

            toast.success('Party updated successfully!',{
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
            onClose();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
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

        }
    };

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
    interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
                        src={clear_icon} // Import the SVG image
                        alt="Clear Icon" // Accessible description for the image
                        className="clear-icon"
                        onClick={onClear} // Clear the value on click
                    />
                )}
            </div>
        )
    );


    const dateValue = watch("date");
    const preparationDateValue = watch("preparationDate");
    const datePickerRef = useRef<DateTimePickerRef>(null);
    const date_timePickerRef = useRef<DateTimePickerTimeRef>(null);


    return (
        <>
            {show && (
                <div
                    className="party-edit-backdrop-blur"
                    onClick={onClose} // Close the popup when clicking outside
                >
                    <div
                        className="party-settings-container"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
                        style={{
                            backgroundImage: `url(${backpop})`,
                            backgroundSize: 'cover',
                            border: '3px solid rgba(79, 40, 233, 0.5)',

                            backgroundRepeat: 'no-repeat',
                            borderRadius: '10px',
                            padding: '2px',
                            maxWidth: '450px',
                            maxHeight: '600px',
                            margin: 'auto',
                            textAlign: 'center',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column', // Ensures header, body, and footer stack vertically
                        }}
                    >
                        <div className="party-header">
                            <h2 className="modal-title-bold">Edit Party Settings</h2>
                        </div>
                        <div
                            className="party-body"
                            style={{
                                overflowY: 'auto', // Enable scrolling
                                flex: 1, // Take available space and make content scrollable
                                paddingBottom: '20px',
                            }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Party Name</label>
                                    <Input
                                        id="name"
                                        value={watch("name")}
                                        placeholder="Enter the name of party"
                                        onChange={(value) => setValue("name", value)}
                                        className={`custom-input ${errors.name ? "is-invalid" : ""}`}
                                    />
                                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <Input
                                        id="description"
                                        value={watch("description")}
                                        placeholder="Enter the description of party"
                                        onChange={(value) => setValue("description", value)}
                                        className="custom-input"
                                    />
                                    {errors.description && <p className="text-danger">{errors.description.message}</p>}
                                </div>
                                <div className="mb-3 datepicker-container">
                                    <label htmlFor="date" className="form-label">Preparation Date</label>
                                    <CustomInput
                                        value={preparationDateValue}
                                        onClear={() => setValue("preparationDate", "")} // Clear the date value
                                        onClick={() => date_timePickerRef.current?.focus()} // Trigger the calendar programmatically
                                    />
                                    <DateTimePickerTime
                                        ref={date_timePickerRef}
                                        value={preparationDateValue}
                                        onChange={(value) => setValue("preparationDate", value || "")}
                                    />
                                    {errors.date && <p className="text-danger">{errors.date.message}</p>}
                                </div>
                                <div className="mb-3 datepicker-container">
                                    <label htmlFor="date" className="form-label">Date and Time</label>
                                    <CustomInput
                                        value={dateValue}
                                        onClear={() => setValue("date", "")} // Clear the date value
                                        onClick={() => datePickerRef.current?.focus()} // Trigger the calendar programmatically
                                    />
                                    <DateTimePickerTime
                                        ref={datePickerRef}
                                        value={dateValue}
                                        onChange={(value) => setValue("date", value || "")}
                                    />
                                    {errors.date && <p className="text-danger">{errors.date.message}</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <Input
                                        id="location"
                                        value={watch("location")}
                                        placeholder="Enter the location of party"
                                        onChange={(value) => setValue("location", value)}
                                        className="custom-input"
                                    />
                                    {errors.location && <p className="text-danger">{errors.location.message}</p>}
                                </div>
                                <div className="mb-3 toggle-container">
                                    <label htmlFor="liquors" className="form-label">Liquors</label>
                                    <Toggle
                                        id="liquors"
                                        checked={watchLiquors}
                                        onChange={(checked) => setValue("liquors", checked)}
                                    />
                                </div>
                                <div className="mb-3 toggle-container">
                                    <label htmlFor="lowAlcohol" className="form-label">Low Alcohol</label>
                                    <Toggle
                                        id="lowAlcohol"
                                        checked={watchLowAlcohol}
                                        onChange={(checked) => setValue("lowAlcohol", checked)}
                                    />
                                </div>
                                <div className="mb-3 toggle-container">
                                    <label htmlFor="midAlcohol" className="form-label">Mid Alcohol</label>
                                    <Toggle
                                        id="midAlcohol"
                                        checked={watchMidAlcohol}
                                        onChange={(checked) => setValue("midAlcohol", checked)}
                                    />
                                </div>
                                <div className="mb-3 toggle-container">
                                    <label htmlFor="highAlcohol" className="form-label">High Alcohol</label>
                                    <Toggle
                                        id="highAlcohol"
                                        checked={watchHighAlcohol}
                                        onChange={(checked) => setValue("highAlcohol", checked)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="rankLimit" className="form-label">Rank Limit</label>
                                    <Input
                                        id="rankLimit"
                                        type="number"
                                        placeholder="Select number of alcohol types"
                                        value={watch("rankLimit")?.toString()}
                                        onChange={(value) => setValue("rankLimit", parseInt(value))}
                                        className="custom-input"
                                    />
                                    {errors.rankLimit && <p className="text-danger">{errors.rankLimit.message}</p>}
                                </div>
                                <label htmlFor="userlist" className="form-label">Delete User</label>
                                <UserDeleteList
                                    partyId={partyId}
                                    token={token}
                                />
                            </form>
                        </div>
                        <div>
                        <form
                                onSubmit={handleSubmit(onSubmit)} // Bind the onSubmit handler
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* Other form fields go here */}

                                <button
                                    className="party-footer"
                                    type="submit" // Ensure this triggers the form submission
                                    style={{
                                        display: 'block',
                                        margin: '45px auto',
                                    }}
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </>


    );
};

export default PartySettingsPopUp;
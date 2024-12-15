import React, {useEffect, useRef} from 'react';
import { useForm } from "react-hook-form";
//import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAuth } from "../../Context/useAuth";
import { useNavigate, Link } from 'react-router-dom';
import { toast , Bounce} from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Address, UserProfile } from "../../Models/User";
import { UpdateProfileAPI, DeleteAccountAPI } from "../../Services/UserService";
import Disco from '../../assets/disco.svg';
import backgroundImage from "../../assets/backgroundFinal.svg";
import './EditProfilePage.css';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker.tsx';
import backicon from '../../assets/backicon.svg'
import icon_calendar from "../../assets/icon _calendar_.svg";
import clear_icon from '../../assets/deldata.svg';
//import DatePicker from "react-datepicker";
interface DateTimePickerRef {
    focus: () => void;
}

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    userName: Yup.string().required("Username is required"),
    firstName: Yup.string()
        .nullable()
        .matches(/^[a-zA-Z]*$/, 'First Name must contain only English letters')
        .max(25, 'First Name must be at most 25 characters')
        .optional(),
    lastName: Yup.string()
        .nullable()
        .matches(/^[a-zA-Z]*$/, 'Last Name must contain only English letters')
        .max(25, 'Last Name must be at most 25 characters')
        .optional(),
    phoneNumber: Yup.string()
        .nullable() // Allow null or empty
        .matches(
            /^\+?[1-9]\d{1,14}$/,
            'Phone Number must be a valid international number (e.g., +123456789)'
        ), // Regex for international phone numbers
    bio: Yup.string().optional(),
    gender: Yup.number().optional(),
    dateOfBirth: Yup.string()
        .nullable()
        .test(
            'is-valid-date-or-empty',
            'Date of Birth must be in YYYY-MM-DD format',
            value => {
                // Allow empty string or undefined
                if (value === '' || value === undefined || value === null) return true;

                // Check if value matches YYYY-MM-DD format
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            }
        )
        .optional(),

    address: Yup.object().shape({
        streetAddress: Yup.string().optional(),
        city: Yup.string().optional(),
        postalCode: Yup.string().optional(),
        country: Yup.string().optional()
    }).optional(),
});

const EditProfilePage: React.FC = () => {
    const { user, token, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    //const [dateOfBirth, setDateOfBirth] = useState<string | undefined>(undefined);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UserProfile>({
        resolver: yupResolver(validationSchema),
    });




    useEffect(() => {
        if (user) {
            Object.keys(user).forEach((key) => {
                setValue(key as keyof UserProfile, user[key as keyof UserProfile]);
            });
        }
    }, [user, setValue]);

    useEffect(() => {

    }, [watch('dateOfBirth')]);

    const handleUpdate = async (formData: UserProfile) => {

        if (!token) {
            toast.error('You must be logged in to update your profile',{
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
            const response = await UpdateProfileAPI(
                formData.email,
                formData.userName,
                formData.firstName || "",
                formData.lastName || "",
                formData.bio || "",
                formData.dateOfBirth || "",
                formData.phoneNumber || "",
                formData.address || { streetAddress: "", city: "", postalCode: "", country: "" },
                formData.gender,
                token
            );
            if (response && response.data) {
                updateUser(response.data);
                navigate('/profile');
            }
        } catch (error) {
            console.error('Failed to update profile', error);

            toast.error('Failed to update profile. Please try again.',{
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

    // const handleDateChange = (newDate: string | undefined) => {
    //     setDateOfBirth(newDate);
    // };

    const dateRef = useRef<DateTimePickerRef>(null);

    const handleDeleteAccount = async (username: string) => {
        if (!token) {

            toast.error('You must be logged in to delete your account.',{
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
            await DeleteAccountAPI(username, token); // Call the API with username and token
            toast.success('Account was deleted successfully', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            logout(); // Log out the user after account deletion
            navigate("/register"); // Redirect to the registration page
        } catch (error) {
            console.error("Failed to delete account", error);
            toast.error('Failed to delete account. Please try again.',{
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


    const renderInput = (label: string, id: string, type: string, placeholder: string, registerName: keyof UserProfile,  isRequired: boolean = false, disabled: boolean = false) => (
        <div className="mb-3" key={id}>
            <label htmlFor={id} className="input_titles-editprofile">{label}{isRequired && <span style={{ color: "red", marginLeft: "5px" }}>*</span>}</label>
            <input
                type={type}
                id={id}
                autoComplete={id}
                className={`custom-input-editprofile  ${errors[registerName] ? 'is-invalid-editprofile' : ''}`}
                placeholder={placeholder}
                disabled={disabled}
                {...register(registerName)}
            />
            {errors[registerName] && <div className="invalid-feedback-editprofile">{errors[registerName]?.message}</div>}
        </div>
    );

    const renderAddressInput = (label: string, id: string, placeholder: string, registerName: keyof Address) => (

        <div className="mb-3" key={id} style={{marginRight: '100px'}}>
            <label htmlFor={id} className="input_titles-editprofile">{label}</label>
            <input
                type="text"
                id={id}
                autoComplete={id}
                className={`custom-input-editprofile form-control ${errors.address?.[registerName] ? 'is-invalid-editprofile' : ''}`}
                placeholder={placeholder}
                {...register(`address.${registerName}` as const)}
            />
            {errors.address?.[registerName] && <div className="invalid-feedback-editprofile">{errors.address[registerName]?.message}</div>}
        </div>
    );

    interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
        value?: string;
        onClick?: () => void;
        onClear?: () => void;
    }

    const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
        ({ value, onClick, onClear, ...rest }, ref) => (
            <div className="datepicker-input-wrapper" style={{ marginRight: '50px' }}>
                <input
                    ref={ref}
                    value={value}
                    placeholder="Select Date"
                    className="datepicker-input"
                    readOnly
                    onClick={onClick}
                    {...rest} // Spread additional input props if needed
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
                        className="clear-icon-editprof"
                        onClick={onClear} // Clear the value on click
                    />
                )}
            </div>
        )
    );

    const dateOfBirth = watch("dateOfBirth");


    return (
        <div className="container-fluid-editprofile d-flex p-0 full-height-editprofile"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
                 backgroundAttachment: 'fixed'
             }}>
            <div className="video-left flex-grow-1"></div>

            <div className="container-fluid-editprofile p-0 d-flex flex-column align-items-center custom-background square-container-editprofile flex-grow-7">
                <div className="d-flex justify-content-between align-items-center w-100 p-3">
                    <div>
                        <img
                            src={Disco}
                            alt="Disco Icon"
                            className="party-icon-editprofile"
                        />
                    </div>
                    <Link to="/profile" className="p-2" aria-label="Go to Profile">
                        <img
                            src={backicon}
                            alt="Go to Profile"
                            style={{
                                width: "110px",
                                height: "40px",
                                cursor: "pointer",
                            }}
                        />
                    </Link>
                </div>
                <div className="card-editprofile">
                    <div className="card-body p-5" style={{marginTop: '10px'}}>

                        <h1 className="card-title-editprofile mb-4 text-center">Edit Profile</h1>
                        <form onSubmit={handleSubmit(handleUpdate)}>
                            {renderInput('Email', 'email', 'email', 'Email', 'email', true, true)}
                            {renderInput('Username', 'userName', 'text', 'Username', 'userName', true, true)}
                            {renderInput('First Name', 'firstName', 'text', 'First Name', 'firstName')}
                            {renderInput('Last Name', 'lastName', 'text', 'Last Name', 'lastName')}
                            {renderInput('Phone Number', 'phoneNumber', 'text', 'Phone Number', 'phoneNumber')}
                            {renderInput('Bio', 'bio', 'text', 'Bio', 'bio')}
                            <div className="mb-3">
                                <label htmlFor="dateOfBirth" className="form-label" style={{marginBottom: '-10px'}}>Date of Birth</label>
                                <DateTimePicker
                                    ref={dateRef}
                                    value={dateOfBirth}
                                    //onChange={handleDateChange}
                                    onChange={(value) => setValue("dateOfBirth", value || "")}
                                />
                                <CustomInput
                                    value={dateOfBirth ?? undefined}
                                    onClear={() => setValue("dateOfBirth", "")} // Clear the date value
                                    onClick={() => dateRef.current?.focus()} // Trigger the calendar programmatically
                                />
                                {errors.dateOfBirth && (
                                    <div className="invalid-feedback">{errors.dateOfBirth.message}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gender" className="input_titles-editprofile">Gender</label>
                                <select
                                    id="gender"
                                    autoComplete="gender"
                                    className={` custom-input-editprofile ${errors.gender ? 'is-invalid-editprofile' : ''}`}
                                    {...register("gender", {
                                        required: "Gender is required",
                                        valueAsNumber: true
                                    })}
                                >
                                    <option value="" className="gender-select-option-editprofile">Select Gender</option>
                                    <option value={0} className="gender-select-option-editprofile-bold">Male</option>
                                    <option value={1} className="gender-select-option-editprofile-bold">Female</option>
                                    <option value={2} className="gender-select-option-editprofile-bold">Other</option>
                                </select>
                                {errors.gender && (
                                    <div className="invalid-feedback-editprofile">{errors.gender.message}</div>
                                )}
                            </div>

                            {renderAddressInput("Street", "address.streetAddress", "Enter your street address", "streetAddress")}
                            {renderAddressInput("City", "address.city", "Enter your city", "city")}
                            {renderAddressInput("Country", "address.country", "Enter your country", "country")}
                            {renderAddressInput("Zip Code", "address.postalCode", "Enter your zip code", "postalCode")}
                            <div className="d-flex justify-content-between">
                                <button
                                    type="submit"
                                    className="editprofile-save-btn"

                                >
                                    Save Changes
                                </button>
                                <button

                                    className="editprofile-logout-btn"

                                    onClick={logout}
                                >
                                    Logout
                                </button>
                                <button
                                    type="button"
                                    className="editprofile-deleteaccount-btn"

                                    onClick={() => handleDeleteAccount(user!.userName)}
                                >
                                    Delete Account
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;

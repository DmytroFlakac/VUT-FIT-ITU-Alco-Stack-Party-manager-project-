import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from '../../Context/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Address } from '../../Models/User';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'rsuite/dist/rsuite.min.css';
import backgroundImage from '../../assets/backgroundFinal.svg';
import Disco from '../../assets/disco.svg';
import './RegisterPage.css';
import './datepicker.css';
import icon_calendar from '../../assets/icon _calendar_.svg';

export type RegisterFormInputs = {
    email: string;
    userName: string;
    password: string;
    firstName?: string;
    lastName?: string;
    gender?: number;
    dateOfBirth?: string; // ISO 8601 format
    address?: Address;
    phoneNumber?: string;
    bio?: string;
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    firstName: Yup.string().optional(),
    lastName: Yup.string().optional(),
    gender: Yup.number().optional(),
    dateOfBirth: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date of Birth must be in YYYY-MM-DD format')
        .optional(),
    address: Yup.object().shape({
        streetAddress: Yup.string().optional(),
        city: Yup.string().optional(),
        postalCode: Yup.string().optional(),
        country: Yup.string().optional(),
    }).optional(),
    phoneNumber: Yup.string().optional(),
    bio: Yup.string().optional(),
});

const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div>
        <input
            className="custom-input-register form-control"
            onClick={onClick}
            ref={ref}
            value={value}
            placeholder={placeholder}
            readOnly
        />
        <div className="input-group-append" onClick={onClick}>
            <img src={icon_calendar} alt="Calendar Icon" className="calendar-icon-register" />
        </div>
    </div>
));

const RegisterPage: React.FC = () => {
    const { registerUser } = useAuth();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormInputs>({
        resolver: yupResolver(validationSchema),
    });

    const handleRegister = (form: RegisterFormInputs) => {
        const formattedDateOfBirth = form.dateOfBirth ? new Date(form.dateOfBirth).toISOString().split('T')[0] : undefined;
        console.log("registering user", form);
        registerUser(
            form.email,
            form.userName,
            form.password,
            form.firstName || '',
            form.lastName || '',
            form.phoneNumber || '',
            form.address || { streetAddress: '', city: '', postalCode: '', country: '' },
            form.bio || '',
            form.gender || 0,
            formattedDateOfBirth
        );
    };

    const dateOfBirth = watch('dateOfBirth');
    const dateOfBirthValue = dateOfBirth ? new Date(dateOfBirth) : null;



    const renderInput = (label: string, id: string, type: string, placeholder: string, registerName: keyof RegisterFormInputs, error?: string) => (
        <div className="mb-3">
            <label htmlFor={id} className="input_titles-register">{label}</label>
            <input
                type={type}
                id={id}
                autoComplete={id}
                className={`custom-input-register form-control ${error ? 'is-invalid-register' : ''}`}
                placeholder={placeholder}
                {...register(registerName)}
            />
            {error && <div className="invalid-feedback-register">{error}</div>}
        </div>
    );

    const renderAddressInput = (label: string, id: string, placeholder: string, registerName: keyof Address, error?: string) => (
        <div className="mb-3">
            <label htmlFor={id} className="input_titles-register">{label}</label>
            <input
                type="text"
                id={id}
                autoComplete={id}
                className={`custom-input-register form-control ${error ? 'is-invalid-register' : ''}`}
                placeholder={placeholder}
                {...register(`address.${registerName}` as const)}
            />
            {error && <div className="invalid-feedback-register">{error}</div>}
        </div>
    );

    //const isMobile = window.innerWidth <= 768;


    return (
        <div className="container-fluid-register d-flex p-0 full-height-register"
             style={{
                 backgroundImage: `url(${backgroundImage})`,
                 backgroundSize: 'cover',
                 backgroundAttachment: 'fixed' // Фиксируем фон
             }}>
            <div className="video-left flex-grow-1"></div>

            <div className="container-fluid p-0 d-flex flex-column align-items-center custom-background square-container-register flex-grow-7">
                <div>
                    <img
                        src={Disco}
                        alt="Disco Icon"
                        className="party-icon-register"
                    />
                </div>
                <div className="card-register">
                    <div className="card-body p-5" style={{marginTop: '10px'}}>
                        <h1 className="card-title-register mb-4 text-center">Create your account</h1>
                        <form onSubmit={handleSubmit(handleRegister)}>
                            {renderInput('Email', 'email', 'email', 'Email', 'email', errors.email?.message)}
                            {renderInput('Username', 'userName', 'text', 'Username', 'userName', errors.userName?.message)}
                            {renderInput('Password', 'password', 'password', '••••••••', 'password', errors.password?.message)}
                            {renderInput('First Name', 'firstName', 'text', 'First Name', 'firstName', errors.firstName?.message)}
                            {renderInput('Last Name', 'lastName', 'text', 'Last Name', 'lastName', errors.lastName?.message)}
                            {renderInput('Phone', 'phone', 'text', 'Phone', 'phoneNumber', errors.phoneNumber?.message)}

                            <div className="mb-3">
                                <label htmlFor="gender" className="input_titles-register">Gender</label>
                                <select
                                    id="gender"
                                    autoComplete="gender"
                                    className={`custom-input-register form-control ${errors.gender ? 'is-invalid-register' : ''}`}
                                    {...register("gender", {
                                        required: "Gender is required",
                                        valueAsNumber: true
                                    })}
                                >
                                    <option value="" className="gender-select-option-register">Select Gender</option>
                                    <option value={0} className="gender-select-option-register-bold">Male</option>
                                    <option value={1} className="gender-select-option-register-bold">Female</option>
                                    <option value={2} className="gender-select-option-register-bold">Other</option>
                                </select>
                                {errors.gender && (
                                    <div className="invalid-feedback-register">{errors.gender.message}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="dateOfBirth" className="input_titles-register">Date of Birth</label>
                                <DatePicker
                                    selected={dateOfBirthValue}
                                    onChange={(date) => setValue('dateOfBirth', date ? date.toISOString().split('T')[0] : undefined)}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Select Date"
                                    customInput={<CustomInput/>}
                                    className="react-datepicker"
                                />
                                {errors.dateOfBirth && (
                                    <div className="invalid-feedback-register">{errors.dateOfBirth.message}</div>
                                )}
                            </div>


                            {renderAddressInput('Street Address', 'addressStreetAddress', 'Street Address', 'streetAddress', errors.address?.streetAddress?.message)}
                            {renderAddressInput('City', 'addressCity', 'City', 'city', errors.address?.city?.message)}
                            {renderAddressInput('Postal Code', 'addressPostalCode', 'Postal Code', 'postalCode', errors.address?.postalCode?.message)}
                            {renderAddressInput('Country', 'addressCountry', 'Country', 'country', errors.address?.country?.message)}

                            {renderInput('Bio', 'bio', 'text', 'Bio', 'bio', errors.bio?.message)}

                            <button type="submit" className="confirm-button-register">Sign up</button>
                            <p className="text-center mt-3 text-alrdy-register">
                                Already have an account? <Link to="/" className="text-signin-register">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

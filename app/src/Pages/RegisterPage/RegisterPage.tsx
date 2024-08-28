﻿import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAuth } from '../../Context/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Address } from '../../Models/User';
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

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
    photo?: string;
    formBackgroundUrl?: string;
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
    photo: Yup.string().optional(),
    formBackgroundUrl: Yup.string().optional(),
    bio: Yup.string().optional(),
});

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
            form.photo || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
            form.bio || '',
            form.formBackgroundUrl || '',
            form.gender || 0,
            formattedDateOfBirth
        );
    };

    const dateOfBirth = watch('dateOfBirth');
    const dateOfBirthValue = dateOfBirth ? new Date(dateOfBirth) : null;



    const renderInput = (label: string, id: string, type: string, placeholder: string, registerName: keyof RegisterFormInputs, error?: string) => (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <input
                type={type}
                id={id}
                autoComplete={id}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                {...register(registerName)}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );

    const renderAddressInput = (label: string, id: string, placeholder: string, registerName: keyof Address, error?: string) => (
        <div className="mb-3">
            <label htmlFor={id} className="form-label">{label}</label>
            <input
                type="text"
                id={id}
                autoComplete={id}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                placeholder={placeholder}
                {...register(`address.${registerName}` as const)}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card w-100 max-w-md m-3">
                <div className="card-body p-5">
                    <h1 className="card-title mb-4 text-center">Create your account</h1>
                    <form onSubmit={handleSubmit(handleRegister)}>
                        {renderInput('Email', 'email', 'email', 'Email', 'email', errors.email?.message)}
                        {renderInput('Username', 'userName', 'text', 'Username', 'userName', errors.userName?.message)}
                        {renderInput('Password', 'password', 'password', '••••••••', 'password', errors.password?.message)}
                        {renderInput('First Name', 'firstName', 'text', 'First Name', 'firstName', errors.firstName?.message)}
                        {renderInput('Last Name', 'lastName', 'text', 'Last Name', 'lastName', errors.lastName?.message)}
                        {renderInput('Phone', 'phone', 'text', 'Phone', 'phoneNumber', errors.phoneNumber?.message)}
                        <div className="mb-3">
                            <label htmlFor="gender" className="form-label">Gender</label>
                            <select
                                id="gender"
                                autoComplete="gender"
                                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                {...register("gender", {
                                    required: "Gender is required",
                                    valueAsNumber: true // Ensure the value is parsed as a number
                                })}
                            >
                                <option value="">Select Gender</option>
                                <option value={0}>Male</option>
                                <option value={1}>Female</option>
                                <option value={2}>Other</option>
                            </select>
                            {errors.gender && (
                                <div className="invalid-feedback">{errors.gender.message}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                            <DatePicker
                                format="yyyy-MM-dd"
                                value={dateOfBirthValue}
                                onChange={(date) => setValue('dateOfBirth', date ? date.toISOString().split('T')[0] : undefined)}
                                placeholder="Select Date"
                                style={{ width: '100%' }}
                            />
                            {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth.message}</div>}
                        </div>

                        {renderAddressInput('Street Address', 'addressStreetAddress', 'Street Address', 'streetAddress', errors.address?.streetAddress?.message)}
                        {renderAddressInput('City', 'addressCity', 'City', 'city', errors.address?.city?.message)}
                        {renderAddressInput('Postal Code', 'addressPostalCode', 'Postal Code', 'postalCode', errors.address?.postalCode?.message)}
                        {renderAddressInput('Country', 'addressCountry', 'Country', 'country', errors.address?.country?.message)}

                        {renderInput('Photo URL', 'photo', 'text', 'Photo URL', 'photo', errors.photo?.message)}
                        {renderInput('Form Background URL', 'formBackgroundUrl', 'text', 'Form Background URL', 'formBackgroundUrl', errors.formBackgroundUrl?.message)}
                        {renderInput('Bio', 'bio', 'text', 'Bio', 'bio', errors.bio?.message)}

                        <button type="submit" className="btn btn-primary w-100">Sign up</button>
                        <p className="text-center mt-3">
                            Already have an account? <Link to="/">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
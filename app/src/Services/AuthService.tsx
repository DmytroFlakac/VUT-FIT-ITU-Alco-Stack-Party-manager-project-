import axios from "axios";
import {toast, Bounce} from "react-toastify";
import { UserProfileToken } from "../Models/User.tsx";
import { Address } from "../Models/User.tsx";

const api = "http://localhost:5131/api/";


export const loginAPI = async (username: string, password: string) => {
    try {

        const data = await axios.post<UserProfileToken>(api + "account/login", {
            username: username,
            password: password,
        });

        return data;
    } catch (error) {
console.log("sdfsdfdsf");
        if (axios.isAxiosError(error)) {
            toast.error(' Username or password may be incorrect', {
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
        } else {
            // Handle non-Axios errors
            toast.error(' "Unexpected error"', {
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

        }
    }
};


// Adjust the function signature to include new parameters
export const registerAPI = async (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    address: Address,
    bio: string,
    gender: number,
    dateOfBirth: string
) => {
    try {
        const data = await axios.post<UserProfileToken>(`${api}account/register`, {
            email: email,
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            address: address,
            bio: bio,
            gender: gender,
            dateOfBirth: dateOfBirth
        });

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            toast.error('Username or email are already in use!', {
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

        } else {
            toast.error('Unexpected error!', {
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

        }
    }
};

import { createContext, useEffect, useState } from "react";
import {Address, UserProfile} from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";


type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    registerUser: (
        email: string,
        userName: string,
        password: string,
        firstName?: string,
        lastName?: string,
        phoneNumber?: string,
        address?: Address,
        bio?: string,
        gender?: number,
        dateOfBirth?: string
    ) => void;
    updateUser: (UserProfile: UserProfile) => void;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};



type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setIsReady(true);
    }, []);

    const registerUser = async (
        email: string,
        username: string,
        password: string,
        firstName: string = "",
        lastName: string = "",
        phoneNumber: string = "",
        address: Address = {},
        bio: string = "",
        gender: number = 0,
        dateOfBirth: string = ""
    ) => {


        const userObj = {
            email,
            username,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            bio,
            gender,
            dateOfBirth
        };

        console.group("API Request Data: Register User");

        console.log("Payload:", userObj);
        console.groupEnd();

        try {
            const res = await registerAPI(
                email,
                username,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                bio,
                gender,
                dateOfBirth
            );

            console.group("API Response Data: Register User");

            console.groupEnd();

            if (res) {
                const { token, userName, email, firstName, lastName, phoneNumber, address, photoName, photoSrc, bio, formBackgroundName, formBackgroundSrc} = res.data;

                const userObj = {
                    userName: userName,
                    email: email,
                    firstName: firstName ?? "",
                    lastName: lastName ?? "",
                    phoneNumber: phoneNumber ?? "",
                    address: address ?? {},
                    photoName: photoName ?? "",
                    photoSrc: photoSrc ?? "",
                    formBackgroundName: formBackgroundName ?? "",
                    formBackgroundSrc: formBackgroundSrc ?? "",
                    bio: bio ?? "",
                    gender: gender ?? 0,
                    dateOfBirth: dateOfBirth ?? ""
                };

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userObj));

                setToken(token);
                setUser(userObj);

                toast.success("Registration successful!");
                navigate("/");
            }
        } catch (error) {
            toast.warning("Server error occurred");
            console.error("Registration error:", error);
        }
    };
    const loginUser = async (username: string, password: string) => {


        try {
            const res = await loginAPI(username, password);

            console.group("API Response Data: Login User");

            console.groupEnd();

            if (res) {
                const token = res.data.token;
                const userObj = {
                    userName: res.data.userName,
                    email: res.data.email,
                    firstName: res.data.firstName ?? "",
                    lastName: res.data.lastName ?? "",
                    phoneNumber: res.data.phoneNumber ?? "",
                    address: res.data.address ?? {},
                    photoName: res.data.photoName ?? "",
                    photoSrc: res.data.photoSrc ?? "",
                    formBackgroundName: res.data.formBackgroundName ?? "",
                    formBackgroundSrc: res.data.formBackgroundSrc ?? "",
                    bio: res.data.bio ?? "",
                    gender: res.data.gender ?? 2,
                    dateOfBirth: res.data.dateOfBirth ?? ""
                };

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userObj));

                setToken(token);
                setUser(userObj);

                console.log(userObj);


                navigate("/home");
            }
        } catch (error) {
            console.log("dsgdsdgfdfggdg");
            toast.warning("Server error occurred");
            console.error("Login error:", error);
        }
    };

    const updateUser = (user: UserProfile) => {

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        navigate("/");
    };

    return (
        <UserContext.Provider value={{ loginUser, updateUser, user, token, logout, isLoggedIn, registerUser }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);

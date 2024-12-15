import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler.tsx";
import {UserProfile, Address} from "../Models/User.tsx";
 import {PartyUserAlcohol} from "../Models/Party.tsx"

const api = "http://localhost:5131/api/";

export const UpdateProfileAPI = async (
    email: string,
    userName: string,
    firstName?: string,
    lastName?: string,
    bio?: string,
    dateOfBirth?: string,
    phoneNumber?: string,
    address?: Address,
    gender?: number,
    authToken?: string
) => {
    try {
        const data = await axios.put<UserProfile>(
            api+"account/update",
            {
                email: email,
                username: userName,
                firstName: firstName,
                lastName: lastName,
                bio: bio,
                dateOfBirth: dateOfBirth,
                phoneNumber: phoneNumber,
                address: address,
                gender: gender
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            window.alert("Username and email cannot be changed");
        } else {
            // Handle non-Axios errors
            window.alert("Unexpected error");
        }
    }
}

export const UpdatePhotoAPI = async (
    photoChanged: boolean,
    photoFile?: File | null,
    authToken?: string
) => {
    try {
        const formData = new FormData();
        // Append the boolean attributes as strings or numbers
        formData.append("PhotoChanged", JSON.stringify(photoChanged));
        // Append the file data
        if (photoFile) {
            formData.append("PhotoFile", photoFile);
        }



        // Send the request
        const data = await axios.patch<UserProfile>(
            api + "account/updatePhoto",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return data;
    } catch (error) {
        handleError(error);
    }
}





export const UpdateAlcoholVolumeAPI = async (
    partyId: string,
    payload: PartyUserAlcohol,
    authToken?: string
) => {
    try {


        // Send the PATCH request
        const response = await axios.patch(
            `${api}party/${partyId}/update-volume`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );



        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

export const leavePartyAPI = async (
    partyId: string,
    authToken?: string | null
) => {
    try {

        const data = await axios.delete(
            `${api}account/${partyId}LeaveParty`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        return data;
    } catch (error) {
        handleError(error);
    }
};

export const DeleteAccountAPI = async (username: string, authToken: string | null) => {
    try {
        const response = await axios.delete(
            `${api}account/${username}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        return response;
    } catch (error) {
        handleError(error);
        throw error;
    }
};
export const GetUsersByPartyIdAPI = async (
    partyId: string | undefined,
    authToken?: string | null
) => {
    try {
        const response = await axios.get<UserProfile[]>(
            `${api}account/${partyId}/users`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
        return response.data;
    } catch (error) {
        handleError(error);
        throw error;
    }
};

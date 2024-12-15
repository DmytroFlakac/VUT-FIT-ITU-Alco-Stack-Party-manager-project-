import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler.tsx";
import {PartyListGet, PartyPost, PartyDetailGet, PartyUserAlcohol} from "../Models/Party.tsx";
import { toast } from "react-toastify";
const api = "http://localhost:5131/api/";

export const CreatePartyAPI = async (
    name: string, description: string, date: string, preparationDate:string, photo: string, location: string, creatorUserName?: string, authToken?: string | null) => {
    try {
        const data = await axios.post<PartyPost>(
            api+"party/create",
            {
                name: name,
                description: description,
                date: date,
                preparationDate: preparationDate,
                photo: photo,
                location: location,
                creatorUserName: creatorUserName
            },
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
}

export const JoinPartyAPI = async (
    partyId: string,
    authToken?: string | null
) => {
    try {
        const data = await axios.post(
            `${api}party/${partyId}/add-user`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        return data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            // Handle specific errors
            if (error.response?.status === 404) {
                toast.error("Party is not found.");
            } else if (error.response?.status === 400) {
                toast.error("Invalid Party ID format.");
            } else {
                handleError(error); // Handle other errors generically
            }
        } else {
            handleError(error); // Handle generic errors
        }
    }
};

export const GetPartyListAPI = async (authToken?: string | null) => {
    try {
        const data = await axios.get<PartyListGet[]>(
            `${api}party/userParties`,
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

export const GetPartyDetailAPI = async (
    partyId: string,
    authToken?: string | null
) => {
    try {
        const data = await axios.get<PartyDetailGet>(
            `${api}party/${partyId}`,
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


export const UpdatePartyAPI = async (
    partyId: string,
    name?: string,
    description?: string,
    date?: string,
    preparationDate?: string,
    photo?: string,
    location?: string,
    liquors?: boolean,
    lowAlcohol?: boolean,
    midAlcohol?: boolean,
    highAlcohol?: boolean,
    rankLimit?: number,
    authToken?: string | null
) => {
    try {

        if (date) {
            const originalDate = new Date(date);
            originalDate.setHours(originalDate.getHours() + 1);
            date = originalDate.toISOString();
        }

        // Додати 1 годину до `preparationDate`, якщо вона задана
        if (preparationDate) {
            const originalPrepDate = new Date(preparationDate);
            originalPrepDate.setHours(originalPrepDate.getHours() + 1);
            preparationDate = originalPrepDate.toISOString();
        }



        const data = await axios.put<PartyDetailGet>(
            `${api}party/${partyId}`,
            {
                name: name,
                description: description,
                date: date,
                preparationDate: preparationDate,
                photo: photo,
                location: location,
                liquors: liquors,
                lowAlcohol: lowAlcohol,
                midAlcohol: midAlcohol,
                highAlcohol: highAlcohol,
                rankLimit: rankLimit
            },
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

export const DeletePartyAPI = async (
    partyId: string,
    authToken?: string | null
) => {
    try {

        const data = await axios.delete(
            `${api}party/${partyId}`,
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

export const GetPartyAlcoholVolumeAPI = async (
    partyId: string,

    authToken?: string | null
) => {
    try {
        const data = await axios.get<PartyUserAlcohol>(
            `${api}party/${partyId}/alcohol-volumes`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return data;
    } catch (error) {
        handleError(error);
    }
};



export const UpdateWillBeBoughtAPI = async (
    partyId: string,
    payload: PartyUserAlcohol,
    authToken?: string | null
) => {
    try {



        // console.log("In api:ffff", payload);
        // Send the PATCH request
        const response = await axios.patch(
            `${api}party/${partyId}/update-alcohol-purchases`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // console.log("dddddddd:", response.data);
        return response.data;
    } catch (error) {

        handleError(error);
        throw error;
    }
};


export const RemoveUserFromPartyAPI = async (
    partyId: string | undefined,
    userName: string,
    authToken?: string | null
) => {
    try {
        const response = await axios.delete(
            `${api}party/${partyId}remove-user/${userName}`,
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

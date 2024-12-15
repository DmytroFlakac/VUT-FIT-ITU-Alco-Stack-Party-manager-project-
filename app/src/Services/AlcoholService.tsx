import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler.tsx";
import {AlcoholGet} from "../Models/Alcohol.tsx";
import {SliderAlcoholPatch} from "../Models/Alcohol.tsx";

const api = "http://localhost:5131/api/";

export const GetAlcoholRankListAPI = async (partyId: string, rankLink: number, authToken?: string | null) => {
    try {
        const data = await axios.get<AlcoholGet[]>(
            `${api}alcohol/${partyId}/limitByRank/${rankLink}`,
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

export const GetAllAlcoholByRankListAPI = async (partyId: string, authToken?: string | null) => {
    try {
        const data = await axios.get<AlcoholGet[]>(
            `${api}alcohol/${partyId}/allByRank`,
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

export const UpdateAlcoholRatingsAPI = async (
    userName: string,
    type: number,
    ratings: { AlcoholId: string; rating: number }[],
    authToken?: string | null
) => {
    try {


        const response = await axios.patch<SliderAlcoholPatch[]>(
            `${api}account/${userName}/${type}/ratings`,

            ratings,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const GETAlcoholRatingsAPI = async (
    userName: string | undefined,
    authToken?: string | null
) => {
    try {
        const response = await axios.get<SliderAlcoholPatch[]>(
            `${api}alcohol/${userName}UserAlcohol`, // Ensure correct endpoint URL

            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        return response;
    } catch (error) {
        handleError(error);
    }
};

export const UpdateAllAlcoholsByRankAPI = async (
    rankLimit: number,
    partyId: string,
    authToken?: string | null
) => {
    try {
        const response = await axios.patch<AlcoholGet[]>(
            `${api}alcohol/${partyId}/${rankLimit}`, // Correct endpoint URL
            {}, // Empty body if the API does not require one
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Add the token to headers
                },
            }
        );
        return response.data; // Return the updated alcohol list
    } catch (error) {
        handleError(error); // Handle errors using your error handler
    }
};
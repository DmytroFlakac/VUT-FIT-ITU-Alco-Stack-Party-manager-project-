import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler.tsx";
import {CocktailDetailsGet, CocktailGet} from "../Models/Cocktail.tsx";

const api = "https://alcostack.azurewebsites.net/api/";

export const GetCocktailListAPI = async (partyId: string,ingredient: string,authToken?: string | null ) => {
    try {
        const response = await axios.get<CocktailGet[]>(
            `${api}cocktail/ingredient/${partyId}/${ingredient}`, // Updated URL
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        return response.data; // Return only the data, not the full response
    } catch (error) {

        handleError(error);
    }
};

export const GetCocktailDetailsAPI = async (id : string,authToken?: string | null ) => {
    try {

        const response = await axios.get<CocktailDetailsGet>(
            `${api}cocktail/details/${id}`, // Updated URL
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        return response.data; // Return only the data, not the full response
    } catch (error) {

        handleError(error);
    }
};
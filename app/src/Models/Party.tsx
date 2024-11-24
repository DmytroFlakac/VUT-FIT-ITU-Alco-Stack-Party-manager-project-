import {AlcoholVolume} from "./Alcohol.tsx";

export type PartyPost = {
    name: string;
    description: string;
    date: string;
    preparationDate: string;
    photo: string;
    location: string;
    creatorUserName: string;
    token: string;
}

export type PartyListGet = {
    partyId: string;
    name: string;
    description: string;
    date: string;
    createdByMe: boolean;
}

export type PartyDetailGet = {
    name: string;
    description?: string;
    photo?: string;
    date: string;
    preparationDate: string;
    location?: string;
    liquors: boolean;
    lowAlcohol: boolean;
    midAlcohol: boolean;
    highAlcohol: boolean;
    rankLimit: number;
    createdByMe: boolean;
}
export type PartyDetailPut = {
    name: string;
    description?: string;
    photo?: string;
    date: string;
    preparationDate: string;
    location?: string;
    liquors: boolean;
    lowAlcohol: boolean;
    midAlcohol: boolean;
    highAlcohol: boolean;
    rankLimit: number;
}


export type PartyUserAlcohol = {
    alcoholVolume: AlcoholVolume[];
}

export type PartyAlcoholWillBeBought = {
    name: string;
    willBeBought: boolean;
}

export type alcoholPurchases = {
    PartyAlcoholWillBeBought : PartyAlcoholWillBeBought[];
}
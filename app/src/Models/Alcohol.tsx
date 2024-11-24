export type AlcoholGet = {
    name: string;
    type: number;
    photo: string;
    description: string;
    volume?: number; // Add volume as an optional field if necessary
    willBeBought?: boolean;

}
export type SliderAlcoholPatch = {
    alcoholId: string;
    rating: number;
}

export type AlcoholVolume = {
    name: string;
    type?: number;
    photo?: string;
    description?: string;
    volume?: number;
    willBeBought?: boolean;
}
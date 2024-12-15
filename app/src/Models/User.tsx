
export type Address = {
    streetAddress?: string;
    city?: string;
    postalCode?: string;
    country?: string;
};

export type UserProfileToken = {
    userName: string;
    email: string;
    token: string;
    firstName?: string;
    lastName?: string;
    gender?: number;
    dateOfBirth?: string;
    address?: Address;
    phoneNumber?: string;
    photoName?: string;
    photoSrc?: string;
    bio?: string;
    formBackgroundName?: string;
    formBackgroundSrc?: string;
};




export type UserProfile = {
    userName: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    gender?: number;
    dateOfBirth?: string | null;
    address?: Address;
    phoneNumber?: string | null;
    photoName?: string;
    photoSrc?: string;
    bio?: string;
    formBackgroundName?: string;
    formBackgroundSrc?: string;
};

export type UserPhoto = {
    photoChanged: boolean;
    formBackgroundChanged: boolean;
    photoFile?: File | null;
    formBackgroundFile?: File | null;
};



// SOS request looks like in FE

export interface HelpRequestDTO {
    id?: number;
    citizenId: number;
    citizenName?: string;
    description: string;
    location: string;
    latitude: number;
    longitude: number;
    type: string;
    status: 'PENDING' | 'ASSIGNED' | 'RESOLVED';
    createdAt?: string;
    responderId?: number;
    responderName?: string;
}

export interface UserDTO {
    id: number;
    name: string;
    location: string;
    phoneNumber: string;
}
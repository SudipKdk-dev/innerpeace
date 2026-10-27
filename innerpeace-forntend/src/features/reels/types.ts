export interface Reel {
    id: number;
    title: string | null;
    youtubeUrl: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateReelInput {
    title?: string;
    youtubeUrl: string;
    displayOrder?: number;
    isActive?: boolean;
}

export interface UpdateReelInput {
    title?: string;
    youtubeUrl?: string;
    displayOrder?: number;
    isActive?: boolean;
}

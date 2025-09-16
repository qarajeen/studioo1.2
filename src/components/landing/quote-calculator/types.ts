export type ServiceOption = {
    name: string;
    icon: React.ReactNode;
};

export type ServiceOptions = {
    [key: string]: ServiceOption;
};

export type SubService = {
    name: string;
};

export type SubServices = {
    [key: string]: SubService;
};


// Base Services
export const serviceOptions: ServiceOptions = {
    photography: { name: "Photography", icon: {} },
    video: { name: "Video Production", icon: {} },
    post: { name: "Post Production", icon: {} },
    '360tours': { name: "360 Tours", icon: {} },
    timelapse: { name: "Time Lapse", icon: {} },
};

// Photography Sub-Services
export const photographySubServices: SubServices = {
    event: { name: "Event Photography" },
    real_estate: { name: "Real Estate Photography" },
    headshots: { name: "Corporate/Business Headshots" },
    product: { name: "Product Photography" },
    food: { name: "Food Photography" },
    fashion: { name: "Fashion/Lifestyle Photography" },
    wedding: { name: "Wedding Photography" },
};

// Video Production Sub-Services
export const videoSubServices: SubServices = {
    event: { name: "Event Videography" },
    corporate: { name: "Corporate Video" },
    promo: { name: "Promotional/Brand Video" },
    real_estate: { name: "Real Estate Videography" },
    wedding: { name: "Wedding Videography" },
};

// Time-Lapse Sub-Services (No longer used for tiers, but could be for other purposes)
export const timelapseSubServices: SubServices = {
    construction: { name: 'Construction' },
    event: { name: 'Event' },
    nature: { name: 'Nature' },
};

// 360 Tours Sub-Services
export const toursSubServices: SubServices = {
    studio: { name: "Studio Apartment" },
    '1-bedroom': { name: "1-Bedroom Apartment" },
    '2-bedroom': { name: "2-Bedroom Apartment" },
    '3-bedroom': { name: "3-Bedroom Apartment" },
    'villa': { name: "Villa" },
};

// Post-Production Sub-Services
export const postProductionSubServices: SubServices = {
    video: { name: 'Video Editing' },
    photo: { name: 'Photo Editing (Retouching)' },
};

export const locationTypeOptions = ["Indoor", "Outdoor", "Studio", "Exhibition Center", "Hotel", "Other"];

export type RealEstateProperty = {
    id: number;
    type: "studio" | "1-bedroom" | "2-bedroom" | "3-bedroom" | "villa";
    furnished: boolean;
};

export type FormData = {
    // Step 1: Service Selection
    serviceType: keyof typeof serviceOptions | "";
    photographySubType: keyof typeof photographySubServices | "";
    videoSubType: keyof typeof videoSubServices | "";
    timelapseSubType: keyof typeof timelapseSubServices | ""; // This can be repurposed or removed
    toursSubType: keyof typeof toursSubServices | "";
    postSubType: keyof typeof postProductionSubServices | '';

    // Step 1.5: Photography Details
    photoEventDuration: "perHour" | "halfDay" | "fullDay";
    photoEventHours: number;
    photoRealEstateProperties: RealEstateProperty[];
    photoHeadshotsPeople: number;
    photoProductPhotos: number;
    photoProductComplexity: 'simple' | 'complex';
    photoFoodPhotos: number;
    photoFoodComplexity: 'simple' | 'complex';
    photoFashionPackage: "essential" | "standard" | "premium";
    photoWeddingPackage: "essential" | "standard" | "premium";
    
    // Step 1.6: Video Details
    videoEventDuration: "perHour" | "halfDay" | "fullDay";
    videoEventHours: number;
    videoCorporateExtendedFilming: "none" | "halfDay" | "fullDay";
    videoCorporateTwoCam: boolean;
    videoCorporateScripting: boolean;
    videoCorporateEditing: boolean;
    videoCorporateGraphics: boolean;
    videoCorporateVoiceover: boolean;
    videoPromoFullDay: boolean;
    videoPromoMultiLoc: number;
    videoPromoConcept: boolean;
    videoPromoGraphics: boolean;
    videoPromoSound: boolean;
    videoPromoMakeup: boolean;
    videoRealEstatePropertyType: "studio" | "1-bedroom" | "2-bedroom" | "3-bedroom" | "villa";
    videoWeddingPrice: number;

    // Step 1.7: Time-Lapse Details
    timelapseDuration: number;
    timelapseInterval: 'hours' | 'days' | 'weeks' | 'months';
    timelapseHours: number;
    timelapseCameras: number;
    
    // Step 1.8: 360 Tours handled by sub-type
    
    // Step 1.9 Post-Production Details
    postVideoEditingType: 'perHour' | 'perMinute' | 'social';
    postVideoEditingHours: number;
    postVideoEditingMinutes: number;
    postVideoEditingPerMinutePrice: number;
    postVideoEditingSocialPrice: number;
    postPhotoEditingType: 'basic' | 'advanced' | 'restoration';
    postPhotoEditingQuantity: number;
    postPhotoEditingPrice: number;

    // Step 2: Location & Add-ons
    location: string;
    locationType: string;
    secondCamera: boolean;
    timelapseExtraCamera: boolean; // This can be repurposed or removed in favor of timelapseCameras
    deliveryTimeline: "standard" | "rush";


    // Step 3: Contact
    name: string;
    email: string;
    phone: string;
    message: string;
};

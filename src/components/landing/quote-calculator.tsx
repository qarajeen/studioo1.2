
"use client";

import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import jsPDF from "jspdf";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, RotateCcw, Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { FormData, RealEstateProperty, serviceOptions, photographySubServices, videoSubServices, timelapseSubServices, toursSubServices, postProductionSubServices, photogrammetrySubServices, trainingSubServices } from './quote-calculator/types';
import { Step1Service } from "./quote-calculator/step-1-service";
import { Step2Details } from "./quote-calculator/step-2-details";
import { Step3Contact } from "./quote-calculator/step-3-contact";
import { Step4Quote } from "./quote-calculator/step-4-quote";
import { QuoteSummary } from "./quote-calculator/quote-summary";
import { saveQuote } from "@/ai/flows/save-quote-flow";

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.2' : '';

const initialFormData: FormData = {
    serviceType: "",
    photographySubType: "",
    videoSubType: "",
    timelapseSubType: "",
    toursSubType: "",
    postSubType: '',
    photogrammetrySubType: '',
    trainingSubType: '',

    photoEventDuration: "perHour",
    photoEventHours: 1,
    photoRealEstateProperties: [{ id: 1, type: "studio", furnished: false }],
    photoHeadshotsPeople: 1,
    photoProductPhotos: 10,
    photoProductComplexity: 'simple',
    photoFoodPhotos: 10,
    photoFoodComplexity: 'simple',
    photoFashionPackage: 'essential',
    photoWeddingPackage: 'essential',
    
    videoEventDuration: "perHour",
    videoEventHours: 1,
    videoCorporateExtendedFilming: "none",
    videoCorporateTwoCam: false,
    videoCorporateScripting: false,
    videoCorporateEditing: false,
    videoCorporateGraphics: false,
    videoCorporateVoiceover: false,
    videoPromoFullDay: false,
    videoPromoMultiLoc: 0,
    videoPromoConcept: false,
    videoPromoGraphics: false,
    videoPromoSound: false,
    videoPromoMakeup: false,
    videoRealEstatePropertyType: "studio",
    videoWeddingPrice: 3000,

    timelapseDuration: 1,
    timelapseInterval: 'days',
    timelapseHours: 1,
    timelapseCameras: 1,

    postVideoEditingType: 'perHour',
    postVideoEditingHours: 1,
    postVideoEditingMinutes: 1,
    postVideoEditingPerMinutePrice: 500,
    postVideoEditingSocialPrice: 500,
    postPhotoEditingType: 'basic',
    postPhotoEditingQuantity: 1,
    postPhotoEditingPrice: 20,

    trainingHours: 1,
    trainingOneOnOneCameraRental: false,
    trainingOneOnOneClassroomRental: false,
    trainingGroupsClassroomRental: false,

    location: "dubai",
    locationType: "Indoor",
    secondCamera: false,
    timelapseExtraCamera: false,
    deliveryTimeline: "standard",

    name: "",
    email: "",
    phone: "",
    message: "",
};


export function QuoteCalculator() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [validationError, setValidationError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);
    
    React.useEffect(() => {
        if (validationError) {
            const timer = setTimeout(() => setValidationError(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [validationError]);


    const handleInputChange = useCallback((field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleRealEstateChange = useCallback((index: number, field: keyof RealEstateProperty, value: any) => {
        setFormData(prev => {
            const newProperties = [...prev.photoRealEstateProperties];
            newProperties[index] = { ...newProperties[index], [field]: value };
            return { ...prev, photoRealEstateProperties: newProperties };
        });
    }, []);
    
    const addRealEstateProperty = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            photoRealEstateProperties: [
                ...prev.photoRealEstateProperties,
                { id: Date.now(), type: 'studio', furnished: false }
            ]
        }));
    }, []);

    const removeRealEstateProperty = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            photoRealEstateProperties: prev.photoRealEstateProperties.filter((_, i) => i !== index)
        }));
    }, []);

    const handleReset = () => {
        setFormData(initialFormData);
        setStep(1);
    };

    const getSubTypeName = (serviceType: string, data: FormData) => {
      if (!serviceType) return '';
      switch (serviceType) {
        case 'photography': return photographySubServices[data.photographySubType]?.name || '';
        case 'video': return videoSubServices[data.videoSubType]?.name || '';
        case 'post': return postProductionSubServices[data.postSubType]?.name || '';
        case 'timelapse': return 'Timelapse';
        case '360tours': return toursSubServices[data.toursSubType]?.name || '';
        case 'photogrammetry': return photogrammetrySubServices[data.photogrammetrySubType]?.name || '';
        case 'training': return trainingSubServices[data.trainingSubType]?.name || '';
        default: return '';
      }
    };

    const nextStep = async () => {
        const triggerValidationError = (message: string, title: string) => {
            toast({ title: title, description: message, variant: "destructive" });
            setValidationError(true);
        };
    
        if (step === 1) {
            if (formData.serviceType === '') {
                triggerValidationError("Please select a service type to continue.", "Service Required");
                return;
            }
            const subTypeFields = {
                photography: 'photographySubType',
                video: 'videoSubType',
                '360tours': 'toursSubType',
                post: 'postSubType',
                photogrammetry: 'photogrammetrySubType',
                training: 'trainingSubType'
            };
            
            if (formData.serviceType === 'timelapse') {
              // No sub-type for timelapse anymore, so we skip the check
            } else {
              const subTypeKey = subTypeFields[formData.serviceType as keyof typeof subTypeFields];
              if (subTypeKey && !formData[subTypeKey as keyof FormData]) {
                  const serviceName = serviceOptions[formData.serviceType]?.name || "Service";
                  triggerValidationError(`Please select a ${serviceName.toLowerCase()} sub-type to continue.`, `${serviceName} Type Required`);
                  return;
              }
            }
        }
        if (step === 3) {
            if (!formData.name || !formData.email || !formData.phone) {
                toast({ title: "Missing Information", description: "Please fill out your name, email, and phone number.", variant: "destructive" });
                return;
            }
            setIsSubmitting(true);
            try {
                const subTypeName = getSubTypeName(String(formData.serviceType), formData);

                await saveQuote({
                    serviceType: serviceOptions[formData.serviceType]?.name,
                    subType: subTypeName,
                    total: quoteDetails.total,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                    breakdown: quoteDetails.items,
                });

                toast({
                    title: "Quote Saved!",
                    description: "Your quote has been saved. We will be in touch shortly.",
                    variant: "default",
                });
                setStep((prev) => prev + 1);

            } catch (error: any) {
                console.error("Failed to save quote:", error);
                toast({
                    title: "Submission Error",
                    description: `There was a problem saving your quote. ${error.message}`,
                    variant: "destructive",
                });
            } finally {
                setIsSubmitting(false);
            }
            return; // Prevent advancing step twice
        }
        if (step === 4) {
            // This would be the submission logic
            console.log("Form Submitted", formData);
        } else {
            setStep((prev) => prev + 1);
        }
    }
    const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

    const quoteDetails = useMemo(() => {
        let subtotal = 0;
        let basePrice = 0;
        const items: { name: string; price: number | string }[] = [];
        
        if (!formData.serviceType) return { items, total: 0 };

        const serviceName = serviceOptions[formData.serviceType].name;
        let itemName = serviceName;

        if (formData.serviceType === 'photography' && formData.photographySubType) {
             const subTypeName = photographySubServices[formData.photographySubType].name;
             itemName = `${serviceName}: ${subTypeName}`;

            switch (formData.photographySubType) {
                case 'event':
                    if (formData.photoEventDuration === 'perHour') {
                        if (formData.photoEventHours > 0) {
                            basePrice = 600 + (formData.photoEventHours - 1) * 300;
                        } else {
                            basePrice = 0;
                        }
                        itemName += ` (${formData.photoEventHours} hrs)`;
                    } else if (formData.photoEventDuration === 'halfDay') {
                        basePrice = 1200;
                        itemName += ' (Half Day)';
                    } else { // fullDay
                        basePrice = 2000;
                        itemName += ' (Full Day)';
                    }
                    break;
                case 'real_estate': {
                    const propPrices = {
                        studio: [500, 800],
                        '1-bedroom': [700, 1100],
                        '2-bedroom': [900, 1400],
                        '3-bedroom': [1100, 1600],
                        villa: [1500, 3000],
                    };
                    let totalRealEstatePrice = 0;
                    const propertyCounts: { [key: string]: { count: number, furnished: number } } = {};
            
                    formData.photoRealEstateProperties.forEach(prop => {
                        const price = propPrices[prop.type][prop.furnished ? 1 : 0];
                        totalRealEstatePrice += price;

                        const key = `${prop.type} (${prop.furnished ? 'Furnished' : 'Unfurnished'})`;
                        if (!propertyCounts[key]) {
                            propertyCounts[key] = { count: 0, furnished: prop.furnished ? 1 : 0 };
                        }
                        propertyCounts[key].count++;
                    });
            
                    basePrice = totalRealEstatePrice;
                    const summary = Object.entries(propertyCounts)
                        .map(([desc, { count }]) => `${count} x ${desc.replace(/\b\w/g, l => l.toUpperCase())}`)
                        .join(', ');
                    itemName += ` (${summary})`;
                    break;
                }
                case 'headshots':
                    basePrice = formData.photoHeadshotsPeople * 350;
                    itemName += ` (${formData.photoHeadshotsPeople} people)`;
                    break;
                case 'product':
                    const productPricePerPhoto = formData.photoProductComplexity === 'simple' ? 100 : 400;
                    basePrice = formData.photoProductPhotos * productPricePerPhoto;
                    itemName += ` (${formData.photoProductPhotos} photos @ ${productPricePerPhoto} AED/photo, ${formData.photoProductComplexity})`;
                    break;
                case 'food':
                    const foodPricePerPhoto = formData.photoFoodComplexity === 'simple' ? 150 : 400;
                    basePrice = formData.photoFoodPhotos * foodPricePerPhoto;
                    itemName += ` (${formData.photoFoodPhotos} photos @ ${foodPricePerPhoto} AED/photo, ${formData.photoFoodComplexity})`;
                    break;
                case 'fashion':
                    const fashionPrices = { essential: 1500, standard: 3000, premium: 5000 };
                    basePrice = fashionPrices[formData.photoFashionPackage];
                    itemName += ` (${formData.photoFashionPackage.charAt(0).toUpperCase() + formData.photoFashionPackage.slice(1)} Package)`;
                    break;
                case 'wedding':
                    const weddingPrices = { essential: 5000, standard: 12000, premium: 25000 };
                    basePrice = weddingPrices[formData.photoWeddingPackage];
                    itemName += ` (${formData.photoWeddingPackage.charAt(0).toUpperCase() + formData.photoWeddingPackage.slice(1)} Package)`;
                    break;
            }
        } else if (formData.serviceType === 'video' && formData.videoSubType) {
            const subTypeName = videoSubServices[formData.videoSubType].name;
            itemName = `${serviceName}: ${subTypeName}`;

            switch(formData.videoSubType) {
                case 'event':
                     if (formData.videoEventDuration === 'perHour') {
                        if (formData.videoEventHours > 0) {
                            basePrice = 800 + (formData.videoEventHours - 1) * 400;
                        } else {
                            basePrice = 0;
                        }
                        itemName += ` (${formData.videoEventHours} hrs)`;
                    } else if (formData.videoEventDuration === 'halfDay') {
                        basePrice = 1200;
                        itemName += ' (Half Day)';
                    } else { // fullDay
                        basePrice = 2200;
                        itemName += ' (Full Day)';
                    }
                    break;
                case 'corporate':
                    basePrice = 3000;
                    itemName += ' (The Basic Package)';
                    break;
                case 'promo':
                    basePrice = 8000;
                    itemName += ' (The Foundation Package)';
                    break;
                case 'real_estate':
                    const prices = { studio: 700, '1-bedroom': 1000, '2-bedroom': 1350, '3-bedroom': 1750, villa: 2500 };
                    basePrice = prices[formData.videoRealEstatePropertyType];
                    itemName += ` (${formData.videoRealEstatePropertyType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})`;
                    break;
                case 'wedding':
                    basePrice = formData.videoWeddingPrice;
                    itemName += ' (Package)';
                    break;
            }
        } else if (formData.serviceType === 'timelapse') {
            itemName = `${serviceName}`;
            const rates = {
                hours: 1000,
                days: 8000,
                weeks: 22000,
                months: 42000,
            };
            const rate = rates[formData.timelapseInterval];
            const duration = formData.timelapseInterval === 'hours' ? formData.timelapseHours : formData.timelapseDuration;
            basePrice = rate * duration;

            const cameraCostMultiplier = 1 + (formData.timelapseCameras - 1) * 0.5;
            basePrice *= cameraCostMultiplier;

            itemName += ` (${duration} ${formData.timelapseInterval}, ${formData.timelapseCameras} ${formData.timelapseCameras > 1 ? 'cameras' : 'camera'})`;

        } else if (formData.serviceType === '360tours' && formData.toursSubType) {
            const subTypeName = toursSubServices[formData.toursSubType].name;
            itemName = `${serviceName}: ${subTypeName}`;
            const prices = { studio: 750, '1-bedroom': 1000, '2-bedroom': 1350, '3-bedroom': 1750, 'villa': 3000 };
            basePrice = prices[formData.toursSubType as keyof typeof prices];
        } else if (formData.serviceType === 'post' && formData.postSubType) {
            const subTypeName = postProductionSubServices[formData.postSubType].name;
            itemName = `${serviceName}: ${subTypeName}`;

            if (formData.postSubType === 'video') {
                switch(formData.postVideoEditingType) {
                    case 'perHour':
                        basePrice = formData.postVideoEditingHours * 250;
                        itemName += ` (${formData.postVideoEditingHours} hrs)`;
                        break;
                    case 'perMinute':
                        basePrice = formData.postVideoEditingMinutes * formData.postVideoEditingPerMinutePrice;
                        itemName += ` (${formData.postVideoEditingMinutes} min @ ${formData.postVideoEditingPerMinutePrice} AED/min)`;
                        break;
                    case 'social':
                        basePrice = formData.postVideoEditingSocialPrice;
                        itemName += ` (Social Media Edit)`;
                        break;
                }
            } else { // photo
                 const photoEditingPrices = {
                    basic: 20,
                    advanced: 50,
                    restoration: 100,
                };
                const pricePerPhoto = photoEditingPrices[formData.postPhotoEditingType];
                basePrice = formData.postPhotoEditingQuantity * pricePerPhoto;
                itemName += ` (${formData.postPhotoEditingQuantity} photos @ ${pricePerPhoto} AED/photo)`;
            }
        } else if (formData.serviceType === 'photogrammetry' && formData.photogrammetrySubType) {
            const subTypeName = photogrammetrySubServices[formData.photogrammetrySubType].name;
            itemName = `${serviceName}: ${subTypeName}`;
            const prices = {
                small_scale: 1500,
                residential_exterior: 4000,
                residential_full: 8000,
                commercial: 18000,
                large_scale: 27000,
            };
            basePrice = prices[formData.photogrammetrySubType as keyof typeof prices];
        } else if (formData.serviceType === 'training' && formData.trainingSubType) {
            const subTypeName = trainingSubServices[formData.trainingSubType].name;
            itemName = `${serviceName}: ${subTypeName}`;
            if (formData.trainingSubType === 'one-on-one') {
                basePrice = formData.trainingHours * 400;
                itemName += ` (${formData.trainingHours} hr/s)`;
            } else { // groups
                basePrice = formData.trainingHours * 600;
                itemName += ` (${formData.trainingHours} hr/s)`;
            }
        }


        subtotal += basePrice;
        if (basePrice > 0) {
            items.push({ name: itemName, price: basePrice });
        }
        
        // Photography Add-ons
        const p = formData.photographySubType;
        if (formData.serviceType === 'photography' && (p === 'event' || p === 'fashion' || p === 'wedding')) {
            if (formData.secondCamera) {
                const price = basePrice; // +100%
                items.push({ name: 'Second Camera', price });
                subtotal += price;
            }
        }

        // Video Add-ons
        const v = formData.videoSubType;
        if (formData.serviceType === 'video') {
            if (v === 'event' || v === 'wedding') {
                 if (formData.secondCamera) {
                    const price = basePrice; // +100%
                    items.push({ name: 'Second Camera', price });
                    subtotal += price;
                }
            }

            if (v === 'corporate') {
                if (formData.videoCorporateExtendedFilming === 'halfDay') { subtotal += 1500; items.push({ name: 'Extended Filming (Half-Day)', price: 1500 }); }
                if (formData.videoCorporateExtendedFilming === 'fullDay') { subtotal += 3500; items.push({ name: 'Extended Filming (Full-Day)', price: 3500 }); }
                if (formData.videoCorporateTwoCam) { subtotal += 950; items.push({ name: 'Two-Camera Interview Setup', price: 950 }); }
                if (formData.videoCorporateScripting) { subtotal += 1500; items.push({ name: 'Full Scriptwriting & Storyboarding', price: 1500 }); }
                if (formData.videoCorporateEditing) { subtotal += 1000; items.push({ name: 'Advanced Editing & Color Grading', price: 1000 }); }
                if (formData.videoCorporateGraphics) { subtotal += 800; items.push({ name: 'Custom Motion Graphics', price: 800 }); }
                if (formData.videoCorporateVoiceover) { subtotal += 500; items.push({ name: 'Professional Voice-over', price: 500 }); }
            }
            
            if (v === 'promo') {
                if (formData.videoPromoFullDay) { subtotal += 5000; items.push({ name: 'Additional Full-Day Production', price: 5000 }); }
                if (formData.videoPromoMultiLoc > 0) { subtotal += formData.videoPromoMultiLoc * 2000; items.push({ name: `Additional Locations (x${formData.videoPromoMultiLoc})`, price: formData.videoPromoMultiLoc * 2000 }); }
                if (formData.videoPromoConcept) { subtotal += 3000; items.push({ name: 'Advanced Storyboarding & Concept', price: 3000 }); }
                if (formData.videoPromoGraphics) { subtotal += 4000; items.push({ name: 'Advanced 2D/3D Motion Graphics', price: 4000 }); }
                if (formData.videoPromoSound) { subtotal += 3000; items.push({ name: 'Custom Sound Design & Mixing', price: 3000 }); }
                if (formData.videoPromoMakeup) { subtotal += 2000; items.push({ name: 'Hair & Makeup Artist', price: 2000 }); }
            }
        }

        // Time-Lapse Add-ons (the old one)
        if (formData.serviceType === 'timelapse') {
            if (formData.timelapseExtraCamera) {
                const price = basePrice; // +100%
                items.push({ name: 'Extra Camera', price });
                subtotal += price;
            }
        }
        
        // Training Add-ons
        if (formData.serviceType === 'training') {
            if (formData.trainingSubType === 'one-on-one') {
                if (formData.trainingOneOnOneCameraRental) {
                    const price = 150 * formData.trainingHours;
                    subtotal += price;
                    items.push({ name: 'Camera Rental', price });
                }
                if (formData.trainingOneOnOneClassroomRental) {
                    const price = 150 * formData.trainingHours;
                    subtotal += price;
                    items.push({ name: 'Classroom Rental', price });
                }
            } else { // groups
                if (formData.trainingGroupsClassroomRental) {
                    const price = 250 * formData.trainingHours;
                    subtotal += price;
                    items.push({ name: 'Classroom Rental', price });
                }
            }
        }
        
        let total = subtotal;

        // Studio Rental Fee
        if (formData.locationType === 'Studio' && formData.serviceType !== 'post') {
            let studioFee = 0;
            let studioItemName = 'Studio Rental';
            let duration = '';
            
            if (formData.serviceType === 'photography' && formData.photographySubType === 'event') {
                duration = formData.photoEventDuration;
            } else if (formData.serviceType === 'video' && formData.videoSubType === 'event') {
                duration = formData.videoEventDuration;
            }

            switch(duration) {
                case 'perHour':
                    const hours = formData.serviceType === 'photography' ? formData.photoEventHours : formData.videoEventHours;
                    studioFee = hours * 700;
                    studioItemName += ` (${hours} hrs)`;
                    break;
                case 'halfDay':
                    studioFee = 2000;
                    studioItemName += ' (Half Day)';
                    break;
                case 'fullDay':
                    studioFee = 3000;
                    studioItemName += ' (Full Day)';
                    break;
            }

            if (studioFee > 0) {
                items.push({ name: studioItemName, price: studioFee });
                total += studioFee;
            }
        }


        // Universal Modifiers
        const travelFees: { [key: string]: number } = {
            dubai: 0,
            sharjah: 100,
            'abu-dhabi': 200,
            other: 200,
        };
        const travelFee = travelFees[formData.location] || 0;
        if (travelFee > 0 && formData.serviceType !== 'post') {
            items.push({ name: `Logistics & Travel Fee (${formData.location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())})`, price: travelFee });
            total += travelFee;
        }

        if (formData.deliveryTimeline === 'rush' && formData.serviceType !== 'post') {
            const rushFee = subtotal * 0.5;
            if (rushFee > 0) {
              items.push({ name: 'Rush Delivery (24 hours)', price: rushFee });
              total += rushFee;
            }
        }

        return { items, total };
    }, [formData]);

    const handlePrint = () => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let currentY = 0;

        // --- Quote Number Generation ---
        const now = new Date();
        const year = now.getFullYear().toString().slice(-1);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const quoteNo = `${year}${month}${day}${hours}${minutes}`;

        // Colors from your theme (approximated from HSL)
        const primaryColor = [99, 88, 140]; // hsl(250, 45%, 45%)
        const accentColor = [121, 111, 160];
        const backgroundColor = [248, 249, 250]; // A very light gray for background
        const textColor = [51, 51, 51];
        const lightTextColor = [100, 100, 100];
        const white = [255, 255, 255];
        
        // Add logo
        const logoUrl = `${window.location.origin}${repoName}/4.png`;
        doc.addImage(logoUrl, 'PNG', margin, 10, 50, 17);

        // -- Header --
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text("QUOTE", pageWidth - margin, 17, { align: 'right' });
        
        currentY = 40;

        // --- Heading Title & Project Brief ---
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const serviceName = formData.serviceType ? serviceOptions[formData.serviceType].name : 'Project';
        
        let subTypeName = '';
        if(formData.serviceType === 'photography' && formData.photographySubType) subTypeName = photographySubServices[formData.photographySubType].name;
        else if (formData.serviceType === 'video' && formData.videoSubType) subTypeName = videoSubServices[formData.videoSubType].name;
        else if (formData.serviceType === 'timelapse') subTypeName = ''; // No sub-type name for timelapse
        else if (formData.serviceType === '360tours' && formData.toursSubType) subTypeName = toursSubServices[formData.toursSubType].name;
        else if (formData.serviceType === 'post' && formData.postSubType) subTypeName = postProductionSubServices[formData.postSubType].name;
        else if (formData.serviceType === 'photogrammetry' && formData.photogrammetrySubType) subTypeName = photogrammetrySubServices[formData.photogrammetrySubType].name;
        else if (formData.serviceType === 'training' && formData.trainingSubType) subTypeName = trainingSubServices[formData.trainingSubType].name;

        const headingTitle = subTypeName ? `${serviceName}: ${subTypeName}` : serviceName;
        const titleLines = doc.splitTextToSize(headingTitle, pageWidth - (margin * 2));
        doc.text(titleLines, margin, currentY);
        currentY += (titleLines.length * 8) + 8;
        
        if (formData.message) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
            const briefLines = doc.splitTextToSize(`"${formData.message}"`, pageWidth - (margin * 2));
            doc.text(briefLines, margin, currentY);
            currentY += (briefLines.length * 4) + 10;
        }

        // -- Client & Quote Info --
        currentY += 5;
        doc.setLineWidth(0.5);
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text("BILLED TO", margin, currentY);
    
        const quoteDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const quoteInfoX = pageWidth / 2 + 30;
        doc.text("QUOTE #", quoteInfoX, currentY);
        doc.text("DATE", quoteInfoX, currentY + 7);
    
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        if (formData.name) doc.text(formData.name, margin, currentY + 7);
        if (formData.email) doc.text(formData.email, margin, currentY + 14);
        if (formData.phone) doc.text(formData.phone, margin, currentY + 21);
    
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.text(quoteNo, quoteInfoX + 30, currentY);
        doc.text(quoteDate, quoteInfoX + 30, currentY + 7);
    
        currentY += 30;
    
        // -- Table Header --
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(margin, currentY, pageWidth - (margin * 2), 10, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(white[0], white[1], white[2]);
        doc.text('DESCRIPTION', margin + 5, currentY + 7);
        doc.text('AMOUNT (AED)', pageWidth - margin - 5, currentY + 7, { align: 'right' });
        currentY += 10;
    
        // -- Table Items --
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        quoteDetails.items.forEach((item, index) => {
            if (currentY > pageHeight - 60) { // Check for footer space
                doc.addPage();
                doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
                currentY = margin;
            }
            
            const isEven = index % 2 === 0;
            if(isEven) {
                doc.setFillColor(white[0], white[1], white[2]);
                doc.rect(margin, currentY, pageWidth - margin * 2, 12, 'F');
            }

            const price = typeof item.price === 'number' ? `${item.price.toLocaleString()}` : item.price;
            const itemLines = doc.splitTextToSize(item.name, (pageWidth / 2));

            const itemLineHeight = (itemLines.length * 5);
            const yPos = currentY + (12 - itemLineHeight) / 2 + 3;

            doc.text(itemLines, margin + 5, yPos);
            doc.text(price, pageWidth - margin - 5, yPos, { align: 'right' });
            currentY += 12;
        });

        // -- Total Section --
        let totalSectionY = currentY + 10;
        if (totalSectionY > pageHeight - 60) {
            doc.addPage();
            doc.setFillColor(backgroundColor[0], backgroundColor[1], backgroundColor[2]);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            totalSectionY = margin;
        }

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(pageWidth / 2 - 20, totalSectionY, (pageWidth / 2) + 20 - margin, 20, 'F');
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(white[0], white[1], white[2]);
        doc.text('Total Estimate', pageWidth / 2 - 10, totalSectionY + 13);
        doc.text(`${quoteDetails.total.toLocaleString()} AED`, pageWidth - margin, totalSectionY + 13, { align: 'right' });
    
        // -- Footer --
        const footerY = pageHeight - 30;
        doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        doc.setFontSize(8);
        doc.setTextColor(lightTextColor[0], lightTextColor[1], lightTextColor[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Terms: 50% advance payment to confirm booking. This quote is valid for 30 days.', margin, footerY + 8);
        
        doc.setFont('helvetica', 'bold');
        doc.text('hi@studioo.ae | +971 58 658 3939 | studioo.ae', pageWidth - margin, footerY + 8, { align: 'right' });
    
        doc.save("studioo-quote.pdf");
    };
    
    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Step1Service
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleRealEstateChange={handleRealEstateChange}
                        addRealEstateProperty={addRealEstateProperty}
                        removeRealEstateProperty={removeRealEstateProperty}
                        validationError={validationError}
                    />
                );
            case 2:
                return (
                    <Step2Details
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                );
            case 3:
                return (
                     <Step3Contact
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                );
            case 4:
                return (
                     <Step4Quote
                        formData={formData}
                        quoteDetails={quoteDetails}
                        handlePrint={handlePrint}
                    />
                )
            default:
                return null;
        }
    };
    
    const stepTitles = ["Service", "Details", "Contact", "Quote"];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-3 w-full">
            <Card className="w-full relative flex flex-col min-h-[700px] bg-card/75 backdrop-blur-sm border-border">
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex justify-center items-center mb-4">
                        {stepTitles.map((title, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center text-center px-1">
                                    <div className={cn(
                                        `w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2`,
                                        index + 1 < step ? 'bg-primary border-primary text-primary-foreground' : 'bg-secondary border-border',
                                        index + 1 === step ? 'bg-primary border-primary text-primary-foreground' : '',
                                    )}>
                                        {index + 1}
                                    </div>
                                    <p className={cn(
                                        `mt-2 text-xs font-medium transition-colors hidden md:block`,
                                        index + 1 <= step ? 'text-foreground' : 'text-muted-foreground'
                                    )}>{title}</p>
                                </div>
                                {index < stepTitles.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 sm:mx-2 transition-colors duration-300 ${index + 1 < step ? 'bg-primary' : 'bg-border'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-center pt-4 sm:pt-8">{step === 4 ? 'Your Quote is Ready' : `Step ${step}: ${stepTitles[step-1]}`}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow p-2 sm:p-6">
                    {renderStep()}
                </CardContent>
                {(step > 1 || (step === 1 && formData.serviceType)) && (
                    <CardFooter className="flex items-center justify-between gap-4 p-4 sm:p-6 bg-background/80 backdrop-blur-sm mt-auto border-t">
                        <div className="hidden sm:flex gap-2 w-full sm:w-auto">
                            {step > 1 && (
                                <Button variant="outline" onClick={prevStep} size="lg" className="w-full sm:w-auto" disabled={isSubmitting}><ArrowLeft className="mr-2 h-5 w-5"/> Previous</Button>
                            )}
                            {step > 1 && step < 4 && (
                                <Button variant="ghost" onClick={handleReset} size="lg" className="text-muted-foreground" disabled={isSubmitting}><RotateCcw className="mr-2 h-5 w-5" /> Reset</Button>
                            )}
                        </div>
        
                        <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
                             {step > 1 && (
                                <Button variant="outline" onClick={prevStep} size="lg" className="flex-1 sm:hidden shadow-lg" disabled={isSubmitting}><ArrowLeft className="mr-2 h-5 w-5"/> Back</Button>
                            )}
                            {step < 4 ? (
                                <Button onClick={nextStep} size="lg" className={cn("sm:w-auto shadow-lg sm:shadow-none flex-1", step === 1 && 'sm:ml-auto')} disabled={isSubmitting}>
                                  {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (step === 3 ? 'See Your Quote' : 'Next')}
                                  {!isSubmitting && step !== 3 && <ArrowRight className="ml-2 h-5 w-5"/>}
                                </Button>
                            ) : (
                                <Button onClick={handleReset} size="lg" className="w-full sm:w-auto shadow-lg sm:shadow-none"><RotateCcw className="mr-2 h-5 w-5" /> Start New Quote</Button>
                            )}
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
            <QuoteSummary quoteDetails={quoteDetails} formData={formData} />
        </div>
      </div>
    );
}

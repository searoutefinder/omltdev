import { useEffect } from "react";


//interface PreloadImagesProps {
interface PreloadImagesProps {
    images: string[];
    onLoad: () => void;
}


export const usePreloadImages = ({ images, onLoad }: PreloadImagesProps) => {
    
    useEffect(() => {
        if (images.length === 0) return;

        const imageElements = images.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        let loadedCount = 0;

        imageElements.forEach((img) => {
            img.onload = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    onLoad();
                }
            };
        });

        return () => {
            imageElements.forEach((img) => {
                img.onload = null; // clean up the onload handler
            });
        };
    }, [images, 
        onLoad]);
}
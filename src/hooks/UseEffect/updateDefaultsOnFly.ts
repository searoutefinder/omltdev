import { useEffect, useRef } from 'react';
import {normalizeName} from '../../utils/Text'

interface UpdateDefaultsOnFlyProps { 
    mapState: any;
    dataLoaded: boolean;
    geojsonPreserveRef: any,
    geojsonParkingRef?: any;
    activePreserve: string | null;
    setPreserveInfo: (preserveInfo: any) => void;   
    setActivePreserve: (preserve: string) => void;
}


//#fix move into webworkers - clean this up
export const UpdateDefaultsOnFly = ({ 
    mapState, 
    dataLoaded, 
    geojsonPreserveRef, 
    geojsonParkingRef, 
    activePreserve, 
    setActivePreserve, 
    setPreserveInfo }: UpdateDefaultsOnFlyProps) => {
    
    const defaultPreserveName = useRef<string | null>(null);
    
    useEffect(() => { 
        if (!dataLoaded) return; 
        

        // debounce after data load
        if (activePreserve === null && mapState.webMapName) {
            defaultPreserveName.current = null;
            setPreserveInfo(null);          
        };

        if (activePreserve && activePreserve !== defaultPreserveName.current) {
            //insert space between capital letters
            const feature = geojsonPreserveRef.current.features.find((feature: any) => normalizeName(feature.properties?.preserve_name) === activePreserve);
            if (!feature) return;
            const { preserve_name, 
                    preserve_type, 
                    owner, 
                    description, 
                    contact_email: email} = feature.properties;

            if (!preserve_name) return;
            let parking_address: string | null = null;
            let parking_coordinates: any = null;

            if (geojsonParkingRef?.current?.features?.length) {
                const parking_lot = geojsonParkingRef.current.features.find(
                    (feature: any) => normalizeName(feature.properties?.preserve_name) === activePreserve
                );
                if (parking_lot) {
                    parking_address = parking_lot.properties?.address ?? null;
                    parking_coordinates = parking_lot.geometry?.coordinates ?? null;
                }
            }

            //mandatory fields in preserve template
            if (!preserve_name || !owner) return;
    
            setPreserveInfo((prev: any) => ({
              ...prev,
              webMapName: preserve_name,
              preserveType: preserve_type,
              owner: owner,
              desc: description,
              email: email,
              parking_address: parking_address,
              parking_coordinates: parking_coordinates
            }));

            defaultPreserveName.current = preserve_name;
            
        }
    }, [activePreserve, 
        dataLoaded, 
        geojsonParkingRef, 
        geojsonPreserveRef, 
        mapState, 
        setActivePreserve, 
        setPreserveInfo]);
};

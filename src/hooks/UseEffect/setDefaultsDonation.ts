import { useEffect, MutableRefObject } from 'react';
import { DonationInfoProps } from '../../types/preserve-map';


interface SetDonationDefaultsProps {
    styleLoaded: boolean;
    dataLoaded: boolean;
    activePreserve: string | null;
    masterTableData: any,
    trailData: any | null;
    POIsData: any | null;
    hasSetDonationInfo: MutableRefObject<boolean>;
    setDonationType: (donationType: string | null | boolean) => void;
    setDonationInfo: (donationInfo: DonationInfoProps) => void;
}


//#fix - #Loop - move into web-worker
export const SetDonationDefaults = ({ 
    styleLoaded, 
    dataLoaded,
     activePreserve,
     masterTableData, 
     trailData, 
     POIsData, 
     hasSetDonationInfo, 
     setDonationType, 
     setDonationInfo }: SetDonationDefaultsProps) => {

    

    useEffect(() => {
        if (styleLoaded && dataLoaded && activePreserve && masterTableData) {

            const preserveNameFormatted = activePreserve.replace(/([A-Z])/g, ' $1').trim();

            const firstFeatureWithDonLink = masterTableData?.features.find((feature: any) => {
                const preserve_name = feature.properties.preserve_name;
                const donation_url = feature.properties.donation_url;
                if (!donation_url) return false;
                return (preserve_name === preserveNameFormatted);
            });

          
            if (firstFeatureWithDonLink) {                
                const feature = firstFeatureWithDonLink.properties;
                const template = feature.donation_purpose;
                let POI_type = null;

                if (template === 'POIs') {
                    POI_type = POIsData?.features.find((feature: any) => {
                        return feature.properties.name === feature.donation_object;
                    })?.properties.POI_type;
                };

                setDonationInfo({
                    template: template,
                    donation_object: feature.donation_object,
                    donation_url: feature.donation_url,
                    donation_url_text: feature.donation_url_text,
                    donation_text: feature.donation_description,
                    contact_email: feature.contact_email,
                    POI_type: POI_type,
                    activity: feature.dominant_activity,
                });


                hasSetDonationInfo.current = true;
                setDonationType(template);
            }  else {
                    setDonationType(false);
                    setDonationInfo({
                        template: null,
                        donation_object: null,
                        donation_url: null,
                        donation_url_text: null,
                        contact_email: null,
                        POI_type: null,
                        donation_text: null,
                        activity: null,
                    });
                    hasSetDonationInfo.current = false;
                }
        }

    }, [activePreserve,
        styleLoaded,
        dataLoaded,
        masterTableData,
        POIsData,
        trailData,
        hasSetDonationInfo,
        setDonationInfo,
        setDonationType]
    );

    return null;
};

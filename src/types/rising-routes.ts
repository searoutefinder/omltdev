export interface RisingRoutesProps {
    isMobile: boolean;
}

export interface FiltersType {
        selectedState: string;
        selectedCity: string;
        selectedOrgType: string;
    };

export interface FiltersOptionsType {
    orgTypeOptions: string[];
    stateOptions: string[];
    cityOptions: string[];
}    
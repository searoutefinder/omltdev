import {allowedActivityIconsMap, prohibitedActivityIconsMap} from "../../constants/dataMapping";


export const getDistanceWithUnit = (distance: number) => {

    if (distance <= 0.095) {
        return `${(distance * 5280).toFixed(0)} feet`
    } else {
        return `${distance} miles`
    }
};



export const getActivityIcons= (allowedActs: string[], prohibitedActs: string[]) => {
    const allowedIcons = allowedActs.map((act) => allowedActivityIconsMap[act] || null);
    const prohibitedIcons = prohibitedActs.map((act) => prohibitedActivityIconsMap[act] || null);

    return [...allowedIcons, ...prohibitedIcons];
}

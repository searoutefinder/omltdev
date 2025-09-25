import { Activities, ActivityIcon, BadgeContainer, BadgeOne, BadgeTwo} from '../Elements';
import { allowedActivityIconsMap, prohibitedActivityIconsMap } from '../../../../constants/dataMapping';
import { parseStringsToArray } from '../../../../utils/Text';
import { ImageProps, ActivitiesSectionProps} from '../../../../types/cards';



//Activity Icons Section ------------------------------------------------------
export const ActivityIconsSection = ({ allowedActs, prohibitedActs }: ActivitiesSectionProps) => {
    // 1. Parse activities strings to arrays
    const allowedActsParsed: string[] = parseStringsToArray(allowedActs);
    const prohibitedActsParsed: string[] = parseStringsToArray(prohibitedActs);

    // 2. Build arrays of icon srcs
    const allowedActsURLs = allowedActsParsed.map(act => allowedActivityIconsMap[act]).filter(Boolean);
    const prohibitedActsURLs = prohibitedActsParsed.map(act => prohibitedActivityIconsMap[act]).filter(Boolean);

    return (
        <Activities>
            {prohibitedActsURLs.map((act: string, index: number) => (
                <ActivityIcon key={index} src={act} alt={'image' + index + 1} />
            ))}
            {allowedActsURLs.map((act: string, index: number) => (
                <ActivityIcon key={index} src={act} alt={'image' + index} />
            ))}
        </Activities>
    )
}


export const ReturnLogoElement = (logoURL: ImageProps[] | []) => {

    const logoRegex = /Maintainer|Owner|maintainer|owner/;
    const logos = logoURL?.filter((a: any) => logoRegex.test(a.name));


    if (logos?.length === 0) return (
        <BadgeContainer>
            <BadgeOne src={'/img/raster/LeftSidebar/placeholder_owner_logo.png'} alt='Placeholder_owner_logo' />
        </BadgeContainer>
    );

    const maintener = logos?.find((item) => item.name?.toLowerCase().includes('maintainer'));
    const owner = logos?.find((item) => item.name?.toLowerCase().includes('owner'));

    if (logos.length === 1) {
        return (
            <BadgeContainer>
                <BadgeOne src={maintener ? maintener.url : logos[0].url} alt="Logo 1" />
            </BadgeContainer>
        );
    }

    if (logos.length >= 2) {
        return (
            <BadgeContainer>
                <BadgeOne src={maintener?.url} />
                <BadgeTwo src={owner?.url} />
            </BadgeContainer>
        );
    }
};
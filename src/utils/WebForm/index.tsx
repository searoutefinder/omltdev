import stringSimilarity from 'string-similarity';

interface GetBestMatchProps {
    templateKey: string;
    returnedKeys: string[];
}

export const getBestMatch = ({
    templateKey,
    returnedKeys,
}: GetBestMatchProps): string => {
    const target = templateKey.toLowerCase().replace(/\s+/g, "");
    const normalizedKeys = returnedKeys.map((key) =>
        key.toLowerCase().replace(/\s+/g, "")
    );
    const best = stringSimilarity.findBestMatch(target, normalizedKeys);
    return returnedKeys[best.bestMatchIndex] || "";
    ;
};

export const createMap = (items: any[]) => {
    if (!Array.isArray(items)) return {};
    return items.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};


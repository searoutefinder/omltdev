interface TextProps {
    text: string;
    maxLength: number;
    }

// Truncate text to a certain length
export const truncateText = ({text, maxLength}:TextProps) => { 
    if (!text) return text;
    if (text.length <= maxLength) return text;
 let truncated = text.substring(0, maxLength);

 truncated = truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(" ")));
 return `${truncated}...`;
};


// Parse strings to arrays
export function parseStringsToArray(str: string) {
    try {
        const match = str.match(/\[(.*?)\]/);
        if (match) {
            return JSON.parse(match[0]);
        } 
        return JSON.parse(str);
    } catch {
        return [];
    }
};

// //Parse array objects to lowercase
// export function parseArrayObjectToLowercase(arr: string) {
//     return arr.map((item) => item);
// };

// Helper to convert "Pole Hill Pond" => "PoleHillPond", "Anthony's Nose Preserve" => "AnthonysNosePreserve"
export const normalizeName = (str:string) => {
    return str
      .replace(/[^a-zA-Z0-9 ]/g, "") // remove punctuation 
      .split(" ")                    // split by space
      .map(part => part.trim())     // trim each word
      .filter(Boolean)              // remove empty strings
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
      .join("");                    // join back without spaces
  };


// get name by preserve_name (supports both {attributes:{}} and flat objects).
export const getPreserveName = (item: any) =>
                (item?.attributes?.preserve_name ?? item?.preserve_name ?? "")
                    .toString()
                    .trim();



// ======= MATCH PRESERVE SLUG ======= //
export const normalize = (s: string): string =>
  (s || "")
    .toLowerCase()
    .normalize("NFD") // decompose diacritics
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/&/g, " ") // replace "&" with space
    .replace(/[^a-z0-9\s]/g, " ") // replace everything not [a-z0-9 ] with space
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();

export const matchScore = (candidate: string, target: string): number => {
  const A = normalize(candidate).replace(/\s+/g, "");
  const B = normalize(target).replace(/\s+/g, "");

  if (!A || !B) return -1;

  // common prefix length
  let pref = 0;
  while (pref < Math.min(A.length, B.length) && A[pref] === B[pref]) pref++;

  let score = pref;

  // if one contains the other
  if (A.includes(B)) score += B.length * 2;
  if (B.includes(A)) score += A.length * 2;

  // penalize if lengths are very different
  const lenDiff = Math.abs(A.length - B.length);
  score -= Math.min(lenDiff, Math.floor(Math.max(A.length, B.length) / 3));

  return score;
};

// types if not any defined
interface PreserveFeature {
  properties: {
    OBJECTID: number;
    preserve_name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface MatchResult {
  objectId: number;
  label: string;
  score: number;
}


// Find the best-matching preserve between preserve name and slug using fuzzy mathing
export const pickBestBySlug = (
  features: PreserveFeature[],
  targetName: string
): MatchResult | null => {
  const scored: MatchResult[] = features
    .map((f) => ({
      objectId: f?.properties?.OBJECTID,
      label: f?.properties?.preserve_name || "",
      score: matchScore(f?.properties?.preserve_name || "", targetName),
    }))
    .filter((x) => x.objectId != null)
    .sort((a, b) => b.score - a.score);

  const BEST = scored[0];
  if (!BEST) return null;
  if (BEST.score < 1) return null; // optional threshold

  return BEST;
};

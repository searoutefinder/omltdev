//types
interface SvgProps {
  svgContent: string;
  canvasSize: number;
}

//init cache for blobs
const pngCache = new Map<string, string>();

//1. svgAsPng
export const loadSvgAsPng = async (props: SvgProps): Promise<string> => {
  const { svgContent, canvasSize = 56 } = props;

  if (pngCache.has(svgContent)) {
    return pngCache.get(svgContent)!;
  }

  return new Promise((resolve, reject) => {
    //create canvas  
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const context = canvas.getContext('2d');

    if (!context) {
      reject("Canvas is not available");
      return;
    }

    //svg to blob
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    //attach png blob to canvas 
    img.onload = () => {
      try {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 4, 4, 56, 56); 
        URL.revokeObjectURL(url); 
        const pngUrl = canvas.toDataURL("image/png");
        pngCache.set(svgContent, pngUrl);//cache the result
        resolve(pngUrl);
      } catch (error) {
        reject(`${error}`);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url); 
      reject("Error on loading SVG content as blob");
    };

    img.src = url;
  });
};

//2.raw pngs
// export const loadPng = async() => {
//   //content
// }

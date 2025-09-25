
//styles
const container = (containerPadding: string) => `
    display: flex;
    flex-direction: column; 
    padding: ${containerPadding}; 
    align-items: flex-start; 
    justify-content: center; 
    line-height:1;
    min-width: 200px;
    gap:16px;
    user-select: none;
    z-index: 1000;
`;

const separator = `
    dispay: flex;
    height: 1px; 
    width:100%;
    padding: 0;
    margin:0;
    background-color:#c2c2c2;
`;


const title = (fontSizeTitle: string) => `
  font-size: ${fontSizeTitle}; 
  font-weight: 600;
  color: #000000;
  margin:0;
  padding:0;
`;

const infoSection = `
  display:flex;
  width:95%;
  flex-direction: column;
  gap:12px;
  margin:0;
  padding: 4px 0;
  justify-content: center;
  align-items: flex-start;
`;

const infoRow = `
    display:flex;
    width:100%;
    flex-direction: row;
    gap: 4px;
    justify-content: space-between;
    align-items: center;
 `;

const attributes = ` 
    display:flex;
    gap:4px; 
    align-items: center;
    text-align: left;
`;

const infoText = (fontSizeInfo: string) => `
    font-size: ${fontSizeInfo};
    font-weight: 600;
    color: #656B7C;
    margin:0;
    padding:0;
 `;

const infoIcon = (iconSize: string) => `
    position: relative;
    width:${iconSize};
    height:${iconSize};
    bottom:2px;
    left:0;
`;

const value = (fontSizeValue: string) => `
    display: flex;
    font-size: ${fontSizeValue};
    font-weight: 700;
    align-items: baseline;
    text-align: left; 
`;


interface PopUpStyleProps {
  isMobile: boolean;
  parkingSurface: string;
  parkingSpots: number;
  parkingArea: number;
  notes: string;
};

//#fix - memoize


//func
export const getPopUpStyleParking = ({ isMobile, parkingSurface, parkingSpots, parkingArea, notes }: PopUpStyleProps) => {

  //styles
  const containerPadding = isMobile ? '12px' : '16px';
  const fontSizeTitle = isMobile ? '16px' : '18px';
  const fontSizeInfo = isMobile ? '12px' : '14px';
  const fontSizeValue = isMobile ? '12px' : '14px';
  const iconSize = isMobile ? '14px' : '16px';


  //rendering conditions
  const notesSection = notes
    ? `
        <div style="${separator}"></div>
        <p style="${infoText(fontSizeInfo)}">${notes}</p>
        `
    : '';

  const parkingSurfaceSection = parkingSurface && parkingSurface.length <= 20
    ? `<div style="${infoRow}">
         <div style="${attributes}">
           <img src="/img/vector/Popup/parkingSurface.svg" style="${infoIcon(iconSize)}" alt="Parking Surface Icon" />
           <p style="${infoText(fontSizeInfo)}">Parking surface</p>
         </div>
          <div style="${value(fontSizeValue)}">${parkingSurface}</div>
        </div>`
    : '';

  const parkingSpotsSection = parkingSpots
    ? `
        <div style="${infoRow}">
         <div style="${attributes}">
          <img src="/img/vector/Popup/parkingSpots.svg" style="${infoIcon(iconSize)}" alt="Parking Spots Icon" />
          <p style="${infoText(fontSizeInfo)}">Parking spots</p>
         </div>
          <div style="${value(fontSizeValue)}">${parkingSpots}</div>
         </div>`
    : '';


  const parkingAreaSection = parkingArea
    ? `<div style="${infoRow}">
          <div style="${attributes}">
        <img src="/img/vector/Popup/parkingArea.svg" style="${infoIcon(iconSize)}" alt="Parking Area Icon" />
        <p style="${infoText(fontSizeInfo)}">Parking area (sq ft.)</p>
          </div>
          <div style="${value(fontSizeValue)}">${Math.round(parkingArea / 10) * 10}</div>
        </div>`
    : '';


  return `<div style="${container(containerPadding)}">
              <div style="${title(fontSizeTitle)}"> Parking Info </div>
              <div style="${separator}"></div>
              <div style="${infoSection}">
                ${parkingSurfaceSection}
                ${parkingSpotsSection}
                ${parkingAreaSection}
              </div>
              ${notesSection}
            </div>`;
};





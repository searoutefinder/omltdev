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
`;



const title = (fontSizeTitle: string) => `
  display: flex;  
  width:100%;
  align-items: center;
  justify-content: flex-start;
  font-size: ${fontSizeTitle}; 
  font-weight: 600;
  color: #000000;
  margin:0;
  padding:0;
`;


const website = (fontSizeWebsite: string) => `
    display: flex;
    align-items: center;
    text-align: center;
    vertical-align: middle;
    font-weight: 600;
    font-size: ${fontSizeWebsite};
    color: #000000;
    border: 1px solid #C6C6C6;
    background: white;
    border-radius: 10px;
    padding: 8px 14px;
    gap:8px;
    cursor: pointer;
    text-decoration: none;

`;

const linkIcon = `
    position: relative;
    width: 10px;
    height:10px;
  `


const socialMediaIconRow = `
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 16px;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
`;



const socialMediaIcon = `
    position: relative;
    width: 20px;
    height:20px;  
`


interface PopUpStyleProps {
  isMobile: boolean;
  feature: any;
};


//func
export const getPopUpStylePoints = ({ isMobile, feature }: PopUpStyleProps) => {
  const properties = feature.properties;


  console.log(properties)
  
  //social media links (treat empty string as null)
  const facebookLink = properties.facebook?.trim() || null;
  const instagramLink = properties.instagram?.trim() || null;
  const linkedinLink = properties.linkedin?.trim() || null;


  //styles
  const containerPadding = isMobile ? '15px 11px' : '20px 15px';
  const fontSizeTitle = isMobile ? '18px' : '20px';
  const fontSizeWebsite = isMobile ? '16px' : '18px';

  //website fallback logic
  let websiteLink = properties.website;
  let websiteLabel = 'Visit website';

  if (!websiteLink) {
    if (facebookLink) {
      websiteLink = facebookLink;
      websiteLabel = 'Visit Facebook';
    } else if (instagramLink) {
      websiteLink = instagramLink;
      websiteLabel = 'Visit Instagram';
    } else if (linkedinLink) {
      websiteLink = linkedinLink;
      websiteLabel = 'Visit LinkedIn';
    } else {
      websiteLink = null;
    }
  }

  //social media icons (only if link exists)
  const facebook = facebookLink
    ? `<a href="${facebookLink}" target="_blank" rel="noopener noreferrer"><img src="/img/raster/RisingRoutes/popup/facebook.png" style="${socialMediaIcon}" alt="Facebook Icon" /></a>`
    : '';

  const instagram = instagramLink
    ? `<a href="${instagramLink}" target="_blank" rel="noopener noreferrer"><img src="/img/raster/RisingRoutes/popup/instagram.png" style="${socialMediaIcon}" alt="Instagram Icon" /></a>`
    : '';

  const linkedin = linkedinLink
    ? `<a href="${linkedinLink}" target="_blank" rel="noopener noreferrer"><img src="/img/raster/RisingRoutes/popup/linkedin.png" style="${socialMediaIcon}" alt="LinkedIn Icon" /></a>`
    : '';



  // only show social media row if at least one exists and if it's not shown already in website element 
  const showSocialMediaRow =
    (facebookLink && websiteLink !== facebookLink) ||
    (instagramLink && websiteLink !== instagramLink) ||
    (linkedinLink && websiteLink !== linkedinLink);



  //render
  return `<div style="${container(containerPadding)}">
    <div style="${title(fontSizeTitle)}"> 
      ${properties.organization_name}
    </div>
    ${websiteLink
      ? `<a href="${websiteLink}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <div style="${website(fontSizeWebsite)}"> 
              ${websiteLabel}
              <img src="/img/raster/RisingRoutes/popup/link.png" style="${linkIcon}" alt="Link Icon" />
            </div>
          </a>`
      : ''
    }
    ${showSocialMediaRow
      ? `<div style="${socialMediaIconRow}">
            ${facebook}
            ${instagram}
            ${linkedin}
          </div>`
      : ''
    }
  </div>`;
};










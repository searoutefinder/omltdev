//styles
const container = (fontSize: string) => `
    display: flex;
    max-width: 160px; 
    padding: 2px 4px; 
    align-items: center; 
    justify-content: center; 
    line-height:1;
    gap:2px;
    font-size: ${fontSize};
`;

const infoIcon = `
    margin-left:5px; 
    cursor: pointer; 
    padding: 0 1px;
`;

//func
export const getPopUpStyleTrails = (name: string, isMobile: boolean) => {
    const iconHtml = !isMobile ? '' : `<img src="/img/vector/LeftSidebar/info.svg" width="17" height="17" style="${infoIcon}" alt="Info Icon" />`;
    const fontSize = isMobile ? '11.5px' : '14px';

    return `<div id="Container" style="${container(fontSize)}">
            ${name}
            ${iconHtml}
        </div>`;
};


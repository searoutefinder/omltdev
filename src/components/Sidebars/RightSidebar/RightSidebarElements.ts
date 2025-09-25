import styled from "styled-components"

export const SidebarContainer = styled.div<{ $isCollapsedRight: boolean }>`
 // size and position
 position:absolute;
 display:flex;
 top:25px;
 right:0;
 height: 93.5%;
 width: 35%;
 max-width:450px;
 align-items: center;
 justify-content: center;
 //decorations
 background-color: transparent;
 //transitions
 transition: transform 0.5s, visibility 0s 0.5s;
 transform: ${({ $isCollapsedRight }) => ($isCollapsedRight ? "translateX(100%)" : "translateX(0px)")};
 z-index:3;
 user-select: none;
 pointer-events: none;
 

 @media (min-width: 786px) {
  ::-webkit-scrollbar {
    width: 0.5em;
    height:12.5px;
    background-color: #F5F5F5;
    border-radius:15px;
    }

    ::-webkit-scrollbar-thumb {
    background-color: #ccdd6e;
    border-radius:15px;
    }
    ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);

    background-color: #F5F5F5;
    border-radius:15px;
  }
 }

 @media (max-width: 1024px) {
    width:45%;        
      }

 @media (max-width: 785px) {
    top:0;
    width:45%;        
    height:100%;
  }

@media (max-width: 480px) {
    top:0;
    width:90%;        
    height:100%;
    pointer-events: auto;       
   }
`

export const SidebarContent = styled.div`
    display:flex; 
    flex-direction: column;
    width: 100%;
    height: 100%;
    //align    
    align-items: center;
    justify-content: flex-start;
    vertical-align: middle;
    //decorations
    color: #6d6d6d;
    background-color: transparent;
    user-select: none;
    pointer-events: none;
    z-index:3;
   

    @media (max-width: 785px) {
    pointer-events: auto;
      }
`

export const Wrapper = styled.div` 
    display:flex;
    width:100%;
    height:auto;
    flex-direction: column;
    pointer-events: auto;
    user-select: none;
    background-color: white;
    border-radius: 10px 0px 0px 10px;
    box-shadow: -8px 0px 10px 1px rgba(177, 177, 177, 0.164), 
                 6px -2px 5px rgba(0, 0, 0, 0.1), 
                0px 2px 5px rgba(0, 0, 0, 0.1);    
    overflow-y: auto;
    overflow-x: hidden;
`

export const HeroSection = styled.div`
    display:flex;
    position: relative;
    width:100%;
    height:fit-content;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: white;
    z-index: 4;
    border-radius: 0px 0px 0px 20px;
    margin:0;
    pointer-events: auto;
    user-select: none;

`

export const ToggleButton = styled.div`
  position: absolute;
  display: flex;
  width: 1.3em;
  height: 1.3em;
  top: 12.80em;
  left: -32.5px;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  border-radius: 8px 0px 0px 8px;
  padding: 20px 6px;
  background-color: white;
  cursor: pointer;
  box-shadow: -6px 0px 9px 0px rgba(116, 116, 116, 0.25);
  z-index: 4;
  pointer-events: auto;

  @media (max-width: 768px) {
    padding: 35px 5px;
    left: -30.5px;
    top: 14.10em;
  }

  @media (max-width: 350px) {
      padding:28px 3px;
      left: -24px;
    }

  &:hover {
    color: #6d6d6d;

    img {
      transform: scale(1.3); 
      transition: transform 0.25s; 
    }
  }
`;


  export const ToggleIcon = styled.img`
  height: 14px;
  width: 8.41px;
  transition: 'transform 0.5s';
 `


export const HeroImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: auto;
`

export const HeroImage = styled.img`
    width:100%;
    height:auto;
`

export const CloseIcon = styled.img`
    position: absolute;
    top: 15px;
    right: 15px;
    width: 13px;
    height: 13px;
    cursor: pointer;
    pointer-events: auto; 
    z-index:4;

    @media (max-width: 480px) {
        width: 14px;
        height: 14px;        
    }

    @media (max-width: 350px) {
        width: 10px;
        height: 10px;        
    }
`

export const DonationCardWrapper = styled.div`
    display:flex;
    width:90%;
    height:auto;
    flex-direction: column;
    align-items:center;
    justify-content: center;
`

export const DonationHeader = styled.div`
    display:flex;
    flex-direction: row;
    width:100%;
    padding: 4% 0% 0 0%;
    justify-content: flex-start;
    align-items: center;
    vertical-align: middle;
    gap:4%;
    `
 
 export const IconSupport = styled.img`
    width: 38px;
    height: 38px;
    cursor: pointer; 
    
    @media (max-width: 768px) {
        width: 30px;
        height: 30px;        
    }

    @media (max-width: 350px) {
        width: 20px;
        height: 20px;        
    }
 `
export const DonationHeaderTitle = styled.div`
  font-size: 1.7rem;
  font-weight: 600;
  color:#000000;
 
 @media (max-width: 768px) {
  font-size:1.44rem;        
    }

  @media (max-width: 665px)  {
  font-size:1.3rem;
  } 

  @media (max-width: 480px) {
  font-size:1.2rem;        
    }

  @media (max-width: 350px) { 
  font-size:1.1rem;        
    }


`


export const DonationProgressSection = styled.div`
 display: flex;
 position: relative;
 flex-direction: column;
 width: 100%;
 height: auto;
 padding: 4% 0 4% 0%;
 gap:10px;
 justify-content: center;
 align-items: center;
`


export const DonationProgressBar = styled.img`
  width:100%;
  height:auto;
` 

export const DonationProgressTextWrapper = styled.div`
  display:flex;
  width:100%; 
  align-items: center;
  justify-content: flex-start;
  vertical-align: middle;
  padding:0;
  gap:2%;
`

export const DonationProgressValue = styled.div`
  color:black;
  font-size: 1.25rem;
  font-weight: 600;
  color:#000000;
 

 @media (max-width: 768px) {
    font-size:1.10rem;
    padding:2% 0;        
  }

  @media (max-width: 665px)  {
    font-size:1.05rem;
    } 

  @media (max-width: 480px) {
    font-size:1rem;
  }; 

  @media (max-width: 350px) {
    font-size:.9rem;                
  };
`

export const DonationProgressBranding = styled.img`
    max-width: 180px;

    @media (max-width: 768px) {
        max-width: 144px;        
    }

    @media (max-width: 480px) {  
      max-width: 125px;        
    }; 

    @media (max-width: 350px) {
      max-width: 115px;
      margin-bottom:-1px;        
  };
`


export const TextSectionWrapper = styled.div`
    display:flex;
    width:100%;
    padding: 0;
    flex-direction: column;
    line-height: 1.2;
    color:#646262;

    @media (max-width: 665px) {
        font-size: 0.88rem;        
    }

    @media (max-width: 350px) {
      font-size: 0.75rem;        
  };    

    `


export const FundRaiserWrapper = styled.div`
    display:flex;
    flex-direction: row;
    width:100%;
    height:auto;
    justify-content: flex-start;
    align-items: center;
    gap:2%;
    padding: 4% 0;
    margin-top: 6px; 
    
    @media (max-width: 768px) {
        gap: 2%;        
    }

    @media (max-width: 665px) {
        gap: 3% !important;        
    }

    @media (max-width: 480px) {
        gap: 2%;        
    };

    @media (max-width: 350px) {
        gap:3%;        
    };
`

export const ContactIcon = styled.img`
    width:27.2px;
    height:17px;

    @media (max-width: 768px) {
        width: 22px;
        height: 14px;        
    }

    @media (max-width: 480px) {
        width: 20px;
        height: 13px;        
    }
`
export const FundRaiserTextSection = styled.div`
  display:flex;
  flex-direction: column;
  width:100%;
  gap:2%;
  justify-content: center;
  align-items: flex-start;
  color:#211F1F;
  padding:0;
  margin:0;
`
export const FundRaiserTextWrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  padding:0;
  margin:0;
  line-height: 1.2;
  font-size: 0.88rem;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size:0.80rem;        
  }

  @media (max-width: 386px) {
    font-size:0.65rem;        
  }

`

export const FundRaiserTextElement = styled.p`
  padding:0;
  margin:0;
`

export const MailTo = styled.a`
  position: relative;
  align-items: center;
  justify-content: center;
  color: #4C8C2B;
  cursor: pointer;
  user-select: none;
  /* white-space: nowrap; */
  padding: 0;
  margin:0;
  margin-left: 3.5px;
  text-decoration: none; 
  border-bottom: 1px solid #4C8C2B; 
  padding-bottom: 2px; 

  &:hover { 
        color: #94c57a;
        transition: all .3s ease;
    }
`
export const DonationButtonContainer = styled.div`
   display:flex;
   flex-direction: column;
   gap:16.5px;
   width:100%;
   padding-bottom: 4%;
   justify-content: center;
   align-items: center;

`

export const DonationButton = styled.a`
  display:flex;
  position: relative;
  margin-top: 5%;
  width:85%;
  justify-content: center;
  padding: 17px 27.5px;
  border-radius: 12px;
  font-family: Helvetica;
  font-size: 15.88px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  text-underline-position: from-font;
  background-color: #4C8C2B;
  color:white;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
  text-decoration: none;

    &&:hover {
        background-color: #4c9e23;
        transition: all .3s ease;
    }
  
  @media (max-width: 768px) {
    font-size: 14px;        
  }

  @media (max-width: 665px)  {
    font-size: 13px;
    padding: 12px 20px;
  } 


  @media (max-width: 480px) {
    font-size: 14px;  
    padding: 12px 20px;
      
  }

  @media (max-width: 350px) {
    padding: 9px 15px;
    font-size: 12px;        
  };
`

export const DonationDeadline = styled.div`
    font-size: 0.88rem;
    font-weight: 400;
    color: #646262;
    user-select: none;

    @media (max-width: 768px) {
        font-size: 0.80rem;        
    }

    @media (max-width: 665px) {
        font-size: 0.78rem;        
    }

    @media (max-width: 480px) {
        font-size: 0.75rem;        
    }

    @media (max-width: 350px) {
        font-size: 0.70rem;        
    };
`

export const ShareSection = styled.div`
    display:flex;
    position: relative;
    bottom:0;
    width:100%;
    height:auto;
    padding: 3% 0;
    align-items: center;
    background-color:#F4F4F5;  
`

export const ShareSectionWrapper =  styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    width:100%;
    gap:2%;
    padding: 1% 4%;
    line-height: 1.2;
    color:#646262; 
`
export const ShareSectionText = styled.div`
  font-size: 0.88rem;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 0.80rem;        
  }

  @media (max-width: 665px) {
    font-size: 0.75rem;        
  }

  @media (max-width: 480px) {
    font-size: 0.70rem;        
  }

  @media (max-width: 350px) {
    font-size: 0.65rem;        
  };
`

export const ShareSectionIcons = styled.div`
 display:flex;
 gap:20%;
 justify-content: center;
 align-items: center;
`

export const ShareIcon = styled.img`
 width:24px;
 height:24px;  
 cursor: pointer;  

  @media (max-width: 768px) {
      width: 20px;
      height: 20px;        
    }
  
    @media (max-width: 480px) {
      width: 18px;
      height: 18px;        
    }
  
    @media (max-width: 350px) {
      width: 16px;
      height: 16px;        
    };
`
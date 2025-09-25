import styled from "styled-components";

export const SidebarContainer = styled.div<{ $isCollapsedLeft: boolean, $isLoading:boolean }>`
  position: absolute;
  display: flex;
  top: 25px;
  left: 0;
  height: 93.5%;
  width: 35%;
  max-width: 450px;
  align-items: ${({$isLoading }) => ($isLoading ? 'center' : 'flex-start')};
  justify-content: center;
  //decorations
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 80px, 
    rgba(255, 255, 255, 1) 130px, 
    rgba(255, 255, 255, 0.5) 100%  
  );
  border-radius: 0 10px 10px 0;
 
  // transitions
  transition: transform 0.5s;
  transform: ${({ $isCollapsedLeft }) => ($isCollapsedLeft ? "translateX(-100%)" : "translateX(0px)")};
  z-index: 2;
  box-shadow: 6px 0px 10px 1px rgba(177, 177, 177, 0.164), 
              0px -2px 5px rgba(0, 0, 0, 0.1), 
              0px 2px 5px rgba(0, 0, 0, 0.1);
 
  // style scrolllBar
 ::-webkit-scrollbar {
  width: 0.35em;
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

//media queries
 @media (max-width: 1024px) {
   width:45%;        
    }

@media (max-width: 768px) {
   top:0;
   height:100%; 
   width:90%;        
    }

 @media (max-width: 768px) {
   top:0;
   height:100%; 
   width:50%;        
  }


@media (max-width: 480px) {
   top:0;
   height:100%; 
   width:90%;  
    }
`

export const SidebarContent = styled.div`
    display:flex; 
    flex-direction: column;
    width: 95%;
    height: 93.5%;
    margin-top:20px;
    //align    
    align-items: center;
    justify-content: flex-start;
    vertical-align: middle;
    //decorations
    border-radius: 10px;
    color: #6d6d6d;
    overflow-y: hidden;
    overflow-x: hidden;

    
    @media (max-width: 785px) {
      margin-top:0;
      }

    @media (max-width: 480px) {
      width:98%;       
          }
  
`

export const ToggleButton = styled.div`
    position: absolute;
    display: flex;
    width: 1.3em;
    height: 1.3em;
    top: 6.56em;
    right: -32.5px;
    //align ---
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    //decorations
    border-radius: 0 8px 8px 0;
    padding:20px 6px;
    background-color: white;
    user-select: none !important;
    cursor: pointer;
    z-index: 2;
    //shadows
    box-shadow: 6px 0px 9px 0px rgba(116, 116, 116, 0.25);

    @media (max-width: 768px) {
      padding:35px 5px;
      right: -30.5px;
    }

    @media (max-width: 350px) {
      padding:28px 3px;
      right: -24px;
    }

&:hover {
    color: #6d6d6d;

    img {
      transform: scale(1.3); 
      transition: transform 0.25s; 
    }
  }`

export const ToggleIcon = styled.img`
  height: 14px;
  width: 8.41px;
  transition: 'transform 0.2s';
 `

export const SideBarHeader = styled.div`
    display:flex;
    width:100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 4% 4% 0% 4%;
    gap:20px;
`

export const BadgeContainer = styled.div`
    position:relative;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    padding: 5px;
`

export const BadgeOne = styled.img`
    width:50.5px;
    height:auto;
    z-index:1;

    @media (max-width: 768px) {
      width:45px;        
    }

    @media (max-width: 480px) {
      width:40px;        
    }

    @media (max-width: 350px) {
      width:35px;        
    }

`

export const BadgeTwo = styled.img`
    position: absolute;
    top: 5px;
    right:-10px;
    width: 35px;
    height: 35px;
    z-index: 2;

    @media (max-width: 768px) {
      right:-8px;
      width:30px; 
      height:30px;       
    }

    @media (max-width: 480px) {
      right:-7px;
      width:25px; 
      height:25px;       
    }

    @media (max-width: 350px) {
      right:-5px;
      width:20px; 
      height:20px;       
    }
`

export const TitleContainer = styled.div`
    display:flex;
    width:100%;
    flex-direction: column;
    gap:6px;
`


export const SidebarTitle = styled.div`
  font-size: 30px;
  font-weight: 600;
  color:#000000;
  user-select: none;
 
  @media (max-width: 768px) {
  font-size:1.44rem;        
    }

  @media (max-width: 480px) {
  font-size:1.2rem;        
     }

  @media (max-width: 350px) {
  font-size:1rem;        
     }   
`

export const SidebarSubTitleSection = styled.div`
     display:flex;
     width: 90%;
     gap:2.5%;
     align-items: center;
     justify-content: space-between;
     font-size: 16px;
     font-weight: 400;
     color: #4E4E4E;
     user-select: none;


     @media (max-width: 768px) {
      font-size:0.80rem;        
      }

     @media (max-width: 480px) {
       font-size:0.765rem;        
       }
      
      @media (max-width: 350px) {
      font-size:0.6rem;        
     }     

`

export const SidebarSubTitleText = styled.div`
   display:flex;
   flex-direction: column;
   max-width:85%;

   @media (max-width: 665px) {
    max-width:82%;
   }
  ` 
  
  export const SidebarSubTitleTextItem = styled.div`
    font-size: 16px;
    font-weight: 400;

     @media (max-width: 768px) {
      font-size:0.80rem;        
      }

     @media (max-width: 480px) {
       font-size:0.765rem;        
       }
      
      @media (max-width: 350px) {
      font-size:0.6rem;        
     }  
  `

export const InfoIcon = styled.img`
    width:14px;
    height:14px;
    color:#ca2d2d;
    cursor: pointer;
    transition: transform 0.25s, fill 0.25s;

    @media (max-width: 768px) {
    width:16px;
    height:16px;                
    }

    @media (max-width: 480px) {
    width:14px;
    height:14px;
    };  

    @media (max-width: 350px) {
    width:12px;
    height:12px;
    };

  &:hover {
    transform: scale(1.15);
    fill: #4C8C2B;
  }
`

export const SidebarDescription = styled.div`
   display:flex;
   width:92%;
   flex-direction: column;
   justify-content: flex-start;
   align-items: center;
   vertical-align: middle;
   padding: 3% 2%;
   gap: 5px;
   margin: 3% 0;
  `

export const FundraisingSection = styled.div`
  display:flex;
  width:100%;
  padding:2% 0;        
  height:auto;
  background-color: "#ffffff";
  justify-content: left;
  align-items: center;
  gap:2%;
  font-size: 0.88rem;

@media (max-width: 768px) {
  margin-top: 1%;
}

`
export const FundraisingSectionLeft = styled.div`
 font-size: 14px;        
 align-items: center;
 justify-content: center;
 font-weight: 400;
 white-space: nowrap; 

 @media (max-width: 768px) {
    font-size:0.80rem;        
  };

  @media (max-width: 480px) { 
    font-size:0.80rem;        
  };

  @media (max-width: 350px) { 
      font-size:0.75rem;        
  };   
 `

export const FundraisingSectionRight = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  color: #4C8C2B;
  font-weight: 500;  
  gap: 3.5px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

&:hover { 
      color: #94c57a;
      transition: all .3s ease;
  }

&::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -3.5px; 
  height: 1px;
  width: 100%;
  background-color: #4C8C2B;
  padding: 0% 0%; 
};

@media (max-width: 768px) {
    font-size:0.80rem;        
  }

  @media (max-width: 480px) { 
    font-size:0.75rem;        
    }

  @media (max-width: 350px) { 
    font-size:0.65rem;        
    };    
`;


export const BackToWebsite = styled.div`
  display:flex;
  flex-direction: row;
  width:100%;
  padding: 1%;
  gap: 3.5px;
  justify-content: left;
  align-items: center;
  font-size: 0.88rem;
  color: #4C8C2B;
  font-weight: 500;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #94c57a;
    transition: all .3s ease;
  }
`
export const Link = styled.a`
  position: relative;
  display: inline-block;
  color: #4C8C2B;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  text-decoration: none;


  &:hover {
    color: #94c57a;
    transition: all .3s ease;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -3.5px;
    height: 1px;
    width: 100%;
    background-color: #4C8C2B;
  } 

  @media (max-width: 768px) {
      font-size:0.80rem;        
        }

    @media (max-width: 480px) { 
      font-size:0.80rem;        
        }

    @media (max-width: 350px) { 
      font-size:0.75rem;        
        }; 
`;


export const ItemsWrapper = styled.div`
display:flex;
height:100%;
width:100%;
flex-direction: column;
justify-content: flex-start;
align-items: center;
overflow:auto;
gap:12px;
z-index: 3;
/* background-color: red; */

@media (max-width: 768px) {
 gap:15px;        
      }

@media (max-width: 480px) {
  gap:20px !important;  
    }; 

 @media (max-width: 350px) {
  gap:15px !important;        
     }  
`


export const ItemContainer = styled.div<{ $ItemHighlight: boolean, $isItemOpen: boolean }>`
    display:flex;
    flex-direction: column;
    width:95%;
    border:1px solid #C6C6C6;
    padding-bottom: ${({ $isItemOpen }) => ($isItemOpen ? "3%" : "0")};
    border-radius:6px;
    gap:${({ $isItemOpen }) => ($isItemOpen ? "5px" : "0px")};
    background-color: ${({ $ItemHighlight }) => ($ItemHighlight ? "#EFEFEF" : "white")};
    cursor: pointer;
`

export const ItemHeader = styled.div<{ $isItemOpen: boolean }>`
   display:flex;
   justify-content: space-between;
   align-items: center;
   flex-direction: row;
   padding: ${({ $isItemOpen }) => ($isItemOpen ? "3.5% 3.5% 0% 3.5% " : "3.5%")};
`

export const ItemName = styled.div`
  display:flex;
  flex-direction: column;
  width:auto;
  padding:0%; 
  color:black;
  gap:6%;
  font-size: 22px;
  font-weight: 600;
  color:#000000;
  cursor:pointer; 
 

 @media (max-width: 768px) {
    font-size:1.10rem;
    padding:2% 0;        
      };

 @media (max-width: 480px) {
    font-size:1rem;        
      };
  
  @media (max-width: 350px) {
      font-size:0.8rem;
      padding:1%;        
     }      

`;

export const IconsContainer = styled.div`
  display:flex;
  justify-content:flex-start;
  align-items: center;
  gap:6.75px !important;
`

export const UsageTypeIcon = styled.img`
 max-width: 110px;
 margin-left:5px;

 @media (max-width: 1024px) {
  max-width:100px;         
      }

 @media (max-width: 768px) {
  max-width:85px;         
      };

  
  @media (max-width: 350px) {
   max-width:60px;        
  }  
`

export const RevealIcon = styled.img`
 display:flex;
 max-width: 35px;
 cursor: pointer;
 user-select: none !important;

 @media (max-width: 1024px) {
  max-width:30px;         
      }

 @media (max-width: 768px) {
  max-width:25px;         
      };

  
  @media (max-width: 350px) {
   max-width:20px;        
  }  
`

interface ItemInfoContainerProps {
  $isItemOpen: boolean;
}

export const ItemInfoContainer = styled.div<ItemInfoContainerProps & { $disableTransition?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  overflow: hidden;
  padding: ${({ $isItemOpen }) => ($isItemOpen ? "3% 3% 0 3%" : "0 3%")};
  gap:10px;
  
  //transitions
  max-height: ${({ $isItemOpen }) => ($isItemOpen ? "450px" : "0px")};  
  opacity: ${({ $isItemOpen }) => ($isItemOpen ? "1" : "0")};
  transform: ${({ $isItemOpen }) => ($isItemOpen ? "translateY(0)" : "translateY(-12.5px)")};

  transition: ${({ $disableTransition, $isItemOpen }) =>
    $disableTransition
      ? "none"
      : $isItemOpen
        ? "max-height 0.5s ease-in-out, opacity 0.52s ease, transform 0.50s ease"
        : "max-height 0.52s ease-in-out, opacity 0.52s ease, transform 0.50s ease"};


 @media (max-width: 1024px) {
   gap:12px;
      }

  @media (max-width: 768px) {
   gap:14px;
      }

  @media (max-width: 480px) {
    gap:15px;
  }
`;



export const TextSection = styled.div`
    display:flex;
    width: 100%;
    flex-direction: column;
    font-size: 14px;        
    justify-content: center;
    align-items: flex-start;
    line-height: 1.1;


    @media (max-width: 768px) {
      font-size:0.80rem;        
        }

    @media (max-width: 480px) { 
      font-size:0.80rem;        
        }

    @media (max-width: 350px) { 
      font-size:0.75rem;        
        };    
`

export const SeparationLine = styled.div<{ $isItemOpen: boolean }>`
  height: 1px;
  width: 100%;
  background-color: ${({ $isItemOpen }) => ($isItemOpen ? "#dfdfdf" : "#EFEFEF")};
`


export const TrailsDetails = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    padding: 3% 3%;
    gap:12px;
    user-select: none;
    
    @media (max-width: 768px) {
       gap:13.5px;        
      }

    @media (max-width: 480px) {
        gap:18px !important;  
      }
`
export const TrailsDetailesLine = styled.div`
    display:flex;
    width:100%;
    gap:5px;
    flex-direction: row;
    align-items: center !important;
    justify-content: flex-start;
    vertical-align: middle;

    @media (max-width: 768px) {
       gap:10.5px;        
      }

    @media (max-width: 480px) {
        gap:12px   
      }
`
export const Attribute = styled.div`
  display:flex;
  width:auto;
  gap:3%;
  min-width: 30%;
  align-items: center;
  justify-content: flex-start;
  vertical-align: middle;
  color:#656B7C;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
     font-size: 0.80rem;
  };

  @media (max-width: 480px) {
    font-size: 0.75rem;
  };

  @media (max-width: 350px) {
    font-size: 0.7rem;
  }

`

export const Value = styled.div`
  display:flex;
  font-weight: 700;
  color:black;
  font-size: 16px; 

  @media (max-width: 768px) {
    font-size: 0.85rem;
  };

  @media (max-width: 480px) {
    font-size: 0.80rem;
  };

  @media (max-width: 350px) {
    font-size: 0.75rem;
  }
`

export const SpecsIcon = styled.img`
 display:flex;
 width: 18px !important;
`

export const GreenArrow = styled.img`
  width: 11px;
  height: 11px;
`;


export const ActivityIconsWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`


export const ActivityIcon = styled.img`
  width: 24px;
  height: 24px;
  `; 




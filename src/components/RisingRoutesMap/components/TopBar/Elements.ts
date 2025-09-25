import styled from 'styled-components';


export const TopBarContainer = styled.div`
   display:flex;
   flex-direction: row;
   top:0;
   width:100%;
   height:auto;
   max-height: 60px;
   justify-content: center;  
   align-items: center;
   vertical-align: middle;
   color: #757575;
   background-color: #ffffff;
   border: 1px solid #EAEAEA;
   border-bottom: 2 solid #EAEAEA;
   z-index:50;
`

export const LogoIcon = styled.img`
   position: absolute;
   left: 20px;
   width:auto;
   height:33px;
   cursor: pointer;

 @media (max-width: 768px) {
    height:35px;        
      }

  @media (max-width: 425px) {
      height:30px;        
   }
`



export const BrandIcon = styled.img`
   position: absolute;
   right: 30px; 
   bottom: 30px;
   height:55px;
   z-index: 2;
   cursor: pointer;

 @media (max-width: 768px) {
    height:40px;        
      }

  @media (max-width: 425px) {
      height:35px;        
   }

`

export const TitleEl = styled.p`
 padding:0;
 font-size: 1.25rem;
 font-weight: 600;
 color:#111111;
 

 @media (max-width: 768px) {
    display:none;
    font-size:1.10rem;
    padding:3% 0;        
   }
`


import styled from 'styled-components';


export const TopBarContainer = styled.div`
   display:flex;
   flex-direction: row;
   top:0;
   width:100%;
   height:auto;
   max-height: 60px;
   justify-content: space-between;
   align-items: center;
   vertical-align: middle;
   color: #757575;
   background-color: #ffffff;
   border: 1px solid #EAEAEA;
   border-bottom: 2 solid #EAEAEA;
   z-index:50;
`

export const BrandIcon = styled.img`
 display:flex;
 width:auto;
 height:40px;
 padding:1% 0;
 margin-left:10px;
 cursor: pointer;

 @media (max-width: 768px) {
    height:35px;        
      }

  @media (max-width: 425px) {
      height:30px;        
   }
 
`

export const TitleEl = styled.p`
 display:flex;
 white-space: wrap !important;
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

export const FullScreenButton = styled.div`
display:flex;
cursor: pointer;
padding:1px 0;
background-color:#ffff;
margin-right:10px;

@media (max-width: 768px) {
   margin-right: 9px;        
     }
`

export const FullScreenIcon = styled.img`
   width:35px;
   height:35px;
   cursor: pointer;

   @media (max-width: 425px) {
      width:28px;
      height:28px;
        }
`
import styled, {keyframes} from "styled-components";


export const Container = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    overflow: hidden;

    /* //small devices
    @media (max-width: 768px) {
        display: none;   
    } */
`

export const MapCanvas = styled.div`
  display:flex;
  flex-direction: row;
  height:100%;
  width:100%;
  justify-content: center;
  align-items: center;
`

// export const ShadowOverlay = styled.div<{
//   $isModalOpen: boolean;
// }>`
//   display: ${(props) => (props.$isModalOpen ? "block" : "none")};
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(150, 150, 150, 0.5);
//   z-index: 200;
//   backdrop-filter: blur(1px);
//   -webkit-backdrop-filter: blur(1px);
//   transition: opacity 0.3s ease-in-out;
//   pointer-events: ${(props) => (props.$isModalOpen ? "auto" : "none")};
//   z-index: 100;
//   `


export const MapContainer = styled.div`
  position:absolute;
  top:0;
  left:0;
  height:100%;
  width:100%;
  overflow: hidden;
  z-index: 1;

  @media (max-width: 320px) {
    transform: scale(0.8);
    transform-origin: top left;
    width: 125%;
    height: 125%;
    left:0;
    top:0;
    overflow: hidden;
  }
  `

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

export const MarkerEl = styled.div`
  width: 50px;
  height: 50px;
  background-image: url('/marker.png'); 
  background-size: cover;
  border-radius: 50%;
  animation: ${spin} 2s linear infinite;
`;

export const SearchThisAreaContainer = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    height: auto;
    justify-content: center;
    align-items: center;
    top: 25px;
    right: 0;
    

    @media (max-width: 1440px) {
      width: 90%;
    }

    @media (max-width: 1024px) {
      width: 60%;
    }

    @media (max-width: 768px) {
        top: 85px;
        right: 0;
        width: 100%;
        height: auto;
        padding: 0 10px;
    };

    `;


export const SearchThisArea = styled.div`
    display:flex;
    flex-direction: row;
    background-color: #fff;
    border: 1.5px solid rgba(117, 117, 117, 0.26);
    color: #000;
    padding: 7px 12px;
    z-index:2;
    gap: 5px;
    border-radius: 16px;
    cursor: pointer;
    -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Safari */
          -khtml-user-select: none; /* Konqueror HTML */
          -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* internet Explorer/Edge */
          user-select: none;
          -webkit-transition: all 500ms ease;
        -moz-transition: all 500ms ease;
        -ms-transition: all 500ms ease;
        -o-transition: all 500ms ease;
        transition: all 500ms ease;
        box-shadow: 0 1px 2px rgba(108, 111, 114, 0.3), 0 1px 3px 1px rgba(77, 82, 85, 0.15);
      
    &&:hover {
            color: #4e4e4e;
            transition: all .3s ease;
            background-color: #f3f3f3;
            }

      @media (max-width: 768px) {
        top:auto;
        font-size: 0.70rem;
        left:18px;
        bottom: -5px;
      }

      @media (max-width: 425px) {
        font-size: 0.60rem;
        padding: 8px 16px;
      };

      @media (max-width: 350px) {
        font-size: 0.50rem;
        padding: 7px 12px;
        bottom: -2.5px;

  }`;


export const SearchThisAreaText = styled.span`
    color:#4A4E4E;
    font-size: 0.80rem;
    color: #4A4E4E;
    font-weight: 550;
    font-family: "Poppins";
    text-decoration: none;
    letter-spacing: 0.25px;
`;


export const SearchThisAreaIcon = styled.img`
  margin-top: 2px;
   width: 12px;
  height: 12px;
  pointer-events: none;
  opacity: 1;
  cursor: none;
`



//Modal Wrapper ----------------------------------------------------------------------------------
export const FiltersModal = styled.div<{
  $isOpen: boolean;
}>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  //centering in the root of viewport
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
  max-width: 550px;
  max-height: 550px;
  flex-direction: column;
  border-radius: 15px; 
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  border: 1px solid #C6C6C6;
  background-color: #ffffff;
  z-index: 250;

  //small devices
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    height: 100%;
    max-height: 100%;
    top: 0;
    left: 0;
    transform: none;

  };
`;

import styled from "styled-components";


export const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: #fff;
`;


export const MapCanvas = styled.div`
  display:flex;
  flex-direction: column;
  position:relative;
  height:100%;
  width:100%;
  justify-content: flex-start;
  align-items: center;
`

export const MapContainer = styled.div`
  position:absolute;
  top:0;
  left:0;
  height:100%;
  width:100%;
  overflow: hidden;

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


export const ResetButton = styled.div`
    display:block;
    position: absolute;
    cursor: pointer;
    left: 50%;
    top: 10px;
    transform: translate(-10%, -50%);
    margin-top: 18px;
    border-radius: 40px;
    background-color: #fff;
    border:  1.5px solid rgba(117, 117, 117, 0.26);
    color: #000;
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: bold;
    font-family: "Poppins";
    letter-spacing: .56px !important;
    padding: 10px 20px;
    z-index:2;
    float: left;
    color:#4A4E4E;


    -webkit-box-shadow: '0 15px 25px 0 rgba(0,0,0,.1)';
    box-shadow: '0 1 5px 25px 0 rgba(0,0,0,.1)';
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

    &&:hover {
            color: #0e4c49;
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

  }
    `



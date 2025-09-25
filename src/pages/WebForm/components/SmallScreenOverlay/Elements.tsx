import styled from 'styled-components';


export const Container = styled.div`
    position: absolute;
    display: flex;
    height:100%;
    width:100%;
    flex-direction: column;
    top:0;
    left:0;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: #e2e2e2;
    white-space: nowrap;
    z-index: 6000; 
    gap:5px;
  `;

export const HomeElement = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
`


export const MainText = styled.div`
    display:flex;
    width:95%;
    font-size:1.5rem;
    color:#3D3D3D;
    font-family: "Lato";
    font-style: bold;
    font-weight: 600;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 110%;
    user-select: none;
    white-space: normal;

  @media(max-width: 412px) {
    font-size: 18px;
}`

export const WarningText = styled.div`
    display:flex;
    font-size:1rem;
    width:90%;
    color:#3D3D3D;
    font-size: small;
    font-family: "Lato";
    white-space: normal;
    justify-content: center;
    align-items: center;
    text-align: center;
    user-select: none;
   
    @media(max-width: 412px) {
    font-size: 12px;
  }

`








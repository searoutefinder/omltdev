import styled from "styled-components"

export const NavBarContainer = styled.div`
display:flex;
flex-direction: row;
position: relative;
top:0;
height: 5%;
width:100%;
gap: 3.5%;
justify-items: center;
align-items: center;
background-color: #ffffff;
`

export const NavBarItem = styled.div`
  display: flex;
  padding:5px;
  font-weight: 600;
  width:auto;
  height:auto;
  cursor:pointer;
  color:black;

  &:hover {
    color:gray;
  }
`
import styled from "styled-components";
import { Link } from "react-router-dom";


export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
  overflow: hidden;
`;

export const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  max-width: 1440px;
  padding: 20px;
  background-color: #f5f5f5;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    gap:20px;
    align-items: space-between;
  }
`;


export const SectionsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: 1rem;
  gap:2px;
`;


export const StyledSectionButton = styled.button<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: flex-start;
  align-items: start;
  width: 50%;
  padding: 8px;
  border: none;
  background-color: #ffffff;
  color: #575757;
  border-radius: 5px;
  transition: 0.3s;
  text-align: left;
  text-decoration: none !important;
  font-size: 20px;
  font-weight: 600;
  background-color: ${(props) => (props.$isSelected ? "#eaffcd40" : "#ffffff")};
  cursor: pointer;
  user-select: none;



  &:hover {
    background-color: #eaffcd40;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    width: 100%;
    margin: 5px 0;
    gap: 2px;
  }
`;

export const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: auto;
  margin:0;
  margin-bottom: 50px;
  padding: 0;
  background-color: #f5f5f5;
  overflow: auto;

  @media (max-width: 768px) {
    margin: 0;
    padding: 0;
    gap:20px;
    align-items: space-between;
  }
`;


export const TitleSection = styled.div`
    display:flex;
    justify-content: space-between;
    align-items: center;
    gap:20px;
    padding:20px 20px;
    margin: 0;
    //font
    font-size: 24px;
    font-weight: bold;
    //decorations
    background-color: #ffffffd6;
    user-select: none;
    border: 1px solid #ddd;
    border-radius: 8px;

    @media (max-width: 768px) {
      gap: 10px;
      font-size: 20px;
    }
    `;

export const Folder = styled.details`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: 0.3s;
  user-select: none;

  
  &:hover {
    background-color: #eaeaea;
  }
`;

export const Summary = styled.summary`
  font-weight: bold;
  padding: 5px;
  cursor: pointer;
  user-select: none;
  font-size: 20px;

  @media (max-width: 768px) {
      font-size: 18px;
    }
 `;

export const StyledButton = styled.button`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: flex-start;
  align-items: start;
  cursor: pointer;
  width: 80%;
  padding: 8px;
  border: none;
  background-color: #ffffff;
  color: #575757;
  border-radius: 5px;
  transition: 0.3s;
  text-align: left;
  text-decoration: none !important;
  font-size: 15px;
  font-weight: 600;
  margin: 5px 0 5px 50px;

  &::before {
    content: "";
    display: inline-block;
    background: url('/img/vector/WebForm/page.svg') no-repeat center center;
    background-size: cover;
    width: 14px;
    height: 14px;
    margin: 0px 8px 0px 0px;
    opacity: 0.85;
  }

  &:hover {
    background-color: #eaffcd40;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    width: 100%;
    margin: 5px 0;
    gap: 2px;
  }
`;


export const LogoImg = styled.img`
    width: 100px;
    height: auto;
    margin-right: 20px;

    @media (max-width: 768px) {
      width: 100px;
      margin-right: 0;
    }
`;


export const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  flex-direction: row;
  text-decoration: none;
  color: inherit;
`;


export const ItemTitle = styled.p`
  position: absolute;
  right: 10px;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
      font-size: 12px;
    }
`;
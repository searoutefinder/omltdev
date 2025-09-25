import styled, {keyframes} from 'styled-components';


/* panel wrapper */
export const Panel = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  //small devices
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }

`;

/* header */
export const Header = styled.div`
  position: relative;
  padding: 15px 24px 10px;
  border-bottom: 1px solid #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  text-transform: capitalize;
`;

export const CloseIcon = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 18px;
  height: 18px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover { 
    background: #f2f2f2; 
    }
`;


/* filters row */
export const FiltersRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 24px;
`;



/* custom select – identical on every OS */
export const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  min-width: 140px;
  padding: 8px 38px 8px 14px;
  border: 1px solid #d1d1d1;
  border-radius: 30px;
  background: #fafafa
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%23000' d='M6 8L0 0h12z'/></svg>")
    no-repeat right 14px center/12px 8px;

  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;

  &:hover { background-color: #f1f1f1; }
  &:focus { outline: none; border-color: #000; }

  &:disabled {
    color: #a1a1a1;
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

/* footer */
export const Footer = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  border-top: 1px solid #ebebeb;
  box-shadow: 0 -2px 16px 0 rgba(0, 0, 0, 0.16), 
              0 0 0 1px rgba(0, 0, 0, 0.04);
  
`;

export const ClearBtn = styled.button`
  background-color: transparent;
  border: none;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background-color 0.15s;

  &:hover { background-color: #f2f2f2; }
`;



export const ApplyBtn = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 600;
  min-width: 180px;
  border-radius: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover { background-color: #333; }
`;


/* scrollable middle area */
export const Body = styled.div`
  flex: 1;                   
  padding: 24px;
  overflow-x: hidden;
`;



/* section */
export const Section = styled.div`
  margin-bottom: 30px;
  /* background-color: red; */
  gap: 12px;
  border-bottom: 1px solid #ebebeb;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 20px;
  font-weight: 600;
`;


/* pill grid */
export const OptionsGrid = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;


/* pill button */
export const Pill = styled.button<{ 
  $active?: boolean,
  $isBusy?: boolean}>`
  min-height: 38px;
  padding: 0 18px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d1d1;
  //transitions----
  transition: background-color 0.15s, color 0.15s, border-color 0.15s;
  background-color: ${({ $active }) => ($active ? '#000' : '#fafafa')};
  color: ${({ $active }) => ($active ? 'white' : '#222')};
  border-color: ${({ $active }) => ($active ? '#000' : '#d1d1d1')};
  opacity: ${({ $isBusy }) => ($isBusy ? 0.5 : 1)};
  cursor: ${({ $isBusy }) => ($isBusy ? 'not-allowed' : 'pointer')};
   /* background-color: #000;
      color: #fff;
      border-color: #000; */

  /* &:hover:not(:disabled) { 
    background-color: #f1f1f1;
    color: #222; 
  } */

  /* &:disabled {
    opacity: 0.05;
    cursor: default;
  } */
`;

/* accordion wrapper */
export const Accordion = styled.div<{ $open?: boolean }>`
  border-bottom: 1px solid #ebebeb;
  overflow: hidden;
`;


/* header row */
export const AccordionHeader = styled.button<{ $open: boolean }>`
  all: unset;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  cursor: pointer;
`;


export const HeaderText = styled.span`
  font-size: 20px;
  font-weight: 600;
  text-transform: capitalize;
`;


export const Chevron = styled.span<{ $open: boolean }>`
  display: inline-block;
  position: relative;
  right: 2px;
  transition: transform 0.2s;
  transform: rotate(${({ $open }) => ($open ? '90deg' : '0deg')});
  &::before {
    content: '❯';
    font-size: 22px;
  }
`;

/* list */
export const OptionsList = styled.div<{
  $open: boolean;
}>`
  height: auto;
  overflow-y: auto;
  padding: 0 0 18px;
  overflow: visible;
  min-height: 200px;
  /* background-color: green; */
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: ${({ $open }) => ($open ? 'auto' : '0')}; 
`;



export const OptionRow = styled.button<{ 
  $active: boolean,
  $isBusy?: boolean}>`

  all: unset;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0 10px 4px;
  cursor: ${({ $isBusy }) => ($isBusy ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isBusy }) => ($isBusy ? 0.5 : 1)};

  &:hover { background: #fafafa; }

  &::before {
    content: '';
    width: 18px;
    height: 18px;
    margin-right: 12px;
    border: 1px solid #a1a1a1;
    border-radius: 4px;
    background: ${({ $active }) => ($active ? '#000' : 'transparent')};
  }

  span {
    font-size: 14px;
    color: ${({ $active }) => ($active ? '#000' : '#222')};
    text-transform: capitalize;
  }
`;


const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

export const DotContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-left: 12px;
`;

export const Dot = styled.span<{ $delay: number }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  animation: ${bounce} 1.4s infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;


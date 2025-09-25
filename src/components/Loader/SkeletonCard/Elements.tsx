import styled, { keyframes } from 'styled-components';


const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const Placeholder = styled.div`
  background: linear-gradient(90deg, #f8f8f8 25%, #eaeaea 37%, #f8f8f8 63%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s infinite;
  border-radius: 4px;
`;

export const SkeletonItem = styled.div`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ededed;
  border-radius: 10px;
  margin-bottom: 12px;
`;

export const TitleSkel = styled(Placeholder)`
  width: 65%;
  height: 18px;
  margin-bottom: 10px;
`;

/* section title (e.g. “Mission”) */
export const SectionTitleSkel = styled(Placeholder)`
  width: 40%;
  height: 14px;
  margin: 6px 0 8px;
`;

interface LineSkelProps {
  w: string;
}

export const LineSkel = styled(Placeholder)<LineSkelProps>`
  width: ${({ w }) => w};
  height: 15px;
  margin-bottom: 6px;
`;

/* horizontal divider */
export const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #ededed;
  margin: 12px 0;
`;

/* footer row */
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;
export const IconSkel = styled(Placeholder)`
  width: 14px;
  height: 14px;
  border-radius: 3px;
`;
export const TagSkel = styled(Placeholder)`
  width: 50px;
  height: 18px;
  border-radius: 4px;
`;
export const LabelSkel = styled(Placeholder)`
  flex: 1;
  height: 12px;
`;
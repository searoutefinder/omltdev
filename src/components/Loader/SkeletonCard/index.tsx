import React from 'react';
import {
  SkeletonItem,
  TitleSkel,
  SectionTitleSkel,
  LineSkel,
  Hr,
  Row,
  IconSkel,
  LabelSkel,
  TagSkel
} from './Elements';

export const SkeletonCard = () => (
  <SkeletonItem>
    <TitleSkel />
    <SectionTitleSkel />
    <LineSkel w="95%" />
    <Hr />

    {[1, 2, 3, 4].map((k) => (
      <Row key={k}>
        <IconSkel />
        <LabelSkel />
        {k === 1 && <TagSkel />}  
      </Row>
    ))}
  </SkeletonItem>
);

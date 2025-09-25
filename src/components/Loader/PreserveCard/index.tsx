import React from "react";
import {
  CardContainer,
  TopImagePlaceholder,
  BannerPlaceholder,
  Header,
  BadgePlaceholder,
  Col1,
  TitlePlaceholder,
  SubTitlePlaceholder,
  InfoContainer,
  MetricPlaceholder,
  MetricValue,
  MetricAttr,
  DescPlaceholder,
  Activities,
  ActivityPlaceholder,
  ButtonPlaceholder
} from "./Elements"; 



/* ---------- main skeleton component ---------- */
export const SkeletonTrailCard = () => (
  <CardContainer>
    <TopImagePlaceholder />
    <BannerPlaceholder />
    <Header>
      <BadgePlaceholder />
      <Col1>
        <TitlePlaceholder />
        <SubTitlePlaceholder />
      </Col1>
    </Header>

    <InfoContainer>
      {[...Array(3)].map((_, idx) => (
        <MetricPlaceholder key={idx}>
          <MetricValue />
          <MetricAttr />
        </MetricPlaceholder>
      ))}
    </InfoContainer>

    <div style={{ width: "100%", margin: "8px 0" }}>
      <DescPlaceholder />
      <DescPlaceholder />
      <DescPlaceholder style={{ width: "60%" }} />
    </div>

    <Activities>
      {[...Array(3)].map((_, idx) => (
        <ActivityPlaceholder key={idx} />
      ))}
    </Activities>

    <ButtonPlaceholder />
  </CardContainer>
);


// Core
import React from "react";

// Components
import CarouselCard from "../../components/CarouselCard/CarouselCard";
import "../../components/CarouselCard/CarouselCard.css";

interface PopUpStyleProps {
  isMobile: boolean;
  title: string;
  description: string;
  images: Array<string>;
};

// Component def
const PopupBody = ({ isMobile, title, description, images }: PopUpStyleProps) => {

  return (
    
      <CarouselCard
        width={240}
        cardWidth={170}
        gapWidth={12}
        imageHeight={160}
        images={images}
        title={title}
        description={description}
      />

  );

};

export default PopupBody;





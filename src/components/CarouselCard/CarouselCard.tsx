import React, { useRef, useState } from "react";

export type CarouselCardProps = {
  width: number;
  images: string[];
  title: string;
  description: string;
  cardWidth: number;
  gapWidth: number;
  imageHeight: number; 
  className?: string;        // optional wrapper class
};

export default function CarouselCard({
  width = 340,
  images,
  title,
  description = "I am a standard, default description sitting here and waiting to be updated.",
  cardWidth = 250,
  gapWidth = 12, 
  imageHeight = 180,
  className = "",
}: CarouselCardProps) {

  // Refs  
  const trackRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<number>((width - cardWidth + (2 * gapWidth)) / 2);

  // State variables
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const translateX = dragX;

  const beginDrag = (x: number) => {
    setIsDragging(true);
    console.log(`Drag has started ${x}`);
  };
  const moveDrag = (x: number) => {
    if (!isDragging) return;
    console.log(`Dragging: ${x}`)
  };  
  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    console.log("Drawing has ended.");
  };    
  const slideClicked = (index: number) => {
    if(index === 0) {
      // First picture
      setIndex(index);
      setDragX(0);
    }
    else if (index === images.length - 1) {
      // Final picture
      setIndex(index);
      setDragX( (((index * cardWidth) + (index * gapWidth) ) * -1 ) + peekRef.current );
    }
    else {
      // Picture between the first- and the last pictures
      setIndex(index);
      //setDragX(((index * (cardWidth + gapWidth)) * -1) + (1 * peekRef.current));

      setDragX( (((index * cardWidth) + (index * gapWidth) ) * -1) + peekRef.current / 2 );
    }
  }
  const onMouseDown: React.MouseEventHandler = (e) => {
    e.preventDefault();
    beginDrag(e.clientX);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    onMouseMove(
        new MouseEvent("mousemove", {
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true,
        })
      );    
  };
  const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX);
  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    endDrag();
  };  

  const showActiveDot = index;

  return (
    <div className={`ccard ${className}`} style={{width: width}}>
      {/* Row 1: carousel */}
      <div className="ccard-carousel">
        <div
          ref={trackRef}
          className="ccard-track"
          style={{
            height: imageHeight,
            transform: `translateX(${translateX}px)`,
            transition: "transform 320ms ease"
          }}
          onMouseUp={onMouseUp}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="ccard-slide"
              style={{ width: `${cardWidth}px`, height: imageHeight }}
              onClick={() => slideClicked(i)}              
            >
              <img src={src} alt={`Slide ${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>

      </div>

      <div className="ccard-dots">
          <div className="ccard-dots-bg">
            {images.map((_, i) => {
              const active = showActiveDot === i;
              return (
                <button
                  key={i}
                  aria-label={`Go to image ${i + 1}`}
                  className={`ccard-dot ${active ? "is-active" : ""}`}
                  onClick={() => {
                    slideClicked(i);
                    setIndex(i);
                  }}
                />
              );
            })}
          </div>
        </div>      

      {/* Row 2: text */}
      <div className="ccard-body">
        <h3 className="ccard-title">{title}</h3>
        {description ? <p className="ccard-desc">{description}</p> : null}
      </div>
    </div>
  );
}

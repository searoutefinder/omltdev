export const handleSidebarToggle = (map : mapboxgl.Map | null , collapsed : boolean, isMobile:boolean) => {
  if (map && !isMobile) {
      map.easeTo({
        padding: {
          left: collapsed ? 525 : 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
        duration: 1000,
      });
    }
  };


interface TouchHandlerPropsToggle {
  type: 'right' | 'left';
  startX: React.MutableRefObject<number | null>;
  currentX: React.MutableRefObject<number | null>;
  collapsed: boolean;
  setterIsCollapsed: (value: boolean) => void;
}


//start touch
export const handleTouchStart = (e: React.TouchEvent, props: Pick<TouchHandlerPropsToggle, 'startX'>) => {
  props.startX.current = e.touches[0].clientX;
}

//move touch
export const handleTouchMove = (e: React.TouchEvent, props: Pick<TouchHandlerPropsToggle, 'currentX' | 'startX'>) => {
  props.currentX.current = e.touches[0].clientX;
}

//calculate diff
export const handleTouchEndToggle = (props: TouchHandlerPropsToggle) => {
  const swipeDistance = props.currentX.current && props.startX.current ? props.currentX.current - props.startX.current : 0;  
  const SWIPE_THRESHOLD = 70; 

  if (props.type === 'left') {
    if (swipeDistance > SWIPE_THRESHOLD && props.collapsed) {
      props.setterIsCollapsed(false);
    }  
    
    if (swipeDistance < -SWIPE_THRESHOLD && !props.collapsed) {
      props.setterIsCollapsed(true);
    }
  } else if (props.type === 'right') {
    if (swipeDistance > SWIPE_THRESHOLD && !props.collapsed) {
      props.setterIsCollapsed(true);
    }  
  }
 //reset trackers
  props.startX.current = null;
  props.currentX.current = null;
};


// interface touch
interface TouchHandlerPropsCarousel {
  startX: React.MutableRefObject<number | null>;
  currentX: React.MutableRefObject<number | null>;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; 
  imagesLength: number;
  setTranslateX: (value: number) => void;
}

export const handleTouchMoveCarousel = (e: React.TouchEvent, props: Pick<TouchHandlerPropsCarousel, 'startX' | 'setTranslateX' | 'currentIndex' | 'imagesLength'>) => {
  if (props.startX.current !== null) {
    let deltaX = e.touches[0].clientX - props.startX.current;
    const { currentIndex, imagesLength } = props;

    //prevent over swipe
    if (currentIndex === 0 && deltaX > 0) {
      deltaX = 0;
    } else if (currentIndex === imagesLength - 1 && deltaX < 0) {
      deltaX = 0;
    }

    props.setTranslateX(deltaX);
  }
};

export const handleTouchEndCarousel = (props: TouchHandlerPropsCarousel & { translateX: number, setTranslateX: (value: number) => void }) => {
  const SWIPE_THRESHOLD = 0.15; 
  const containerWidth = window.innerWidth; 
  const swipeDistance = props.translateX / containerWidth;

  if (swipeDistance > SWIPE_THRESHOLD && props.currentIndex > 0) {
    props.setCurrentIndex((prevIndex: number) => prevIndex - 1);
  } else if (swipeDistance < -SWIPE_THRESHOLD && props.currentIndex < props.imagesLength - 1) {
    props.setCurrentIndex((prevIndex: number) => prevIndex + 1);
  }

  props.setTranslateX(0); 
  props.startX.current = null;
};




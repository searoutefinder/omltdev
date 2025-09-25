import {Expression} from '../types'

//line widths
export const LineWidths = {
  base: {

    mobile: [
      "interpolate", ["linear"], ["zoom"],
      11, 1,
      13, 1.5,
      15, 3
    ] as Expression,
    
    desktop: [
      "interpolate", ["linear"], ["zoom"],
      11, 1,
      13, 1.5,
      15, 3
    ] as Expression,
  },

  highlight: {
    
    mobile: [
      "interpolate", ["linear"], ["zoom"],
      10, 4,
      13, 5,
      15, 11
    ] as Expression,
    
    desktop: [
      "interpolate", ["linear"], ["zoom"],
      10, 4,
      13, 4,
      15, 11
    ] as Expression,
  }
};


//selected line color
export const SelectedLineColors = {
  mobile: 'rgba(153, 191, 216, .9)',
  desktop: 'rgba(153, 191, 216, .9)'
};


//preserve label sizes
export const PreserveLabelSizes = {
  mobile: [
    "interpolate", ["linear"], ["zoom"],
    5, 11,
    13, 12,
    14, 12,
    18, 16
  ] as Expression,
  
  desktop: [
    "interpolate", ["linear"], ["zoom"],
    5, 11,
    13, 12,
    14.403, 15,
    18, 15.3
  ] as Expression
};


//ignore this - hardcoded
export const idMap: { [key: number]: string } = {
  0: '/img/raster/Map/Three_Sisters.png',
  1: '/img/raster/Map/Schumann.png'
};
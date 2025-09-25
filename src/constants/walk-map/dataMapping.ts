import { Bbox } from '../../types/preserve-map';


//1.MAIN SOURCES FOR LOADING INDICATORS-----------------------------
export const sources = ['trails-source', 'kiosks-source', 'pois-source']

//constants for data mapping and validation
export const fieldMap = {
    id: 'id',
    trail_name: 'trail_name',
    description: 'description',
    activity: 'activity',
    distance: 'distance',
    max_grade: 'max_grade',
    min_width: 'min_width',
    surface: 'surface',
    road_segm: 'road_segm',
    donation_url: 'donation_url',
    donation_text: 'donation_text'
};



//#FIX-MOVE TO DATABASE 
export const BboxesMap: Record<string, Bbox> =  {
    'ThreeSistersPreserve': [[-73.809, 44.385], [-73.799, 44.377]],
    'SchumannPreserve': [[-73.6304, 43.4573], [-73.6047, 43.4751]],
    'SchumannPreserve3D': [[-73.6304, 43.4573], [-73.6047, 43.4751]],
    'ThePinnaclePreserve': [[-73.690, 43.54485], [-73.66796, 43.56983]],
    'BerryPondPreserve': [[-73.8014, 43.3775], [-73.7135, 43.4242]],
    "PeggysPoint": [
      [
        -73.498036,
        43.744275
      ],
      [
        -73.495964,
        43.745538
      ]
    ],
    "LeemingJelliffePreserve": [
      [
        -73.493157,
        43.65251
      ],
      [
        -73.488038,
        43.6579
      ]
    ],
    "GodwinPreserve": [
      [
        -73.658846,
        43.629262
      ],
      [
        -73.647211,
        43.635993
      ]
    ],
    "TerzianWoodlotPreserve": [
      [
        -73.521373,
        43.673201
      ],
      [
        -73.512775,
        43.682863
      ]
    ],
    "AnthonysNosePreserve": [
      [
        -73.471711,
        43.768123
      ],
      [
        -73.447766,
        43.775752
      ]
    ],
    "CookMountain": [
      [
        -73.454005,
        43.811368
      ],
      [
        -73.435367,
        43.819617
      ]
    ],
    "PoleHillPond": [
      [
        -73.652307,
        43.60042
      ],
      [
        -73.610485,
        43.63599
      ]
    ],
    "SuckerBrook": [
      [
        -73.463452,
        43.73123
      ],
      [
        -73.430901,
        43.766741
      ]
    ],
 
  "AmysParkPreserve": [[
      -73.66692223294329, 
      43.63604457034549, 
    ],
    [-73.62744441073225, 
      43.661026273430366

    ]
  ],

  "CatThomasMountainsPreserve": [
    [-73.73869382680381, 43.556342931327826],
    [-73.6861486128637, 43.609056652654985]
  ],


    "walkmaps": [ 
      [
        -73.135858, 44.3229
      ],
      [
        -74.149876, 44.330784
      ]
    ], 

  }

export const WixUrlMap: Record<string, string>= { 
    'Berry Pond Preserve': 'https://www.greengoatmaps.com/greengoatmaps-com-lglc-berry-pond',
    'Schumann Preserve': 'https://www.greengoatmaps.com/greengoatmaps-com-lglc-the-schumann-preserve-at-pilot-knob',
    'The Pinnacle Preserve': 'https://www.greengoatmaps.com/greengoatmaps-com-lglc-the-pinnacle'
};


  // Maps for allowed and prohibited activities --------------------
export const allowedActivityIconsMap : {[key: string]: string} = {
    hiking : '/img/raster/Popup/hiking.png',
    cycling : '/img/raster/Popup/cycling.png',
    skiing : '/img/raster/Popup/skiing.png',
    handicap: '/img/raster/Popup/handicap.png',
};
export const prohibitedActivityIconsMap : {[key: string]: string} = {
    snowmobile : '/img/raster/Popup/noSnowmobile.png',
    ATV: '/img/raster/Popup/noATV.png',
};
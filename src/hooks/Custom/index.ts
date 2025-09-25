import { useEffect } from 'react';
import { ExpressionSpecification } from 'mapbox-gl';

// interface
interface ElevateLayerOnPitchProps {
  mapInstance: mapboxgl.Map | null;
  dataLoaded:boolean;
  styleLoaded: boolean;
  layerIds: string[];
}

export const ElevateLayerOnPitch = ({ mapInstance, dataLoaded, styleLoaded, layerIds}: ElevateLayerOnPitchProps) => {
  

  useEffect(() => {
    if (!mapInstance || !styleLoaded || !dataLoaded) return;

    try {
      layerIds.forEach((layerId) => {
        const layer = mapInstance.getLayer(layerId);
        if (layer && layer.filter) {
          const lowPitchFilter = ['all', layer.filter, ['<', ['pitch'], 50]];
          mapInstance.setFilter(layerId, lowPitchFilter as ExpressionSpecification);

          const elevatedLayerId = `${layerId}-elevated`;
          if (!mapInstance.getLayer(elevatedLayerId)) {
            const elevatedLayer: mapboxgl.Layer = {
              ...layer,
              id: elevatedLayerId,
              layout: {
                ...layer.layout,
                'icon-image': 'elevation-line',
                'icon-anchor': 'bottom',
                'text-offset': [-3, -2.8],
                'text-allow-overlap': true,
                'text-ignore-placement': true,
                'text-field': [
                  'concat',
                  ['coalesce', ['get', 'name_en'], ['get', 'name']],
                  '\n',
                  [
                    'concat',
                    ['to-string', ['get', 'elevation_m']],
                    'm (',
                    ['to-string', ['get', 'elevation_ft']],
                    'ft)'
                  ]
                ]
              },
              filter: ['all', layer.filter, ['>=', ['pitch'], 50]],
            };

            mapInstance.addLayer(elevatedLayer, layerId);
          }
        }
      });
    } catch (error) {
      console.error('Error in ElevateLayerOnPitch:', error);
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerIds, styleLoaded, dataLoaded]);
};

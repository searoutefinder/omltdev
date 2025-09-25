import { useEffect, useRef } from 'react';
import { FeatureCollection, Point, Feature } from 'geojson';
import { loadImageAsync } from "../../../utils/loadImageForLib";


type Filter = mapboxgl.FilterSpecification;

interface Props {
  mapInstance: mapboxgl.Map | null;
  styleLoaded: boolean;
  data: FeatureCollection<Point> | null;
  filterIds: number[];
  selectedFeatureId: number | null;
  sourceId: string;
  layerId: string;
}

/*  add source + layers  ––––––––––––––––––––––––––––––––––––––––––––– */
export const useAddSourceAndLayers = ({
  mapInstance,
  styleLoaded,
  data,
  filterIds,
  selectedFeatureId,
  sourceId,
  layerId,
}: Props) => {

  const originalFC = useRef<FeatureCollection<Point> | null>(null);

  useEffect(() => {
    if (!mapInstance || !styleLoaded || !data) return;

    //0. cache original feature collection
    originalFC.current = data;

    // 1. add source (only first time)
    if (!mapInstance.getSource(sourceId)) {
      mapInstance.addSource(sourceId, {
        type: 'geojson',
        data,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });
    }

    // 2. add layers (only once)
    Promise.all([
      loadImageAsync(mapInstance, 'unselected-marker',
        '/img/raster/RisingRoutes/map_marker.png'),
    ]).then(() => {

      // 2.1 cluster circles
      if (!mapInstance.getLayer('clusters')) {
        mapInstance.addLayer({
          id: 'clusters',
          type: 'circle',
          maxzoom: 14,
          source: sourceId,
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': 'rgba(198,198,198,0.78)', 
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2,
            'circle-radius': [
              'step', ['get', 'point_count'],
              15, 5,
              20, 10,
              25, 15,
              30, 20,
              35, 25,
              40,
            ],
          },
        });
      }

      /* 2.2 cluster count */
      if (!mapInstance.getLayer('cluster-count')) {
        mapInstance.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          maxzoom: 14,
          source: sourceId,
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-size': 12,
            'text-allow-overlap': true,
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],

          },
          paint: { 
            'text-color': '#5e5c5c' 
          },
        });
      }

      /* 2.3 individual symbols */
      if (!mapInstance.getLayer(`${layerId}-unselected`)) {
        mapInstance.addLayer({
          id: `${layerId}-unselected`,
          type: 'symbol',
          maxzoom: 22,
          source: sourceId,
          filter: ['all', ['!', ['has', 'point_count']]], //all leaves
          layout: {
            'icon-image': 'unselected-marker',
            'icon-size': 0.75,
            'icon-allow-overlap': true,
            'symbol-placement': 'point',
            'icon-anchor': 'bottom',
          },
        });
      }
    });
  }, [mapInstance,
    styleLoaded,
    data,
    sourceId,
    layerId,
  ]);

  // 2) on every filter / selection – rebuild source data  
  useEffect(() => {
    if (!mapInstance || !styleLoaded || !originalFC.current) return;

    const src = mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource;
    if (!src) return;

    // 2.1 build new feature list 
    let features: Feature<Point>[] = [];

    if (filterIds.length > 0) {
      const idSet = new Set(filterIds);
      features = originalFC.current.features.filter(
        f => typeof f.id === 'number' && idSet.has(f.id as number)
      );
    }

    if (selectedFeatureId != null && features.length > 0) {
      features = features.filter(f => f.id !== selectedFeatureId);
    }


    //2.2 setData -> mapbox reclustering
    src.setData({ type: 'FeatureCollection', features });

    //2.3 update symbol layer filter (hide selected one) 
    const symbolFilter: Filter =
      selectedFeatureId != null
        ? ['all', ['!', ['has', 'point_count']], ['!=', ['id'], selectedFeatureId]]
        : ['all', ['!', ['has', 'point_count']]];

    if (mapInstance.getLayer(`${layerId}-unselected`)) {
      mapInstance.setFilter(`${layerId}-unselected`, symbolFilter);
    }

  }, [
    mapInstance,
    styleLoaded,
    sourceId,
    layerId,
    filterIds,
    selectedFeatureId,
  ]);
};

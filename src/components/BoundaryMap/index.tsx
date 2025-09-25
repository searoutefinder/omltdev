//libs
import { useRef, useEffect, useState, useMemo, useContext, useCallback } from "react";
import mapboxgl from 'mapbox-gl';
//types 
import { FeatureCollection, MultiPolygon, Polygon } from "geojson";
//context 
import { SavedContext } from "../../context/CreateContext";
//data
import { basemapsTrailMaps, basemapsConfig} from "../Basemaps/configs";
import {BasemapConfigTypes} from "../Basemaps/types";
//css 
import 'mapbox-gl/dist/mapbox-gl.css';
import LoaderEl from "../Loader/Spinner";
//styles
import { Container, MapCanvas, MapContainer } from '../PreserveMap/MapsElements';
import { ResetButton } from '../PreserveMap/MapsElements'
import TopBar from '../TopBar';
//fncs
import MapProperties from './Controls';
import { FullScreenModal } from '../Modals/FullScreenModal';
//hooks
import { DataFetcher } from "./Hooks/dataFetcher";
import { AddLayers } from "./Hooks/addLayers";
//utils
import { resetViewBounds} from '../../utils/Camera/resetView';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';


const BoundaryPage = () => {

    //Context 
    const { isMobile, isIOS } = useContext(SavedContext);

    //------------------REFS----------------------------
    //layout
    const mapCanvas = useRef<HTMLDivElement>(null);
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    //data 
    const geojsonPreserveRef = useRef<FeatureCollection<Polygon | MultiPolygon> | null>(null);

    //------------------STATES----------------------------
    //data
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [layersLoaded, setLayersLoaded] = useState<boolean>(false);

    //states
    const [mapStyle, setMapStyle] = useState<string>(basemapsTrailMaps[0]);
    const [styleLoaded, setStyleLoaded] = useState<boolean>(false);
    const [currentTheme, setCurrentTheme] = useState<BasemapConfigTypes>(null);
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);


    //hooks
    useEffect(() => {
        if (mapContainer.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: [-73.65, 43.55],
                zoom: 11,
                pitch: 0,
                bearing: 0,
                minZoom: 10,
                maxZoom: 18,
                maxPitch: 70,
                attributionControl: false,
                respectPrefersReducedMotion: true,
            });

            //set styleLoaded to true
            map.current.on('style.load', () => {
                setCurrentTheme(basemapsConfig(mapStyle, isMobile, null));
                setStyleLoaded(true);
            });
        }
        return () => {
            if (map.current) {
                map.current.remove();
                setStyleLoaded(false);
            }
        };
    }, [isMobile, mapStyle]);


    //1. data fetcher 
    DataFetcher({
        styleLoaded: styleLoaded,
        geojsonPreserveRef: geojsonPreserveRef,
        setDataLoaded: setDataLoaded
    });

    //2. add layers
    AddLayers({
        mapInstance: map.current,
        isMobile: isMobile,
        styleLoaded: styleLoaded,
        dataLoaded: dataLoaded,
        geojsonPreserveRef: geojsonPreserveRef,
        currentTheme: currentTheme,
        setLayersLoaded: setLayersLoaded  
    });


    //END OF HOOKS ----------------------------------------------
    const ResetViewFunction = useCallback(() => {
        resetViewBounds({
            mapInstance: map.current,
            styleLoaded: styleLoaded,
        });

    }, [styleLoaded]);


    const TopBarRender = useMemo(() => (
        <TopBar mapCanvas={mapCanvas}
            isFullScreen={isFullScreen}
            webMapName={'LGLC Boundaries'}
            setIsFullScreen={setIsFullScreen}
            setShowModal={setShowModal} />
    ), [isFullScreen]);

    const LoaderRender = useMemo(() => (
        <LoaderEl styleLoaded={styleLoaded} dataLoaded={dataLoaded} layersLoaded={layersLoaded} />
      ), [styleLoaded, layersLoaded, dataLoaded]);


      const BasemapsContainerRender = useMemo(() => (
        <MapProperties mapRef={map.current}
          styleLoaded={styleLoaded}
          isMobile={isMobile}
          style={mapStyle}
          basemapsTrailMaps={basemapsTrailMaps}
          setMapStyle={setMapStyle}
          setStyleLoaded={setStyleLoaded} />
      ), [isMobile, mapStyle, styleLoaded]);  
    
    //jsx
    return (
        <Container ref={mapCanvas}>
            <FullScreenModal isMobile={isMobile} isIOS={isIOS} isFullScreen={isFullScreen} showModal={showModal} setShowModal={setShowModal} />
            {TopBarRender}
            <MapCanvas>
                {LoaderRender}
                <ResetButton onClick={ResetViewFunction}>Reset View</ResetButton>
                {BasemapsContainerRender}
                <MapContainer ref={mapContainer} id="map-container" />
            </MapCanvas>
        </Container>
    );

};

export default BoundaryPage;
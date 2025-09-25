//libs
import { useRef, useEffect, useState, useCallback, useMemo, useContext} from "react";
import mapboxgl from 'mapbox-gl';
//types
import { FeatureCollection, LineString, MultiPolygon, Polygon, Point } from "geojson";
import { Bbox, PopupDataItem, ImageProps } from "../../types/walk-maps";
//css
import 'mapbox-gl/dist/mapbox-gl.css';
import { Container, MapContainer, MapCanvas, ResetButton } from "./MapsElements";
import LoaderEl from "../Loader/Spinner";
//data
import { basemapsWalkMaps, basemapsConfig} from "../Basemaps/configs";
import { BasemapConfigTypes } from "../Basemaps/types";

//context
import { MapContext, SavedContext, PopupContext } from "../../context/CreateContext";

//components
import Popup from "../Popups/Popup";
import "../Popups/Popup.css";

//fcns
import TopBar from "../TopBar";
import { FullScreenModal } from "../Modals/FullScreenModal";
import { LeftSidebar } from "../Sidebars/LeftSidebar/walk-map";
import MapProperties from "./Controls";
//hooks
import { ViewportSetter } from "../../hooks/UseEffect/viewportSetter";
import { AddControls } from "../../hooks/UseEffect/addControls";
import { AddLayers } from "../../hooks/UseEffect/walk-map/addLayers";
import { AddEventListeners } from "../../hooks/UseEffect/walk-map/addEventListeners";
import { ElevateLayerOnPitch } from "../../hooks/Custom";
import { LineHighlight } from "../../hooks/UseEffect/lineHighlight";
import { LineFit } from "../../hooks/UseEffect/mobiles/lineFit";
import { LinePopupOnZoom } from "../../hooks/UseEffect/mobiles/linePopups";
import { SidebarController } from "../../hooks/UseEffect/sidebarController";
import { DataFetcher } from "../../hooks/UseEffect/walk-map/dataFetcher";
import { SetSidebarData } from "../../hooks/UseEffect/walk-map/setSidebarData";
// import { ImageFetcher } from "../../hooks/UseEffect/imageFetcher";
import { AddDirArrowsLayer } from "../../hooks/UseEffect/addDirArrowsLayer";
// import { UseBboxWorker } from "../../hooks/UseEffect/web-workers/useBboxWorker";
import { UsePopupWorker } from "../../hooks/UseEffect/web-workers/usePopupWorker";
import {useAutoScrollIntoView} from "../../hooks/UseEffect/useAutoScrollIntoView";
//utils
import { handleSidebarToggle, } from "../../utils/Gestures/Sidebar";
import { resetView } from "../../utils/Camera/resetView";
import { SidebarDataProps } from "../../utils/getSidebarData";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';


const MapPage = () => {

  //---------------CONTEXTS -------------------------
  const { isMobile, isIOS } = useContext(SavedContext);
  const { mapState } = useContext(MapContext);
  const { clickedFeature } = useContext(PopupContext);

  //------------------REFS----------------------------
  //layout
  const mapCanvas = useRef<HTMLDivElement | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const itemsWrapperRef = useRef<HTMLDivElement | null>(null);
  //data
  const jsonMasterTableRef = useRef<any | null>(null);
  const geojsonTrailsRef = useRef<FeatureCollection<LineString> | null>(null);
  const geojsonPreserveRef = useRef<FeatureCollection<Polygon | MultiPolygon> | null>(null);
  const geojsonPOIsRef = useRef<FeatureCollection<Point> | null>(null);
  const geojsonKiosksRef = useRef<FeatureCollection<Point> | null>(null); 

  //map
  const hoveredFeatureId = useRef<number | null>(null);
  
  //donation card
  const hasSetDonationInfo = useRef<boolean>(false);
  
  //------------------STATES-----------------------------
  //layout
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  
  //data
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const [activePreserve] = useState<string | null>('walkmaps'); //default preserve
  //mobile 
  const [popupData, setPopupData] = useState<PopupDataItem[]>([]);

  //map
  const [mapStyle, setMapStyle] = useState<string>(basemapsWalkMaps[0]);
  const [styleLoaded, setStyleLoaded] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<BasemapConfigTypes>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [layersLoaded, setLayersLoaded] = useState<boolean>(false);
 
  //viewport
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(14.2);
  const [, setCenter] = useState<mapboxgl.LngLat | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  //sidebar 
  const [sidebarData, setSidebarData] = useState<SidebarDataProps[] | null>(null);
  const [logoURL] = useState<ImageProps[] | []>([]);
  const [isCollapsedLeft, setIsCollapsedLeft] = useState<boolean>(true);
  const [isCollapsedRight, setIsCollapsedRight] = useState<boolean>(true);
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);



  //initialize map object and add controls
  useEffect(() => {
    if (mapContainer.current && dataLoaded && mapState.bbox && mapState.webMapName && mapState.owner) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [mapState.center[0], mapState.center[1]],
        zoom: mapState.zoom,
        pitch: mapState.pitch,
        bearing: mapState.bearing,
        minZoom: mapState.minZoom,
        maxZoom: mapState.maxZoom,
        maxPitch: mapState.maxPitch,
        attributionControl: false,
        respectPrefersReducedMotion: true,
      });
      //set styleLoaded to true
      map.current.on('load', () => {

        
        setCurrentTheme(basemapsConfig(mapStyle, isMobile, mapState.id));
        setStyleLoaded(true);
      });
    }

    //cleanups => remove map instance
    return () => {
      map.current?.remove();
      setStyleLoaded(false);
    };

  }, [mapStyle, 
      isMobile, 
      dataLoaded, 
      mapState]);


  //-----------Hooks------------------

  //1. AddControls
  AddControls({
    mapInstance: map.current,
    geolocateControl: geolocateControl,
    styleLoaded: styleLoaded,
    isMobile: isMobile
  });


  //2. DataFetcher
  DataFetcher({
    jsonMasterTableRef: jsonMasterTableRef,
    geojsonTrailsRef: geojsonTrailsRef,
    geojsonPOIsRef: geojsonPOIsRef,
    geojsonKiosksRef: geojsonKiosksRef,
    setIsLoading: setIsLoading,
    setDataLoaded: setDataLoaded
  });

 
  //3. ViewportSetter
  ViewportSetter({
    mapInstance: map.current,
    styleLoaded: styleLoaded,
    setCenter: setCenter,
    setZoomLevel: setZoomLevel,
    setBounds: setBounds
  })


  //6. AddLayers
  AddLayers({
    mapInstance: map.current,
    mainSources: mapState.dataRefs.sourceNames,
    dataLoaded: dataLoaded,
    dataRefs: mapState.dataRefs,
    geojsonPreserveRef: geojsonPreserveRef,
    geojsonTrailsRef: geojsonTrailsRef,
    geojsonPOIsRef: geojsonPOIsRef,
    geojsonKiosksRef: geojsonKiosksRef,
    styleLoaded: styleLoaded,
    currentTheme: currentTheme,
    isMobile: isMobile,
    setLayersLoaded: setLayersLoaded
  })


  //8. AddEventListeners
  AddEventListeners({
    mapInstance: map.current,
    source: mapState.dataRefs.trailSourceName,
    isMobile: isMobile,
    hoveredFeatureId: hoveredFeatureId.current,
    layersLoaded: layersLoaded,
    isCollapsedLeft: isCollapsedLeft,
    isCollapsedRight: isCollapsedRight,
    setIsCollapsedLeft: setIsCollapsedLeft,
    setIsCollapsedRight: setIsCollapsedRight,
    setSelectedTrailId: setSelectedTrailId,
    setOpenItemIndex: setOpenItemIndex,
  });

  
  //9. ElevateLayerOnPitch
  ElevateLayerOnPitch({
    mapInstance: map.current,
    dataLoaded: dataLoaded,
    styleLoaded: styleLoaded,
    layerIds: ["natural-point-label", "natural-point-label elevation"],
  });


  //10. LineHighlight
  LineHighlight({
    mapInstance: map.current,
    source: mapState.dataRefs.trailSourceName,
    selectedTrailId: selectedTrailId,
    layersLoaded: layersLoaded,
  }
  );

  //11.1. LineFitOnMobile - mobile only
  LineFit({
    mapInstance: map.current,
    selectedTrailId: selectedTrailId,
    isMobile: isMobile,
    geojson: geojsonTrailsRef.current,
  });

  
  //11.2. Use Popup Worker - mobile only
  UsePopupWorker({
    isMobile: isMobile,
    geojson: geojsonTrailsRef.current,
    zoomLevel: zoomLevel,
    bounds: bounds,
    activePreserve: activePreserve,
    setPopupData: setPopupData
  });


  //11.3. LinePopupOnZoom - mobile only
  LinePopupOnZoom({
    mapInstance: map.current,
    styleLoaded: styleLoaded,
    activePreserve: activePreserve,
    popupData: popupData,
    bounds: bounds,
    zoomLevel: zoomLevel,
    isMobile: isMobile,
    isCollapsedLeft: isCollapsedLeft,
    setSelectedTrailId: setSelectedTrailId,
    setOpenItemIndex: setOpenItemIndex,
    setIsCollapsedLeft: setIsCollapsedLeft
  });


  //12. SidebarController
  SidebarController({
    mapInstance: map.current,
    isMobile: isMobile,
    isCollapsedRight,
    isCollapsedLeft,
    setIsCollapsedRight,
    setIsCollapsedLeft
  });


  //13. SetSidebarData
  SetSidebarData({
    styleLoaded: styleLoaded,
    isLoading: isLoading,
    dataLoaded: dataLoaded,
    activePreserve: activePreserve,
    geojson: geojsonTrailsRef.current,
    bbox: mapState?.bbox as Bbox,
    setSidebarData: setSidebarData, 
    setIsLoading: setIsLoading
  })


  //Add second group of layers ----------
  //15.1 AddDirArrowsLayer
  AddDirArrowsLayer({
    mapInstance: map.current,
    dataLoaded: dataLoaded,
    styleLoaded: styleLoaded,
    geojsonTrailsRef: geojsonTrailsRef,
    currentTheme: currentTheme,
  });


  //#Tamas 7:This is also needded to make it functional for now. Later if nedded you can add this functionality by following my example. 
  // //16. UseBboxWorker
  // UseBboxWorker({ 
  //    styleLoaded: styleLoaded,
  //    bounds: bounds,
  //    center: center,
  //    zoomLevel: zoomLevel,
  //    setActivePreserve: setActivePreserve,
  //    setIsLoading: setIsLoading,
  // });

  

  //18. AutoScrollIntoView
  useAutoScrollIntoView({
    isOpen: !isCollapsedLeft,          
    containerRef: itemsWrapperRef,
    selectedId: openItemIndex,        
});


  // console.log('mapState:', mapState);



  //END OF HOOKS ----------------------------------------------

  //---- PERFORMANCE OPTIM. ---#fix/use memo to prevent reredering in jsxs--//
  const ResetViewFunction = useCallback(() => {
    resetView({
      mapInstance: map.current,
      styleLoaded: styleLoaded,
      isCollapsedLeft: isCollapsedLeft,
      isMobile: isMobile,
      bbox: mapState.bbox as Bbox,
      setIsCollapsedLeft: setIsCollapsedLeft,
      setIsCollapsedRight: setIsCollapsedRight,
      setOpenItemIndex: setOpenItemIndex,
      setSelectedTrailId: setSelectedTrailId,
      handleSidebarToggle: handleSidebarToggle,
    });

  }, [isCollapsedLeft, isMobile, mapState.bbox, styleLoaded]);


  //#Tamas 6 . You dont need  to have hook update defaults on fly here, 
  //as you are using the mapState from context. These parts are for simultaneous updates of preserve data on fly for UI parts: TopBar and LeftSidebar(panel). so upon switching between preserve on camera move
  const TopBarRender = useMemo(() => (
    <TopBar mapCanvas={mapCanvas}
      isFullScreen={isFullScreen}
      webMapName={mapState?.webMapName}
      setIsFullScreen={setIsFullScreen}
      setShowModal={setShowModal} />
  ), [isFullScreen, 
      mapState]);



  const BasemapsContainerRender = useMemo(() => (
    <MapProperties mapRef={map.current}
      styleLoaded={styleLoaded}
      isMobile={isMobile}
      style={mapStyle}
      basemapsWalkMaps={basemapsWalkMaps}
      setMapStyle={setMapStyle}
      setStyleLoaded={setStyleLoaded} />

  ), [isMobile, mapStyle, styleLoaded]);


  const LeftSidebarRender = useMemo(() => (
    <LeftSidebar
      map={map.current}
      isMobile={isMobile}
      styleLoaded={styleLoaded}
      webMapName={mapState?.webMapName}
      owner={mapState?.owner}
      logoURL={logoURL}
      dataLoaded={dataLoaded}
      sidebarData={sidebarData}
      isCollapsedLeft={isCollapsedLeft}
      openItemIndex={openItemIndex}
      selectedTrailId={selectedTrailId}
      hasSetDonationInfo={hasSetDonationInfo}
      isLoading = {isLoading}
      itemsWrapperRef={itemsWrapperRef}
      setIsCollapsedLeft={setIsCollapsedLeft}
      setSelectedTrailId={setSelectedTrailId}
      setOpenItemIndex={setOpenItemIndex}
      setIsCollapsedRight={setIsCollapsedRight}
    />
  ), [dataLoaded, 
      isCollapsedLeft, 
      isLoading, 
      isMobile, 
      logoURL, 
      mapState,  
      openItemIndex, 
      selectedTrailId, 
      sidebarData, 
      styleLoaded]);


 

  const LoaderRender = useMemo(() => (
    <LoaderEl isMobile = {isMobile} styleLoaded={styleLoaded} dataLoaded={dataLoaded} layersLoaded={layersLoaded} />
  ), [isMobile, styleLoaded, dataLoaded, layersLoaded]);


  // console.log("bounds:", bounds)
  // console.log('is mobile', isMobile); 
  
  //END OF PERFORMANCE OPTIM. -----//
  return (
    <Container ref={mapCanvas}>
      <FullScreenModal  
        isMobile={isMobile} 
        isIOS={isIOS} 
        isFullScreen={isFullScreen} 
        showModal={showModal} 
        setShowModal={setShowModal}
      />
      {TopBarRender}
      <MapCanvas >
        {LoaderRender}
        <ResetButton onClick={ResetViewFunction}>
          Reset View
        </ResetButton>
        {LeftSidebarRender}
        {BasemapsContainerRender}
        <MapContainer ref={mapContainer} />
        {
          clickedFeature && ( 
            <Popup map={map.current} activeFeature={clickedFeature} />
          ) 
        }
      </MapCanvas>
    </Container>
  );
};

export default MapPage;

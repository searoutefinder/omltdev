//libs
import { useRef, useEffect, useState, useCallback, useMemo, useContext} from "react";
import mapboxgl from 'mapbox-gl';
//types
import { FeatureCollection, LineString, MultiPolygon, Polygon, Point } from "geojson";
import { Bbox, DonationInfoProps, PopupDataItem, ImageProps } from "../../types/preserve-map";
import { SidebarDataProps } from "@/utils/preserve-map/getSidebarData";

//css
import 'mapbox-gl/dist/mapbox-gl.css';
import { Container, MapContainer, MapCanvas, ResetButton } from "./MapsElements";
import LoaderEl from "../Loader/Spinner";
//data
import { basemapsTrailMaps, basemapsConfig} from "../Basemaps/configs";
import { BasemapConfigTypes } from "../Basemaps/types";
//context
import { MapContext, SavedContext } from "../../context/CreateContext";
//fcns
import TopBar from "../TopBar";
import { FullScreenModal } from "../Modals/FullScreenModal";
import { LeftSidebar } from "../Sidebars/LeftSidebar/preserve-map";
import { RightSidebar } from "../Sidebars/RightSidebar";
import MapProperties from "./Controls";
//hooks
import { ViewportSetter } from "../../hooks/UseEffect/viewportSetter";
import { AddControls } from "../../hooks/UseEffect/addControls";
import { AddLayers } from "../../hooks/UseEffect/preserve-map/addLayers";
import { AddEventListeners } from "../../hooks/UseEffect/preserve-map/addEventListeners";
import { FitMapToBounds } from "../../hooks/UseEffect/fitMapToBBox";
import { ElevateLayerOnPitch } from "../../hooks/Custom";
import { LineHighlight } from "../../hooks/UseEffect/lineHighlight";
import { LineFit } from "../../hooks/UseEffect/mobiles/lineFit";
import { LinePopupOnZoom } from "../../hooks/UseEffect/mobiles/linePopups";
import { SidebarController } from "../../hooks/UseEffect/sidebarController";
import { DataFetcher } from "../../hooks/UseEffect/preserve-map/dataFetcher";
import { SetSidebarData } from "../../hooks/UseEffect/setSidebarData";
import { ImageFetcher } from "../../hooks/UseEffect/imageFetcher";
import { SetDonationDefaults } from "../../hooks/UseEffect/setDefaultsDonation";
import { AddDirArrowsLayer } from "../../hooks/UseEffect/addDirArrowsLayer";
import { AddDonationLayer } from "../../hooks/UseEffect/addDonationLayer";
import { UseBboxWorker } from "../../hooks/UseEffect/web-workers/useBboxWorker";
import { UsePopupWorker } from "../../hooks/UseEffect/web-workers/usePopupWorker";
import { UpdateDefaultsOnFly } from "../../hooks/UseEffect/updateDefaultsOnFly";
import {useAutoScrollIntoView} from "../../hooks/UseEffect/useAutoScrollIntoView";
//utils
import { handleSidebarToggle, } from "../../utils/Gestures/Sidebar";
import { resetView } from "../../utils/Camera/resetView";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';


const MapPage = () => {
  //---------------CONTEXTS -------------------------
  const { isMobile, isIOS } = useContext(SavedContext);
  const { mapState } = useContext(MapContext);

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
  const geojsonTrailheadsRef = useRef<FeatureCollection<Point> | null>(null); 
  const geojsonParkingLotsRef = useRef<FeatureCollection<Point> | null>(null);
  //map
  const hoveredFeatureId = useRef<number | null>(null);
  
  //donation card
  const hasSetDonationInfo = useRef<boolean>(false);
  
  //------------------STATES-----------------------------
  //layout
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  
  //data
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const [activePreserve, setActivePreserve] = useState<string | null>(null);
  //mobile 
  const [popupData, setPopupData] = useState<PopupDataItem[]>([]);

  //map
  const [mapStyle, setMapStyle] = useState<string>(basemapsTrailMaps[0]);
  const [styleLoaded, setStyleLoaded] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<BasemapConfigTypes>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [layersLoaded, setLayersLoaded] = useState<boolean>(false);
  const [preserveInfo, setPreserveInfo] = useState<any | null>(null);
 
  //viewport
  const [bounds, setBounds] = useState<mapboxgl.LngLatBounds | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(14.2);
  const [center, setCenter] = useState<mapboxgl.LngLat | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  //sidebar 
  const [sidebarData, setSidebarData] = useState<SidebarDataProps[] | null>(null);
  const [logoURL, setLogoURL] = useState<ImageProps[] | []>([]);
  const [isCollapsedLeft, setIsCollapsedLeft] = useState<boolean>(true);
  const [isCollapsedRight, setIsCollapsedRight] = useState<boolean>(true);
  const [selectedTrailId, setSelectedTrailId] = useState<number | null>(null);
  const [openItemIndex, setOpenItemIndex] = useState<number | null>(null);

  //donation 
  const [donationType, setDonationType] = useState<string | boolean | null >(null);
  const [donationInfo, setDonationInfo] = useState<DonationInfoProps | null>(null);
  const [images, setImages] = useState<ImageProps[]>([]);


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

  }, [mapStyle, isMobile, dataLoaded, mapState]);


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
    geojsonPreserveRef: geojsonPreserveRef,
    geojsonPOIsRef: geojsonPOIsRef,
    geojsonTrailheadsRef: geojsonTrailheadsRef,
    geojsonParkingLotsRef: geojsonParkingLotsRef,
    setDataLoaded: setDataLoaded,
    setIsLoading: setIsLoading
  });

 
  //3. ViewportSetter
  ViewportSetter({
    mapInstance: map.current,
    styleLoaded: styleLoaded,
    setCenter: setCenter,
    setZoomLevel: setZoomLevel,
    setBounds: setBounds
  })



  //4. FitMapToBounds
  FitMapToBounds({
    mapInstance: map.current,
    bbox: mapState.bbox as Bbox,
    promotion: mapState.promotion,
    styleLoaded: styleLoaded,
    dataLoaded: dataLoaded,
  })

  //5. SetDefaults
  SetDonationDefaults({
    styleLoaded: styleLoaded,
    dataLoaded: dataLoaded,
    activePreserve: activePreserve,
    masterTableData: jsonMasterTableRef.current,
    trailData: geojsonTrailsRef.current,
    POIsData: geojsonPOIsRef.current,
    hasSetDonationInfo: hasSetDonationInfo,
    setDonationType: setDonationType,
    setDonationInfo: setDonationInfo
  });

  //6. AddLayers
  AddLayers({
    mapInstance: map.current,
    mainSources: mapState.dataRefs.sourceNames,
    dataLoaded: dataLoaded,
    dataRefs: mapState.dataRefs,
    geojsonPreserveRef: geojsonPreserveRef,
    geojsonTrailsRef: geojsonTrailsRef,
    geojsonPOIsRef: geojsonPOIsRef,
    donationType: donationType,
    styleLoaded: styleLoaded,
    currentTheme: currentTheme,
    isMobile: isMobile,
    setLayersLoaded: setLayersLoaded
  })

  //7.1 AddDonationLayer
  AddDonationLayer({
    mapInstance: map.current,
    dataLoaded: dataLoaded,
    geojsonTrailsRef: geojsonTrailsRef,
    geojsonPOIsRef: geojsonPOIsRef,
    donationType: donationType,
    donationInfo: donationInfo,
    styleLoaded: styleLoaded,
    currentTheme: currentTheme,
  });

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
    setDonationInfo: setDonationInfo
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
    bbox: preserveInfo?.bbox as Bbox,
    setSidebarData: setSidebarData, 
    setIsLoading: setIsLoading
  })

  //14.ImageFetcher
  ImageFetcher({
    styleLoaded: styleLoaded,
    dataLoaded: dataLoaded,
    donationInfo: donationInfo,
    activePreserve: activePreserve,
    masterTable: jsonMasterTableRef.current,
    setImages: setImages,
    setLogoURL: setLogoURL
  });

  //Add second group of layers ----------
  //15.1 AddDirArrowsLayer
  AddDirArrowsLayer({
    mapInstance: map.current,
    dataLoaded: dataLoaded,
    styleLoaded: styleLoaded,
    geojsonTrailsRef: geojsonTrailsRef,
    currentTheme: currentTheme,
  });

  //16. UseBboxWorker
  UseBboxWorker({ 
     styleLoaded: styleLoaded,
     bounds: bounds,
     center: center,
     zoomLevel: zoomLevel,
     setActivePreserve: setActivePreserve,
     setIsLoading: setIsLoading,
  });

  
  //17. UpdateDefaltsOnFly 
  UpdateDefaultsOnFly({ 
    mapState: mapState,
    dataLoaded: dataLoaded,
    geojsonPreserveRef: geojsonPreserveRef,
    geojsonParkingRef: geojsonParkingLotsRef, 
    activePreserve: activePreserve as string | null,
    setPreserveInfo: setPreserveInfo,
    setActivePreserve: setActivePreserve,    
  });


  //18. AutoScrollIntoView
  useAutoScrollIntoView({
    isOpen: !isCollapsedLeft,          
    containerRef: itemsWrapperRef,
    selectedId: openItemIndex,        
});



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


  const TopBarRender = useMemo(() => (
    <TopBar mapCanvas={mapCanvas}
      isFullScreen={isFullScreen}
      webMapName={preserveInfo?.webMapName}
      setIsFullScreen={setIsFullScreen}
      setShowModal={setShowModal} />
  ), [isFullScreen, preserveInfo]);



  const BasemapsContainerRender = useMemo(() => (
    <MapProperties mapRef={map.current}
      styleLoaded={styleLoaded}
      isMobile={isMobile}
      style={mapStyle}
      basemapsTrailMaps={basemapsTrailMaps}
      setMapStyle={setMapStyle}
      setStyleLoaded={setStyleLoaded} />

  ), [isMobile, mapStyle, styleLoaded]);


  const LeftSidebarRender = useMemo(() => (
    <LeftSidebar
      map={map.current}
      isMobile={isMobile}
      styleLoaded={styleLoaded}
      webMapName={preserveInfo?.webMapName}
      owner={preserveInfo?.owner}
      parking_address={preserveInfo?.parking_address}
      parking_coordinates={preserveInfo?.parking_coordinates}
      description={preserveInfo?.desc}
      type={preserveInfo?.preserveType}
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
      setDonationInfo={setDonationInfo}
    />
  ), [dataLoaded, 
      isCollapsedLeft, 
      isLoading, 
      isMobile, 
      logoURL, 
      openItemIndex, 
      preserveInfo,
      selectedTrailId, 
      sidebarData, 
      styleLoaded]);


  const RightSidebarRender = useMemo(() => (
    <RightSidebar styleLoaded={styleLoaded}
      isMobile={isMobile}
      images={images || []}
      isCollapsedRight={isCollapsedRight}
      donationType = {donationType}
      donationInfo={donationInfo}
      owner={mapState.owner}
      setIsCollapsedRight={setIsCollapsedRight} />
  ), [styleLoaded, isMobile, images, isCollapsedRight, donationType, donationInfo, mapState.owner]);

  const LoaderRender = useMemo(() => (
    <LoaderEl isMobile = {isMobile} 
              styleLoaded={styleLoaded} 
              dataLoaded={dataLoaded} 
              layersLoaded={layersLoaded} />
  ), [isMobile, styleLoaded, dataLoaded, layersLoaded]);


  // console.log("bounds:", bounds)
  // console.log('is mobile', isMobile); 

  //END OF PERFORMANCE OPTIM. -----//
  return (
    <Container ref={mapCanvas}>
      <FullScreenModal isMobile={isMobile} isIOS={isIOS} isFullScreen={isFullScreen} showModal={showModal} setShowModal={setShowModal} />
      {TopBarRender}
      <MapCanvas >
        {LoaderRender}
        <ResetButton onClick={ResetViewFunction}>Reset View</ResetButton>
        {LeftSidebarRender}
        {RightSidebarRender}
        {BasemapsContainerRender}
        <MapContainer ref={mapContainer} />
      </MapCanvas>
    </Container>
  );
};

export default MapPage;

import React, { useState, useContext, MouseEvent, useCallback } from 'react';
import { BasemapsContainer, MultiLayerIcon, BasemapIcon, MultiLayerPng, BasemapPng, BasemapIconsWrapper, ControlsContainer, IconsWrapper,Tooltip } from '../../PreserveMap/Controls/Legend/Elements';
import { MapContext } from '../../../context/CreateContext';

interface MapEvents {
    mapRef: mapboxgl.Map | null,
    styleLoaded: boolean,
    isMobile: boolean,
    style: string,
    basemapsTrailMaps: string[],
    setMapStyle: (style: string) => void;
    setStyleLoaded: (styleLoaded: boolean) => void;
}

const MapProperties = ({ mapRef, styleLoaded, isMobile, style, basemapsTrailMaps, setMapStyle, setStyleLoaded }: MapEvents) => {
    
    const {setMapState} = useContext(MapContext);
    const [showStyles, setShowStyles] = useState(false);
    const [showTooltip, setShowTooltip] = useState<number | null>(null);


    const handleStyleChange = useCallback((e: MouseEvent, newStyle: string) => {
        if (style === newStyle || !styleLoaded || mapRef === null) {
            return;
        };
        setStyleLoaded(false);
        setMapStyle(newStyle);

        //get and update map states
        const center = mapRef.getCenter();
        const zoom = mapRef.getZoom();
        const pitch = mapRef.getPitch();
        const bearing = mapRef.getBearing();

        setMapState(prev => ({
            ...prev,
            center: [center.lng, center.lat],
            zoom: zoom,
            pitch: pitch,
            bearing: bearing,
        }));

        if (isMobile) {
            setShowStyles(false);
        };

        mapRef.resize();
        e.stopPropagation();
    }, [mapRef,isMobile, style, styleLoaded,  setStyleLoaded, setMapStyle, setMapState]);

    return (
        <ControlsContainer>
            <IconsWrapper $showStyles={showStyles}>
                <BasemapsContainer $isMobile={isMobile} $showStyles={showStyles}
                    onMouseEnter={() => !isMobile && setShowStyles(true)}
                    onMouseLeave={() => !isMobile && setShowStyles(false)}
                    onClick={() => isMobile && setShowStyles(true)}>
                    <MultiLayerIcon $showStyles={showStyles}>
                        <MultiLayerPng
                            src={'/img/raster/Basemap/layers-1x.png'}
                            alt="icon-1"
                        />
                    </MultiLayerIcon>

                    <BasemapIconsWrapper $showStyles={showStyles}>
                        <BasemapIcon 
                            onClick={(e) => handleStyleChange(e, basemapsTrailMaps[0])}
                            onMouseEnter={() => !isMobile && setShowTooltip(2)}
                            onMouseLeave={() => !isMobile && setShowTooltip(null)}
                            $selected={style === basemapsTrailMaps[0]}
                            $disabled={!styleLoaded}>
                            <BasemapPng $showStyles={showStyles}
                                src={'/img/raster/Basemap/light.png'}
                                alt="icon-2"
                            />
                         <Tooltip $showTooltip = {showTooltip === 2}>Light</Tooltip>    
                        </BasemapIcon>

                        <BasemapIcon
                            onClick={(e) => handleStyleChange(e, basemapsTrailMaps[1])}
                            onMouseEnter={() => !isMobile && setShowTooltip(3)}
                            onMouseLeave={() => !isMobile && setShowTooltip(null)}
                            $selected={style === basemapsTrailMaps[1]}
                            $disabled={!styleLoaded}>
                            <BasemapPng $showStyles={showStyles}
                                src={'/img/raster/Basemap/green.png'}
                                alt="icon-3"
                            />
                         <Tooltip $showTooltip = {showTooltip === 3}>Green</Tooltip>       
                        </BasemapIcon>

                        <BasemapIcon
                            onClick={(e) => handleStyleChange(e, basemapsTrailMaps[2])}
                            onMouseEnter={() => !isMobile && setShowTooltip(4)}
                            onMouseLeave={() => !isMobile && setShowTooltip(null)}
                            $selected={style === basemapsTrailMaps[2]}
                            $disabled={!styleLoaded}>
                            <BasemapPng $showStyles={showStyles}
                                src={'/img/raster/Basemap/satellite.png'}
                                alt="icon-3"
                            />
                            <Tooltip $showTooltip = {showTooltip === 4}>Satellite</Tooltip>     
                        </BasemapIcon>
                    </BasemapIconsWrapper>
        
                </BasemapsContainer>
            </IconsWrapper>

        </ControlsContainer>

    );
};

export default MapProperties;

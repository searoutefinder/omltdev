import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//static imports for lightweight pages
import Skeleton  from './components/Loader/Skeleton';  
//context providers
import { MapContextProvider, TemplateStatusProvider, PopupContextProvider } from './context/Providers';

// lazy-load heavy components (map libraries, etc.)
const HomePage = lazy(() => import('./pages/Home'));
const MapPage = lazy(() => import('./components/PreserveMap'));
const WalkMapPage = lazy(() => import('./components/WalkMap'));
const BoundaryPage = lazy(() => import('./components/BoundaryMap'));
const RisingRoutesPage = lazy(() => import('./pages/RisingRoutes'));
const PreserveCardsPage = lazy(()=> import('./pages/PreserveCards'));
const WebFormPage  = lazy (() => import ('./pages/WebForm'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Skeleton/>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/:preserveName"
            element={
              <MapContextProvider>
                <MapPage />
              </MapContextProvider>
            }
          />
          <Route
            path="/walkmaps/:preserveName"
            element={
              <MapContextProvider>
                <PopupContextProvider>
                  <WalkMapPage />
                </PopupContextProvider>
              </MapContextProvider>
            }
          />            
          <Route
            path="/LGLCBoundaries"
            element={
              <MapContextProvider>
                <BoundaryPage />
              </MapContextProvider>
            }
          />
          <Route path="/PreserveCards" element={<PreserveCardsPage />} />
          <Route
            path="/SubmissionForm"
            element={
              <TemplateStatusProvider>
                <WebFormPage />
              </TemplateStatusProvider>
            }
          />
          <Route path="/RisingRoutes" element={<RisingRoutesPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;


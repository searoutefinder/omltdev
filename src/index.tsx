import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import './fonts.css';
import App from './App';
import useViewportHeight from './hooks/UseEffect/mobiles/viewportHeight';
import { AppContextProvider} from './context/Providers';
import Skeleton from './components/Loader/Skeleton';  

interface ViewportHeightInitializerProps {
  children: React.ReactNode;
}

function ViewportHeightInitializer({ children }: ViewportHeightInitializerProps) {
  useViewportHeight(); 
  return <>{children}</>;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ViewportHeightInitializer>
    <AppContextProvider>
      <Suspense fallback={<Skeleton/>}>
        <App />
      </Suspense>
    </AppContextProvider>
  </ViewportHeightInitializer>
);


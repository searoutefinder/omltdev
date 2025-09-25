import React, { useState, ReactNode } from "react";
import { useDeviceInfo } from "../../hooks/UseEffect/mobiles/useIsMobile";
import { SavedContext } from "../CreateContext";

function AppContextProvider({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const deviceInfo = useDeviceInfo();
  return (
    <SavedContext.Provider
      value={{
        isMobile: deviceInfo?.isMobile ?? isMobile,
        isIOS: deviceInfo?.isIOS ?? isIOS,
        setIsMobile,
        setIsIOS,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}
export { 
  AppContextProvider 
};
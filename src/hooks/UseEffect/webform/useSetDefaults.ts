import { useEffect } from 'react';
import { FormatProps } from '../../../pages/WebForm/types';


interface UseSetDefaultsProps {
   allowedFileTypes: FormatProps[];
   setFileType: (fileType: string) => void;
   setAction: (action: string) => void;
}


export function useSetDefaults({
   allowedFileTypes,
   setFileType, 
   setAction,
}: UseSetDefaultsProps) {

   useEffect(() => {
      if (!allowedFileTypes || allowedFileTypes.length === 0) return;
      const defaultFileType = allowedFileTypes?.[0].type || 'zip';
      setFileType(defaultFileType);
      setAction('new_data_upload');
   
   }, [allowedFileTypes, 
       setAction, 
       setFileType]);
   return null;
}

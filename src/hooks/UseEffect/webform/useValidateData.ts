import { useEffect, useContext} from 'react';
import { MessageProps } from '@/pages/WebForm/types';
import { TemplatesStatusContext } from '../../../context/CreateContext';

interface UseValidateDataProps {
    fileType: string | null;
    template: string | null;
    file: File | null;
    fileName: string | null;
    setMessage: (message: MessageProps) => void;
    setReturnedKeys: (keys: any) => void;
    setIsValidating: (isValidating: boolean) => void;
}


const proxy = import.meta.env.VITE_BACKEND_PROXY_URL;


//add usetransition hook so it does not block the ui

export function useValidateData({
    fileType,
    file,
    fileName,
    template,
    setMessage,
    setReturnedKeys,
    setIsValidating,
}: UseValidateDataProps) {

    //Context
    const {updateSessionId, updateValidated} = useContext(TemplatesStatusContext);
    

    useEffect(() => {
        if (!file || !fileType || !template ) return;

        const postData = async () => {
            setIsValidating(true);
            
            if (!file || !fileName) {
                setMessage({
                    type: "warning",
                    message: "Please upload a file"
                });
                setIsValidating(false);
                return;
            };

            if (!fileName) {
                setMessage({
                    type: "warning",
                    message: "Please give a name to the file."
                });
                setIsValidating(false);
                return;
                };

            //#FIX- Create datasets for alerts type:
            if (file.size > 20 * 1024 * 1024) { //20MB
                setMessage({
                    type: "warning",
                    message: "File size exceeds the 20MB upload limit."});
                    setIsValidating(false);
                return;
            };

         
            //append binnary file to form data
            const formData = new FormData();
            formData.append("file", file);

            //localStorage
            const Session = localStorage.getItem("sessionIdOmlt");

            try {
                const response = await fetch(`${proxy}/validate?session=${Session}&template=${template}&fileType=${fileType}&fileName=${fileName}`, {
                    method: "POST",
                    body: formData,
                });
                
                const results = await response.json();
                const validated = results.validated;
                const backendSessionId = results.sessionId;
                const backendFirstSuccess = results.firstSuccess;

                //update sessionId if needded
                const clientSessionId = Session ? JSON.parse(Session).sessionId : null;
                
                if (clientSessionId !== backendSessionId) {
                    const backendSession = {
                        sessionId: backendSessionId,
                        firstSuccess: backendFirstSuccess
                    }; 
                    localStorage.setItem("sessionIdOmlt", JSON.stringify(backendSession));
                };

                //set returned keys
                setReturnedKeys(results.fieldKeys);
                //update sessionId
                updateSessionId(backendSessionId);
                //update validated
                updateValidated(template, validated);
                //update message
                setMessage({
                    type: results.status,
                    message: results.message}
                );

                //set isFetching to false
                setIsValidating(false);
            } catch {
                setMessage({
                    type: "warning",
                    message:'Unknown error occured while validating the file. Please try again later.'
                });
                setIsValidating(false);
                return;
                }
        };

        postData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, 
        file, 
        fileName, 
        setMessage, 
        setReturnedKeys, 
       ]);

    return null;
}

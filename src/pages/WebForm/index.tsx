import React, { useState, useContext, MouseEvent} from 'react';
import { FormSectionProps, FormField, MessageProps, FormatProps} from './types';
import {
    Container,
    WebFormContainer,
    Header,
    HeaderTextSection,
    HeaderLogoSection,
    LogoImg,
    Title,
    SubTitle,
    Divider,
    FormSection,
    Row,
    FieldName,
    FieldInput,
    Asterisk,
    RadioGroup,
    RadioRow,
    RadioContent,
    RadioLabel,
    RadioDescription,
    AlertContent,
    AlertText,
    AlertCloseButton,
    SubmitDataset,
    SubmitSection,
    CancelDataset, 
} from './Elements'
//CONTEXT--------------------------------------------------------
import { TemplatesStatusContext, SavedContext } from '../../context/CreateContext';
//HOOKS--------------------------------------------------------
import { useFetchFormData } from '../../../src/hooks/UseEffect/webform/useFetchFormData';
import { useMatchTemplateData } from '../../../src/hooks/UseEffect/webform/useMatchTemplateData';
import { useValidateData } from '../../../src/hooks/UseEffect/webform/useValidateData';
import { useAlertOnLeaving } from '../../../src/hooks/UseEffect/webform/useAlertOnLeaving';
import { useSetDefaults} from '../../../src/hooks/UseEffect/webform/useSetDefaults';
//FC--------------------------------------------------------
import { ValidationForm } from './components/ValidationForm';
import { UploadSection } from './components/UploadSection';
import {TemplateStatusSection} from './components/TemplatesStatusSection';
import { SmallScreenOverlay } from './components/SmallScreenOverlay';
import {LoaderEl} from './components/Loader';
import Skeleton from '../../components/Loader/Skeleton';



const proxy = import.meta.env.VITE_BACKEND_PROXY_URL;


const WebFormPage = () => {

    //CONTEXT--------------------------------------------------------
    const {data, updateTemplateStatus, updateValidated} = useContext(TemplatesStatusContext);
    const { isMobile} = useContext(SavedContext);

    //STATES--------------------------------------------------------
    const [action, setAction] = useState<string | null>(null);
    //data
    const [template, setTemplate] = useState<string | null>(null);
    const [InputKeys, setInputKeys] = useState<FormSectionProps[] | null>([]);
    const [TemplateKeys, setTemplateKeys] = useState<any>(null);
    //api status 
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isValidating, setIsValidating] = useState<boolean>(false); 
    //Error handling------------------------------------------------
    const [message, setMessage] = useState<MessageProps | null>(null);
    const [fieldErrors, setFieldErrors] = useState<any>({});  
    const [fieldAlerts, setFieldAlerts] = useState<any>({});
    //File Details ------------------------------------------------
    const [allowedFileTypes, setAllowedFileTypes] = useState<FormatProps[]>([]);
    const [fileType, setFileType] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [ReturnedKeys, setReturnedKeys] = useState<any>(null);
    //Validation Details ------------------------------------------
    const [mapping, setMapping] = useState<{ [key: string]: string }>({});

    
    //----------------------HOOKS--------------------------------------------------------

    //1.prevent user from exit without warning
    useAlertOnLeaving();

    //2.fetch form data from the api
    useFetchFormData({
        setInputKeys: setInputKeys,
        setIsFetching: setIsFetching,
        setAllowedFileTypes: setAllowedFileTypes,
    });


    useSetDefaults({
        allowedFileTypes: allowedFileTypes,
        setFileType: setFileType,
        setAction: setAction,
    });

    //3.match template and get data from the api
    useMatchTemplateData({
        template: template,
        setTemplateKeys: setTemplateKeys,
        setIsFetching: setIsFetching,
    });


    //4.validate data
    useValidateData({
        template: template,
        fileType: fileType,
        file: file,
        fileName: fileName,
        setMessage: setMessage,
        setReturnedKeys: setReturnedKeys,
        setIsValidating: setIsValidating,
    });
    


  // -------------------------HANDLERS--------------------------------------------------------
    const handleConfirmDataset = async (e: MouseEvent<HTMLButtonElement>, template: string | null) => {
        e.preventDefault();
        setIsFetching(true);
        try {
          if (!template) return;
          const session = localStorage.getItem("sessionIdOmlt");
          const response = await fetch(
            `${proxy}/confirm?session=${session}&template=${template}&fileName=${fileName}`,{ 
                method: "POST",
                body: JSON.stringify({mapping: mapping}),
                headers: {
                  "Content-Type": "application/json",
                },
            }
          );
      
          const data = await response.json();
          updateTemplateStatus(data.template, data.status);
          setMessage({
            type: data.status,
            message: data.message,
          });

        } catch (err) {
          console.error("Confirm failed:", err);
          setMessage({
            type: "error",
            message: "Something went wrong while confirming dataset.",
          });
        } finally {
          setIsFetching(false); 
        }
      };
      


      const handleCancelDataset = async (e: MouseEvent<HTMLButtonElement>, template: string | null) => {
        e.preventDefault();
        setIsFetching(true);
      
        try {
          if (!template) return;
          const session = localStorage.getItem("sessionIdOmlt");
          const response = await fetch(`${proxy}/cleanup?session=${session}&template=${template}`, {
            method: "POST",
          });
      
          const data = await response.json();
          updateTemplateStatus(data.template, data.status);
          updateValidated(template, false);
          resetForm();


          setMessage({
            type: "success",
            message: "Dataset cancelled successfully.",
          });

        } catch (err) {
          console.error("Cancel failed:", err);
          setMessage({
            type: "error",
            message: "Something went wrong while cancelling dataset.",
          });
        } finally {
          setIsFetching(false);
        }
      };
      
//--------------------------- HELPERS--------------------------------------------------------

    const resetForm = () => {
        setFile(null);
        setFileName(null);
        setReturnedKeys(null);
        setMapping({});
        setFieldErrors({});
        setFieldAlerts({});
    };

    if (!InputKeys || !InputKeys[0]) return <Skeleton/>;


    // OPTIMIZATION ----------------------------
    //#fix
    const templateData = data?.templates.find(temp => temp?.value === template); 
    
    
    
    //RENDER------------------------------------------------
        return (
            <Container>
                <SmallScreenOverlay isMobile={isMobile}/>
                <LoaderEl 
                    isFetching = {isFetching}/>
                <WebFormContainer>
                    <Header>
                        <HeaderTextSection>
                            <Title>Data Submission Form</Title>
                            <SubTitle>Please use this form to check the format of your data and to submit your data to the &quot;Green Goat Maps Trail-raiser Program&quot;</SubTitle>
                        </HeaderTextSection>
                        <HeaderLogoSection>
                            <LogoImg src='/img/vector/logo.svg'
                                alt='logo' />
                        </HeaderLogoSection>
                    </Header>
                    <Divider />
                    <TemplateStatusSection
                        data={data}
                        template = {template}
                        InputKeys = {InputKeys[0]['feature_layer']}
                        setTemplate={setTemplate}
                        resetForm={resetForm}
                        setMessage={setMessage}
                    />
                    <Divider />
                    <FormSection
                        $templateSelected={true}
                        action="/upload"
                        method="POST"
                        encType="multipart/form-data"
                    >
                        {InputKeys.map((section: FormSectionProps) => {
                            return Object.keys(section).map((key, index) => {
                                const field: FormField = section[key];
                                if (index === 2) return null;
                                return (
                                    <Row key={key}>
                                        <Asterisk $mandatory={field.mandatory}>*</Asterisk>
                                        <FieldName>{field.desc}</FieldName>
                                
                                        {field.actions ? (
                                            <RadioGroup>
                                                {field.actions.map((act, idx) => (
                                                    <RadioRow key={idx}>
                                                        <input
                                                            type={field.type}
                                                            name="action"
                                                            value={field.value}
                                                            checked={action === act.value}
                                                            disabled={act.disabled}
                                                            onChange={(e) => {
                                                                setAction(e.target.value);

                                                            }}
                                                        />
                                                        <RadioContent>
                                                            <RadioLabel>{act.type}</RadioLabel>
                                                            <RadioDescription>{act.desc}</RadioDescription>
                                                        </RadioContent>

                                                    </RadioRow>
                                                ))}
                                            </RadioGroup>
                                        ) : (
                                            <FieldInput 
                                                type={field.type} 
                                                placeholder={field.placeholder} 
                                                $isDisabled={field.disabled}
                                                disabled={field.disabled} />
                                        )}
                                    </Row>
                                );
                            });
                        })}
                       <UploadSection
                            formats={allowedFileTypes}
                            fileType= {fileType} 
                            file={file}
                            fileName={fileName}
                            action={action}
                            template={template}
                            setFileType={setFileType}
                            setFile={setFile}
                            setFileName={setFileName}
                            setMessage={setMessage}
                            setMapping = {setMapping}
                            setFieldErrors = {setFieldErrors}
                        />
                        
                    </FormSection>
                    <AlertContent $message={message?.message ? true : false}
                        $type={message?.type}>
                        <AlertText>{message?.message}</AlertText>
                        <AlertCloseButton onClick={() => setMessage(null)}>X</AlertCloseButton>
                    </AlertContent>
                    <Divider />
                    <ValidationForm
                        isValidating={isValidating}
                        template={template}
                        message={message?.type}
                        templateKeys={TemplateKeys}
                        returnedKeys={ReturnedKeys}
                        fileName={fileName}
                        mapping={mapping}
                        fieldAlerts = {fieldAlerts}
                        fieldErrors={fieldErrors}
                        setMapping={setMapping}
                        setIsFetching = {setIsFetching}
                        setFieldAlerts = {setFieldAlerts}
                        setFieldErrors={setFieldErrors}
                    />
                    <SubmitSection>
                        <CancelDataset 
                           type="reset"
                           onClick = {e => handleCancelDataset(e, template)}
                           $isDisabled={((templateData?.status == 'confirmed') ? false : true)}
                           disabled = {((templateData?.status  == 'confirmed') ? false : true)}>
                            Cancel
                        </CancelDataset>
                        <SubmitDataset
                           type="submit"
                           $isDisabled={((templateData?.status == 'confirmed' && templateData?.validated === true || (Object.keys(fieldErrors || {}).length !== 0) || !file)  ? true : false)}
                           disabled = {((templateData?.status == 'confirmed' && templateData?.validated === true || (Object.keys(fieldErrors || {}).length !== 0) || !file)  ? true : false)} 
                           onClick = {e => handleConfirmDataset(e, template)}>
                            Submit
                        </SubmitDataset>
                    </SubmitSection>
                </WebFormContainer>
            </Container>
        )
    }





    export default WebFormPage;

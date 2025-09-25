import React, { useRef, ChangeEvent, useState, MouseEvent} from 'react'
import { FormatProps } from '../types';
import {
    UploadRow,
    Asterisk,
    FieldName,
    UploadContent,
    UploadButton,
    UploadInput,
    FileNameDisplay,
    DeleteIcon,
    UploadModalContainer,
    UploadModal,
    ModalTitle,
    ModalText,
    IconsContainer,
    FormatWrapper,
    FormatIcon,
    FormatText,
    UploadModalHeader, 
    UploadModalFooter,
    CloseModal, 
    CloseIcon
} from '../Elements'



type UploadSectionProps = {
    formats: FormatProps[];
    fileType: string | null;
    file: File | null;
    fileName: string | null;
    action: string | null;
    template: string | null;
    setFile: (file: File | null) => void;
    setFileName: (fileName: string | null) => void;
    setMessage: (message: any) => void;
    setMapping: (mapping: { [key: string]: string }) => void;
    setFileType: (type: string) => void;
    setFieldErrors: (fieldErrors: any) => void;
}

export const UploadSection = ({
    formats,
    fileType,
    file,
    fileName,
    action,
    template,
    setFileType,
    setFile,
    setFileName,
    setMessage,
    setMapping,
    setFieldErrors
}: UploadSectionProps) => {

    //REFS--------------------------------------------------------
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);



    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        if (file) {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            };
            if (file.name == '.zip' || file.name == '.geojson') {
                setMessage({
                    type: "warning",
                    message: "Please give a name to the file."
                });
                return;
            };
            setFileName(file.name);
            setFile(file);
            setIsOpen(false);
        } else {
            setFile(null);
            setFileName(null);
            setMapping({});
            setFieldErrors({});
        }
    };



    //HANDLERS--------------------------------------------------------
    const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleClose = (e: MouseEvent<HTMLImageElement | HTMLButtonElement>) => {
        e.preventDefault();
        setIsOpen(false);
    };


    const handleFileTypeSelection = (e: MouseEvent<HTMLImageElement>, format: FormatProps) => {
        e.preventDefault();
        if (format.disabled) return;
        setFileType(format.type);
    };


    //RENDER--------------------------------------------------------
    return (

        <UploadRow>
            <Asterisk $mandatory={true}>*</Asterisk>
            <FieldName>Upload File</FieldName>
            <UploadContent>
                <UploadButton
                    $file={(file || !action || !template) ? true : false}
                    disabled={(file || !action || !template) ? true : false}
                    onClick={(e) => handleOpen(e)}>
                    Select File
                </UploadButton>
                <FileNameDisplay>{fileName || "No file chosen"}</FileNameDisplay>
                <DeleteIcon
                    $file={file ? true : false}
                    src='/img/raster/WebForm/deleteIcon.png'
                    alt='delete'
                    onClick={() => {
                        setFile(null)
                        setFileName(null)
                        setMessage(null)
                        setMapping({});
                        setFieldErrors({});

                    }} />
            </UploadContent>
            <UploadModalContainer $isOpen={isOpen}>
                <UploadModal>
                    <UploadModalHeader>
                       <CloseIcon src={'/img/vector/Legend/closeIcon.svg'} onClick={(e) => handleClose(e)} />
                      <ModalTitle>Select File Type</ModalTitle>
                      <ModalText>Please choose the file type you want to upload.</ModalText>
                    </UploadModalHeader>
                    <IconsContainer>
                        {formats?.map((format, index) => (
                            <FormatWrapper key = {index}>
                                <FormatIcon
                                    key={index}
                                    src={'/img/raster/WebForm/formatIcon.png'}
                                    $isDisabled = {format.disabled}
                                    $isSelected={fileType === format.type}
                                    onClick={(e) => handleFileTypeSelection(e, format)}
                                />
                                <FormatText 
                                    $isDisabled = {format.disabled}
                                >
                                 {format.name}
                                </FormatText>
                            </FormatWrapper>


                        ))}
                    </IconsContainer>
                    <UploadModalFooter>
                     <UploadInput
                        $file={(file || !action || !template) ? true : false}
                        ref={fileInputRef}
                        type="file"
                        name="file"
                        accept={`.${fileType}`}
                        disabled={(file || !action || !template) ? true : false}
                        onChange={(e) => handleFileChange(e)}
                    />
                    <CloseModal onClick={(e) => handleClose(e)}>Close</CloseModal>
                    </UploadModalFooter>        
                   
                </UploadModal>
            </UploadModalContainer>
        </UploadRow>
    );

};

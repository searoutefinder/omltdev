import React, { useState, useEffect, useTransition, Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { Tooltip, InfoIcon, TooltipContainer, ValidationSection, ValidationText, ValidationIcon, FormSection, Row, Asterisk, FieldName, FieldSelect, RowWrapper } from '../Elements';
import { getBestMatch, createMap } from '../../../utils/WebForm';
import { TemplatesStatusContext } from '../../../context/CreateContext';


type ValidationFormProps = {
    isValidating: boolean;
    template: string | null;
    templateKeys: any;
    returnedKeys: any;
    fileName: string | null;
    mapping: { [key: string]: string };
    fieldAlerts: any;
    fieldErrors: any;
    message: any;
    setMapping: Dispatch<SetStateAction<{ [key: string]: string }>>;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    setFieldAlerts: Dispatch<SetStateAction<any>>;
    setFieldErrors: Dispatch<SetStateAction<any>>;
};

const proxy = import.meta.env.VITE_BACKEND_PROXY_URL;


export const ValidationForm = ({
    isValidating,
    template,
    templateKeys,
    returnedKeys,
    fileName,
    mapping,
    fieldAlerts,
    fieldErrors,
    setMapping,
    setIsFetching,
    setFieldAlerts,
    setFieldErrors }: ValidationFormProps) => {

    const [isPending, startTransition] = useTransition();
    const { data, updateValidated } = useContext(TemplatesStatusContext);

    //-------------------------STATES-------------------------
    const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
    const [tooltipPosition, setTooltipPosition] = useState<any>({ top: 0, left: 0 });
    const [tooltipText, setTooltipText] = useState<string>("");


    //-------------------------HOOKS-------------------------
    useEffect(() => {
        if (!templateKeys || !returnedKeys || returnedKeys.length < 1) return;
        const fieldMapping: { [fieldValue: string]: string } = {};

        templateKeys?.fields?.forEach((field: any) => {
            fieldMapping[field.value] = getBestMatch({
                templateKey: field.value,
                returnedKeys: returnedKeys
            });
        });

        startTransition(() => {
            setMapping(fieldMapping);
        });
    }, [templateKeys, returnedKeys, setMapping]);


    useEffect(() => {
        if (!mapping || Object.keys(mapping).length === 0 || !template) return;
        validateAllFields(mapping, template);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapping, template]);



    //-----------------------HANDLERS-------------------------
    const handleSelection = (fieldValue: string, value: string) => {
        startTransition(() => {
            setMapping((prev: any) => ({
                ...prev,
                [fieldValue]: value
            }));
        });
    };


    const validateAllFields = async (mapping: any, template: string) => {
        setIsFetching(true);
        const Session = localStorage.getItem("sessionIdOmlt");

        try {
            const response = await fetch(`${proxy}/validate-values?session=${Session}&template=${template}&fileName=${fileName}`, {
                method: "POST",
                body: JSON.stringify({
                    mapping: mapping,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            const validated = result.validated;

            if (result.status === 200) {
                const newAlerts = result.alerts;
                setFieldAlerts(newAlerts);
                setFieldErrors({});
                updateValidated(template, validated);

            } else {
                const newErrors = result.errors;
                const newAlerts = result.alerts;
                setFieldErrors(newErrors);
                setFieldAlerts(newAlerts);
                updateValidated(template, validated);

            };

            setIsFetching(false);

        } catch (err) {
            console.error('Error validating all fields:', err);
            setIsFetching(false);
        }
    };


    const handleMouseEnter = (e: React.MouseEvent, text: string) => {
        const tooltipWidth = 200; 
        const padding = 10;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const maxLeft = window.innerWidth - tooltipWidth - padding;
    
        setTooltipPosition({
            top: mouseY + 15,
            left: mouseX > maxLeft ? maxLeft : mouseX + 10,
        });
    
        setTooltipText(text);
        setTooltipVisible(true);
    };
    


    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    //------------------------------------------------------------------
    //-------OPTIMIZATION -------------------
    const errorMap = useMemo(() => createMap(fieldErrors), [fieldErrors]);
    const alertMap = useMemo(() => createMap(fieldAlerts), [fieldAlerts]);


    return (
        <FormSection $templateSelected={template ? true : false}>
            <ValidationSection>
                <ValidationText>Data Validation</ValidationText>
                <ValidationIcon $isValidating={isPending || isValidating} src="/img/vector/WebForm/validating.svg" alt="validationIcon" />
            </ValidationSection>

            {templateKeys?.fields?.map((field: any, index: number) => (
                <Row key={index}>
                    <Asterisk $mandatory={field.mandatory}>*</Asterisk>
                    <FieldName>{field.name}</FieldName>
                    <RowWrapper $isExpanded={errorMap[field.value] || alertMap[field.value]}>
                        <FieldSelect
                            style={{
                                borderColor: errorMap[field.value] ? '#F34141' : alertMap[field.value] ? "#ccccb8" : undefined,
                                backgroundColor: errorMap[field.value] ? '#f1c2c2' : alertMap[field.value] ? "#f8f8a6" : undefined,
                            }}
                            value={mapping[field.value] || ''}
                            disabled={(data.templates.find(temp => temp.value === template)?.status !== 'confirmed') ? false : true}
                            onChange={(e) => handleSelection(field.value, e.target.value)}
                        >
                            <option value="" disabled hidden>
                                Select matching field
                            </option>

                            {returnedKeys?.map((key: string, idx: number) => (
                                <option key={idx} value={key}>
                                    {key}
                                </option>
                            ))}
                        </FieldSelect>
                        {errorMap[field.value] && (
                            <span style={{ color: "#F34141", fontSize: "14px" }}>
                                {errorMap[field.value]}
                            </span>
                        )}

                        {alertMap[field.value] && (
                            <span style={{ color: "#555555dd", fontSize: "14px" }}>
                                {alertMap[field.value]}
                            </span>
                        )}
                    </RowWrapper>
                    <TooltipContainer>
                        <InfoIcon
                            src="img/vector/LeftSidebar/info.svg"
                            alt="infoIcon"
                            onClick={() => alert(field.desc)}
                            onMouseEnter={(e) => handleMouseEnter(e, field.desc)}
                            onMouseLeave={handleMouseLeave}
                        />
                        {tooltipVisible && (
                            <Tooltip  $top={tooltipPosition.top} $left={tooltipPosition.left}>
                                {tooltipText}
                            </Tooltip>
                        )}
                    </TooltipContainer>
                </Row>
            ))}
        </FormSection>
    );
};

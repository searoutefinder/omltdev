import React, {MouseEvent} from 'react';
import { TemplatesUploadStatus, TemplatesUploadText, TemplateUploadSquare } from '../Elements';
import { TemplatesStatus } from '../../../context/CreateContext';

type TemplateStatusSectionProps = {
  data: TemplatesStatus;
  template: string | null;
  InputKeys: any;
  setTemplate: (template: string) => void;
  resetForm: () => void;
  setMessage: (message: any) => void;
};


export const TemplateStatusSection = ({
  data,
  template,
  InputKeys,
  setTemplate,
  resetForm,
  setMessage,
}: TemplateStatusSectionProps) => {
  if (!data || !InputKeys) {
    return null;
  }

  const handleSelectChange = (e:MouseEvent<HTMLDivElement>, value: string) => {
    e.preventDefault();
    setTemplate(value);
    resetForm();
    setMessage(null);
  };

  
  return (
    <TemplatesUploadStatus>
      {InputKeys.options?.map((option: any, idx: number) => (
        <TemplateUploadSquare
          key={idx}
          $status={
            data.templates.find((temp) => temp.value === option.value)?.status === 'confirmed'
              ? 'confirmed'
              : template === option.value
              ? 'Selected'
              : 'Disabled'
          }
          onClick={(e) => handleSelectChange(e, option.value)}
        >
          <TemplatesUploadText>{option.type}</TemplatesUploadText>
        </TemplateUploadSquare>
      ))}
    </TemplatesUploadStatus>
  );
};

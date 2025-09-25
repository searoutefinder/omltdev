export type FormField = {
    type : string;
    desc: string;
    placeholder?: string;
    options?: Options[];
    actions ?: Actions[];
    mandatory?: boolean;
    disabled: boolean;
    value?: string;
  };
  
  type Actions = {
    value: string | null;
    type: string;
    desc: string;
    disabled?: boolean;
  }
  

  type Options = {
    type: string;
    value: string;
    message: string;
    disabled?: boolean;
  }

  export type FormSectionProps = {
    [key: string]: FormField;
  };


  export type MessageProps = {
    type: string; 
    message: string;
  }

  
  export type TemplatesStatus = {
    id: string;
    name: string;
    templates: {
       id: number;
       name: string;
       value: string;
       status: 'confirmed' | 'not_submitted';
       date: string;
    }[]; 
 };


 export type FormatProps = {
    name: string;
    type: string;
    disabled: boolean;
  };
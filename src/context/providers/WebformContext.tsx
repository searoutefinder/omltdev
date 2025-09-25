import React, {useState, ReactNode } from "react";
import { TemplatesStatus, TemplatesStatusContext } from "../CreateContext";
import { InitialTemplateStates } from "../initialTemplateStates";


//==============Webform Template Status Context
const TemplateStatusProvider = ({ children }: { children: ReactNode }) => {

  const [templatesStatus, setTemplatesStatus] = useState<TemplatesStatus>(InitialTemplateStates);

  const updateTemplateStatus = (templateId: string, newStatus: 'confirmed' | 'not_submitted') => {
    setTemplatesStatus(prevState => {
      const updatedTemplates = prevState.templates.map(template => {
        if (template.value === templateId) {
          return {
            ...template,
            status: newStatus,
          };
        } else {
          return template;
        }
      });

      return {
        ...prevState,
        templates: updatedTemplates,
      };
    });
  };

  const updateSessionId = (sessionId: string) => {
    setTemplatesStatus(prevState => {
      return {
        ...prevState,
        sessionId: sessionId,
      };
    }
    );
  };

  const updateValidated = (templateId: string, validated: boolean) => {
    setTemplatesStatus(prevState => {
      const updatedTemplates = prevState.templates.map(template => {
        if (template.value === templateId) {
          return {
            ...template,
            validated: validated,
          };
        } else {
          return template;
        }
      });

      return {
        ...prevState,
        templates: updatedTemplates,
      };
    }
    );
  };


  return (
    <TemplatesStatusContext.Provider value={{ data: templatesStatus, updateTemplateStatus, updateSessionId, updateValidated }}>
      {children}
    </TemplatesStatusContext.Provider>
  );
}

export {
  TemplateStatusProvider
};

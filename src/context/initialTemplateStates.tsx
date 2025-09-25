import {TemplatesStatus} from "./CreateContext";

//initial states for templates statis
export const InitialTemplateStates : TemplatesStatus = {
    sessionId: "",
    name: "Data Submission Form",
    templates: [
        {
        id: 3,
        name: "Preserves Template",
        value: "preserves",
        validated: false,
        status: "not_submitted",
        date: "",
        },
        {
        id: 2,
        name: "Trails Template",
        value: "trails",
        validated: false,
        status: "not_submitted",
        date: "",
        },
        {
        id: 0,
        name: "Trailheads Template",
        value: "trailheads",
        validated: false,
        status: "not_submitted",
        date: "",
        },
        {
        id: 1,
        name: "POIs Template",
        value: "POIs",
        validated: false,
        status: "not_submitted",
        date: "",
        },
    ],
};

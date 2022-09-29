export interface Form {
    name: string;
    status: string;
    eligibility: boolean;
    nextFormId: string;
    sections: Section[];
}

export interface Section {

    sectionTitle: string;
    rows: Row[];
}

export interface Row {
    fields: Field[];
}

export interface WidgetData {
    title: string;
    value: string;
    isSelected: boolean;
}

export interface Field {
    type: string;
    title: string;
    minLength: number;
    maxLength: number;
    validationType: validationType;
    widgetData: WidgetData[];
    row: boolean;
    required: boolean;
    childField: null;
}

export interface validationType {
    regex:string;
    breOperators:string;
    tooltip:string;
    validationTypeName:string;

}
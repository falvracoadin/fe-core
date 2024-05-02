interface FormulirModel {
    id?: string;
    form_title: string;
    sections: string[];
    detail_sections: { [key: string]: DetailSection };
    forms: { [key: string]: Form };
    is_draft: number;
    is_multi: number;
}

interface DetailSection {
    id: string;
    title: string;
    desc: string;
    forms: string[];
}

interface Form {
    id: string;
    content: Content[];
}

interface Content {
    id?: string;
    name: string;
    iconId: number;
    desc: string;
    type: string;
    tampilan: { [key: string]: boolean };
    property: { [key: string]: Property };
    format?: any;
    option?: Option[];
    value?: any;
    isDrag?: boolean;
}

interface Property {
    placeholder: string;
    type: string;
    value: any;
}

interface Option {
    id: number;
    label: string;
    selected?: boolean;
}

export { FormulirModel, Content };

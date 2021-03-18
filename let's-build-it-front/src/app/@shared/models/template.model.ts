export interface TemplateModel {
  id: number;
  templateType: TemplateType;
  type: string;
  name: string;
  lastValue?: TemplateValueModel;
}

export interface TemplateField {
  name: string;
  type: string;
  fields?: TemplateField[];
}

export interface TemplateValueModel {
  id?: number;
  templateId: number;
  creatorUserId?: number;
  value: string;
  created?: Date;
}

export enum TemplateType {
  Email = 0,
  Sms,
  Push,
}

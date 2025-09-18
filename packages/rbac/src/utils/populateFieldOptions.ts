import { Field, SelectField } from 'payload';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const populateOptions = (fields: Field[], entities: any) => {
  fields.forEach((field: Field) => {
    if ('fields' in field) {
      populateOptions(field.fields, entities);
    }
    if ('name' in field) {
      if (field.name == 'entity') {
        (field as SelectField).options = entities;
      }
    } else {
      if (field.type == 'tabs') {
        field.tabs.forEach((tab: { fields: Field[] }) => populateOptions(tab.fields, entities));
      }
    }
  });
};

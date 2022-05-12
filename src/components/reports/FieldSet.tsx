import React from 'react';
import {Field, ErrorMessage} from 'formik';

type FieldSetConfig = {
  name: string;
  label: string;
  type?: string;
  as?: string;
};


const FieldSet: React.FC<FieldSetConfig> = ({name, label, ...rest}) => (
  <>
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} {...rest} />
    <ErrorMessage name={name} component="p" className="error-text"/>
  </>
);

export default FieldSet;

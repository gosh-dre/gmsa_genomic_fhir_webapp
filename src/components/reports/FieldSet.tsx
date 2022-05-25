import {Field, ErrorMessage} from 'formik';
import {FC} from "react";

type Props = {
  name: string;
  label: string;
  type?: string;
  as?: string;
};


const FieldSet: FC<Props> = ({name, label, ...rest}) => (
  <>
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} {...rest} />
    <ErrorMessage name={name} component="p" className="error-text"/>
  </>
);

export default FieldSet;

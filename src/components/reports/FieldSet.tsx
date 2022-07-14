import { ErrorMessage, Field } from "formik";
import { FC } from "react";

type Props = {
  name: string;
  label: string;
  type?: string;
  as?: string;
  selectOptions?: { code: string; display: string }[];
};

const FieldSet: FC<Props> = ({ name, label, selectOptions, ...rest }) => {
  let field: JSX.Element = <Field id={name} name={name} {...rest} />;

  if (selectOptions !== undefined) {
    field = (
      <Field id={name} name={name} as="select" {...rest}>
        {selectOptions.map((opt) => (
          <option value={opt.code}>{opt.display}</option>
        ))}
      </Field>
    );
  }

  return (
    <>
      <label htmlFor={name}>{label}</label>
      {field}
      <ErrorMessage name={name} component="p" className="error-text" />
    </>
  );
};

export default FieldSet;

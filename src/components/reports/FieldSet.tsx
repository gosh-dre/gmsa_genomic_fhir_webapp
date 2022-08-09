import { ErrorMessage, Field } from "formik";
import { FC } from "react";
import { Coding } from "@smile-cdr/fhirts/dist/FHIR-R4/classes/models-r4";

type Props = {
  name: string;
  label: string;
  type?: string;
  as?: string;
  selectOptions?: Coding[];
};

const FieldSet: FC<Props> = ({ name, label, selectOptions, ...rest }) => {
  let field: JSX.Element = <Field id={name} name={name} {...rest} />;

  if (selectOptions !== undefined) {
    const selectsWithInitial = [{ code: "", display: "Please select" }, ...selectOptions];

    field = (
      <Field id={name} name={name} as="select" {...rest}>
        {selectsWithInitial.map((opt) => (
          <option key={opt.code} value={opt.code} role="select">
            {opt.display}
          </option>
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

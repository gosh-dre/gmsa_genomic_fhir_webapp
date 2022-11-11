import { ErrorMessage, Field } from "formik";
import { ChangeEventHandler, FC } from "react";
import { RequiredCoding } from "../../code_systems/types";
import CustomSelectField from "./CustomSelectField";

type Props = {
  name: string;
  label: string;
  type?: string;
  as?: string;
  selectOptions?: RequiredCoding[];
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  isMulti?: boolean;
  multiSelectOptions?: any;
};

/**
 * Field Set component to wrap around Formik input fields.
 * @param name html id and name of the field
 * @param label label to display to the user
 * @param selectOptions if present, will display as a select drop-down with these options
 * @param rest any other props to pass though to Formik
 * @constructor
 */
const FieldSet: FC<Props> = ({ name, label, selectOptions, isMulti, multiSelectOptions, ...rest }) => {
  let field: JSX.Element = <Field id={name} name={name} {...rest} />;

  if (selectOptions !== undefined) {
    const selectsWithInitial = [{ code: "", display: "Please select" }, ...selectOptions];

    field = (
      <Field id={name} name={name} as="select" {...rest}>
        {selectsWithInitial.map((opt) => (
          <option key={opt.code} value={opt.code} role="select">
            {(opt.code && `${opt.display} (${opt.code})`) || opt.display}
          </option>
        ))}
      </Field>
    );
  }

  if (isMulti) {
    field = (
      <Field
        className="custom-select"
        name="multiLanguages"
        options={multiSelectOptions}
        component={CustomSelectField}
        placeholder="Select multi options..."
        isMulti={true}
      />
    );
  }

  return (
    <>
      <label htmlFor={name}>{label}</label>
      {field}
      <ErrorMessage name={name} component="span" className="error-text" />
    </>
  );
};

export default FieldSet;

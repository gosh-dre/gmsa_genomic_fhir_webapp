import { FieldProps } from "formik";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface Props extends FieldProps {
  options: Option[];
  isMulti: boolean;
  className?: string;
  placeholder?: string;
}

const CustomSelectField = ({ className, placeholder, field, form, options, isMulti = false }: Props) => {
  const onChange = (option: Option | Option[]) => {
    form.setFieldValue(
      field.name,
      isMulti ? (option as Option[]).map((item: Option) => item.value) : (option as Option).value,
    );
  };

  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter((option: any) => field?.value?.indexOf(option.value) >= 0)
        : options.find((option: any) => option.value === field.value);
    } else {
      return isMulti ? [] : ("" as any);
    }
  };

  return (
    <Select
      inputId={field.name}
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
    />
  );
};

export default CustomSelectField;

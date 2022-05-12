import {fireEvent, render, screen} from "@testing-library/react";
import {Form, Formik} from "formik";
import * as Yup from "yup";

import FieldSet from "./FieldSet";
import React, {useState} from "react";


const testSchema = Yup.object().shape({
  test: Yup.string().required(),
}).required();

const TestComponent: React.FC = () => {
  const initialValues: Yup.InferType<typeof testSchema> = {
    test: ""
  }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testField, setTestField] = useState("");

  return (
    <>
      {isSubmitted && <div title="output">{testField}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={testSchema}
        onSubmit={(values, actions) => {
          setIsSubmitted(true)
          setTestField(values.test)
          actions.setSubmitting(false);
        }}
      >
        <Form>
          <FieldSet name={"test"} label={"Test field"}/>
          <button type="submit">submit</button>
        </Form>
      </Formik>
    </>

  );
}


describe("Field Set", () => {

    /**
     * Given a formik form that uses a single FieldSet Wrapper that is a required form field
     * When a value is submitted
     * Then the form should successfully submit
     */
    test('Form values are accessible through FieldSet wrapper', async () => {
      // Arrange
      render(<TestComponent/>);

      // Act
      const expected = "testValue";
      fireEvent.change(screen.getByLabelText(/test/i), {
        target: {
          value: expected
        }
      });
      fireEvent.click(screen.getByText(/submit/i));

      // Assert
      const output = await screen.findByTitle(/output/i)
      expect(output).toHaveTextContent(expected);
    });

    /**
     * Given a formik form that uses a single FieldSet Wrapper that is a required form field
     * When the form field is touched and then blurred
     * Then there should be a validation error
     */
    test('Form validation is preserved', async () => {
      // Arrange
      render(<TestComponent/>);

      // Act
      const testField = screen.getByLabelText(/test/i);
      fireEvent.touchStart(testField)
      fireEvent.blur(testField);

      // Assert
      const requiredText = await screen.findByText(/test is a required field/i);

      // Assert
      expect(requiredText).toBeInTheDocument();
    });

  }
);


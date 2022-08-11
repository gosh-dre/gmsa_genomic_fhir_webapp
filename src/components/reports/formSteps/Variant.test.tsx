import { FC } from "react";
import { Form, Formik } from "formik";
import { noValues } from "../FormDefaults";
import Card from "../../UI/Card";
import Variant from "./Variant";
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

/**
 * Slimmed down formik form for testing the variant page alone
 * @constructor
 */
const TestVariant: FC = () => {
  return (
    <Card>
      <Formik
        initialValues={noValues}
        onSubmit={() => {
          return;
        }}
      >
        {({ setFieldValue, values }) => (
          <Form role="form" autoComplete="off">
            <Variant values={values} setFieldValue={setFieldValue} />;
          </Form>
        )}
      </Formik>
    </Card>
  );
};

const addVariantWithGene = async (geneSearch: string, geneSymbol: string) => {
  await act(async () => {
    await userEvent.click(screen.getByText(/add a variant/i));
  });
  await act(async () => {
    const searchInput = screen.getByLabelText(/search/i);
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, geneSearch);
  });

  await act(async () => {
    const symbolSelect = screen.getAllByLabelText(/^Gene Symbol$/i, {}).at(-1);
    if (symbolSelect) {
      await userEvent.click(symbolSelect);
      await userEvent.selectOptions(symbolSelect, geneSymbol);
    }
  });
};

describe("Variant", () => {
  /**
   * Given the variant page has been rendered and 2 variants with the same gene, 1 variant with another gene
   * When a final variant is added with an existing gene
   * Then the two genes used should be in the final options, and the only other option should be the select placeholder
   */
  test("Duplicate genes not shown", async () => {
    // Arrange
    render(<TestVariant />);
    await addVariantWithGene("TW", "TWENTY");
    await addVariantWithGene("ONE", "ONE");
    await addVariantWithGene("TW", "TWENTY");

    // Act
    await addVariantWithGene("ONE", "ONE");

    // Assert
    const finalSelect = screen.getAllByLabelText(/^Gene Symbol$/i, {}).at(-1);
    expect(finalSelect).toContainHTML("ONE");
    expect(finalSelect).toContainHTML("TWENTY");
    const optionCount = finalSelect?.innerHTML.match(/<option/g)?.length;
    expect(optionCount).toEqual(3);
  });
});

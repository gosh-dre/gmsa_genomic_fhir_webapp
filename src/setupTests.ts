// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import { enableFetchMocks } from "jest-fetch-mock";

jest.resetAllMocks();
/**
 * Mocking the return value of useNavigate so that we can determine if a component will redirect the user.
 */
export const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  enableFetchMocks();
  fetchMock.resetMocks();
  fetchMock.mockIf(/clinicaltables\.nlm\.nih\.gov\/api\/genes\/v4\/search/, (request: Request) => {
    let requestData: (number | string[] | string[][] | null)[] = [0, [], null, []];
    if (request.url.includes("TW")) {
      requestData = [2, ["TWO", "TWENTY"], null, [["TWO_SYMBOL"], ["TWENTY_SYMBOL"]]];
    } else if (request.url.includes("ONE")) {
      requestData = [1, ["ONE"], null, [["ONE_SYMBOL"]]];
    } else if (request.url.includes("GNAO1")) {
      requestData = [3, ["HGNC:27543", "HGNC:24498", "HGNC:4389"], null, [["GNAO1-DT"], ["GNAO1-AS1"], ["GNAO1"]]];
    }
    return Promise.resolve(JSON.stringify(requestData));
  });
});

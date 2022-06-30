import { FC } from "react";
import classes from "./LabSelect.module.css";

interface Props {
  selectedLab: string;
  setSelectedLabHandler: (e: string) => void;
}

const LabSelect: FC<Props> = (props) => {
  const { selectedLab, setSelectedLabHandler } = props;

  return (
    <div className={classes["lab-select-container"]}>
      Select Lab:
      <select
        name="lab-select"
        id="lab-select"
        className={classes["lab-select-picker"]}
        value={selectedLab}
        onChange={(e) => setSelectedLabHandler(e.target.value)}
      >
        {selectedLab === "please select a lab" ? (
          <option defaultValue="please select a lab">please select a lab</option>
        ) : null}
        <option value="gosh">Great Ormond Street Hospital</option>
      </select>
    </div>
  );
};

export default LabSelect;

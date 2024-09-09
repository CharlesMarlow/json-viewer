import { ChangeEvent, FC, useState } from "react";
import data from "./data/data.json";
import "./App.css";
import { JsonObject, JsonValue } from "./types";
import {
  formatJsonValue,
  formatPath,
  getValueFromPath,
  renderJsonData,
} from "./utils";

const App: FC = () => {
  const result = data as JsonObject;
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<JsonValue | undefined>(
    undefined
  );

  const handleKeyClick = (path: string[]) => {
    const formattedPath = `result.${formatPath(path)}`;
    setSelectedKey(formattedPath);

    // Find the selected value using the path
    const value = getValueFromPath(result, path);

    setSelectedValue(value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputPath = event.target.value;
    // Ensure initial value is set
    setSelectedKey(inputPath);

    // Remove "result." prefix if present to query data
    const cleanPath = inputPath.replace(/^result\./, "");

    const pathParts = cleanPath
      .split(/[\.\[\]]/)
      .filter((part) => part.trim() !== "");

    // Find the selected value using the path
    const value = getValueFromPath(result, pathParts);
    setSelectedValue(value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3 className="title" data-testid="title">
          JSON Viewer
        </h3>
        <section className="container">
          <input
            data-testid="json-input"
            className="json-input"
            type="text"
            placeholder="Property"
            onChange={handleInputChange}
            value={selectedKey}
            id="json-input"
          />
          <p className="json-value" data-testid="json-value">
            {selectedValue !== undefined ? (
              <span>{formatJsonValue(selectedValue)}</span>
            ) : (
              <span>undefined</span>
            )}
          </p>
          <div className="wrapper" data-testid="json-data">
            {renderJsonData(result, handleKeyClick, [])}
          </div>
        </section>
      </header>
    </div>
  );
};

export default App;

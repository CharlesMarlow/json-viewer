import React from 'react';
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

const renderApp = () => render(<App />);

const mockData = {
  date: "2021-10-27T07:49:14.896Z",
  hasError: false,
  fields: [
    {
      id: "4c212130",
      prop: "iban",
      value: "DE81200505501265402568",
      hasError: false,
    },
  ],
};

describe("<App> tests", () => {
  const getElements = () => {
    const data = screen.getByTestId("json-data");
    const input = screen.getByTestId("json-input");
    const title = screen.getByTestId("title");
    const value = screen.getByTestId("json-value");

    return {
      data,
      input,
      title,
      value,
    };
  };

  it("Renders the screen's main elements", () => {
    renderApp();

    const { data, input, title, value } = getElements();
    expect(title).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(data).toBeInTheDocument();
  });

  it("Checks for correct values when keys are clicked", () => {
    renderApp();

    // Click on a root key in the Json data
    const dateKey = screen.getByText(/date/);
    fireEvent.click(dateKey);

    // Assert value rendered below the input
    expect(screen.getByTestId("json-value")).toHaveTextContent(mockData.date);

    // Click on a nested key in the Json data
    const nestedIdKey = screen.getByText(/id/);
    fireEvent.click(nestedIdKey);

    // Assert value rendered for nested key
    expect(screen.getByTestId("json-value")).toHaveTextContent(
      mockData.fields[0].id
    );
  });

  it("Checks for undefined value for incorrect path", () => {
    renderApp();
    const { input } = getElements();

    // Type an incorrect path
    fireEvent.change(input, { target: { value: "incorrect.path" } });

    // Assert undefined value is rendered below the input
    expect(screen.getByTestId("json-value")).toHaveTextContent("undefined");
  });

  it("Checks for correct value when manually changing the input", () => {
    renderApp();
    const { input } = getElements();

    // Type a correct path
    fireEvent.change(input, { target: { value: "result.hasError" } });

    // Assert value rendered below the input
    expect(screen.queryByTestId("json-value")).toHaveTextContent("false");

    // Type a correct nested path
    fireEvent.change(input, { target: { value: "result.fields[0].value" } });

    // Assert value rendered below the input
    expect(screen.queryByTestId("json-value")).toHaveTextContent(
      mockData.fields[0].value
    );
  });
});

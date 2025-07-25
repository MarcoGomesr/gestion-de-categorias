import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import ZoomControls from ".";

const initialState = {
  grid: {
    zoom: 1,
    rows: [{ id: 1 }], // mock a category so controls show
  },
};

const store = configureStore({ reducer: () => initialState });

describe("ZoomControls", () => {
  it("should render buttons and zoom value", () => {
    render(
      <Provider store={store}>
        <ZoomControls />
      </Provider>
    );

    expect(screen.getByLabelText("Zoom out")).toBeInTheDocument();
    expect(screen.getByLabelText("Zoom in")).toBeInTheDocument();
    expect(screen.getByLabelText("Reset zoom")).toBeInTheDocument();
    expect(screen.getByText("100%"));
  });

  it("should not render if there are no categories", () => {
    const emptyStore = configureStore({
      reducer: () => ({ grid: { zoom: 1, rows: [] } }),
    });
    const { container } = render(
      <Provider store={emptyStore}>
        <ZoomControls />
      </Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});

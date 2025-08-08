import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it } from "vitest";
import ProductList from "./ProductList";



const mockCategoryId = "cat-123";

afterEach(() => {
  cleanup();
});

describe("ProductList", () => {
  it("renders the heading", () => {
    const store = configureStore({
      reducer: {
        grid: () => ({ rows: [], zoom: 1 }),
      },
    });

    render(
      <Provider store={store}>
        <ProductList rows={mockRows} categoryProductIds={mockCategoryId} />
      </Provider>,
    );
    expect(screen.getByText("Lista de productos")).toBeDefined();
  });

  it("renders the correct number of ProductCards", () => {

    const initialState = {
      grid: {
        zoom: 1,
        rows: [], // mock a category so controls show
      },
    };

  const store = configureStore({ reducer: () => initialState });

    render(
      <Provider store={store}>
        <ProductList rows={initialState.grid.rows} categoryProductIds={mockCategoryId} />
      </Provider>,
    );
    const cards = screen.getAllByTestId("product-card");
    // fakeProducts has 8 items
    expect(cards.length).toBe(8);


  });




});

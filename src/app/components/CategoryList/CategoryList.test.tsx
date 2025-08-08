import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import useEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import gridSlice from "@/shared/store/slices/gridSlice";
import type { Alignment } from "@/shared/types/grid";
import CategoryList from "./CategoryList";
import CategoryListContainer from "./CategoryListContainer";

afterEach(() => {
  cleanup();
});

describe("CategoryList", () => {
  it("renders empty message when there are no categories", () => {
    const initialState = {
      grid: {
        zoom: 1,
        rows: [], // mock a category so controls show
      },
    };

    const store = configureStore({ reducer: () => initialState });

    const gridRef = createRef<HTMLDivElement>();
    render(
      <Provider store={store}>
        <CategoryList
          rows={initialState.grid.rows}
          zoom={initialState.grid.zoom}
          onAddCategory={() => {}}
          gridRef={gridRef}
        />
      </Provider>,
    );
    expect(
      screen.getByText(
        /No hay categorías disponibles. Haz clic en "Añadir categoría" para empezar/,
      ),
    ).toBeInTheDocument();
  });

  it("should render title heading 'Gestion de categorías'", () => {
    const initialState = {
      grid: {
        zoom: 1,
        rows: [], // mock a category so controls show
      },
    };

    const store = configureStore({ reducer: () => initialState });

    const gridRef = createRef<HTMLDivElement>();
    render(
      <Provider store={store}>
        <CategoryList
          rows={initialState.grid.rows}
          zoom={initialState.grid.zoom}
          onAddCategory={() => {}}
          gridRef={gridRef}
        />
      </Provider>,
    );

    const title = screen.getByTestId("title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Gestion de categorías");
  });

  it("should render button 'Añadir categoría'", () => {
    const initialState = {
      grid: {
        zoom: 1,
        rows: [], // mock a category so controls show
      },
    };

    const store = configureStore({ reducer: () => initialState });

    const gridRef = createRef<HTMLDivElement>();
    render(
      <Provider store={store}>
        <CategoryList
          rows={initialState.grid.rows}
          zoom={initialState.grid.zoom}
          onAddCategory={() => {}}
          gridRef={gridRef}
        />
      </Provider>,
    );

    const button = screen.getByRole("button", { name: "Añadir categoría" });
    expect(button).toBeInTheDocument();
  });

  it("should add a row when button is clicked", async () => {
    const store = configureStore({
      reducer: {
        grid: gridSlice,
      },
    });

    render(
      <Provider store={store}>
        <CategoryListContainer />
      </Provider>,
    );

    const button = screen.getByTestId("add-category-button");
    await useEvent.click(button);

    const state = store.getState();
    expect(state.grid.rows).toHaveLength(1);
  });

  it("should not render row UI if no rows", () => {
    const store = configureStore({
      reducer: {
        grid: () => ({ rows: [], zoom: 1 }),
      },
    });

    render(
      <Provider store={store}>
        <CategoryListContainer />
      </Provider>,
    );

    expect(screen.queryByTestId("zoom-controls")).not.toBeInTheDocument();
  });

  it("should render row UI if rows exist", () => {
    const initialState = {
      grid: {
        zoom: 1,
        rows: [
          {
            id: "2rypWFbvZ5rtXT8_9pacx",
            alignment: "left",
            products: [],
          },
        ],
      },
    };

    const store = configureStore({ reducer: () => initialState });
    const gridRef = createRef<HTMLDivElement>();

    render(
      <Provider store={store}>
        <CategoryList
          rows={initialState.grid.rows.map((row) => ({
            ...row,
            alignment: row.alignment as Alignment,
          }))}
          zoom={initialState.grid.zoom}
          onAddCategory={() => {}}
          gridRef={gridRef}
        />
      </Provider>,
    );

    expect(screen.getByTestId("zoom-controls")).toBeInTheDocument();
  });
});

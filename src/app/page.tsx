import EditorGrid from "./components/EditorGrid";
import ProductLibrary from "./components/ProductLibrary";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <EditorGrid />
      </div>
      <div className="lg:col-span-1">
        <ProductLibrary />
      </div>
    </main>
  );
}

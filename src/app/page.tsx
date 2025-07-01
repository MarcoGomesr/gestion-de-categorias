import EditorGrid from "./components/EditorGrid";
import ProductLibrary from "./components/ProductLibrary";

export default function Home() {
  return (
    <main className="w-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <EditorGrid />
      </div>
      <div className="lg:col-span-1">
        <ProductLibrary />
      </div>
    </main>
  );
}

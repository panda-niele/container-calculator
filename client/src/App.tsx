import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import ContainerVisualizer from "./components/ContainerVisualizer";
import DimensionInput from "./components/ui/DimensionInput";
import QuantityInput from "./components/ui/QuantityInput";
import InfoPanel from "./components/ui/InfoPanel";
import PackageStats from "./components/PackageStats";
import { LanguageSwitcher } from "./components/ui/LanguageSwitcher";
import { LanguageProvider, useLanguage } from "./lib/LanguageContext";
import { cn } from "./lib/utils";

// Dimensioni predefinite in centimetri
// Размеры по умолчанию в сантиметрах
const DEFAULT_CONTAINER = { width: 230, height: 236, depth: 1201 };
const DEFAULT_PACKAGE = { width: 30, height: 40, depth: 40 };
const DEFAULT_QUANTITY = 20;

// Contenuto dell'app con accesso al contesto linguistico
// Контент приложения с доступом к языковому контексту
function AppContent() {
  const { t } = useLanguage();
  
  // Stato per le dimensioni
// Состояние для размеров
  const [containerDimensions, setContainerDimensions] = useState(DEFAULT_CONTAINER);
  const [packageDimensions, setPackageDimensions] = useState(DEFAULT_PACKAGE);
  const [packageQuantity, setPackageQuantity] = useState(DEFAULT_QUANTITY);
  const [usePallets, setUsePallets] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);

  // Mostra la tela una volta che tutto è caricato
// Показать холст после загрузки всего
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 text-gray-100 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t.appTitle}</h1>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 container mx-auto p-4 gap-4 overflow-auto landscape-row">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md md:w-1/4 lg:w-1/4 overflow-y-auto max-h-[calc(100vh-130px)] panel-landscape border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">{t.configuration}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">{t.containerDimensions}</h3>
              <DimensionInput 
                dimensions={containerDimensions} 
                onChange={setContainerDimensions} 
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t.packageDimensions}</h3>
              <DimensionInput 
                dimensions={packageDimensions} 
                onChange={setPackageDimensions} 
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">{t.packageQuantity}</h3>
              <QuantityInput 
                quantity={packageQuantity} 
                onChange={setPackageQuantity} 
              />
            </div>
            
            <PackageStats 
              containerDimensions={containerDimensions}
              packageDimensions={packageDimensions}
              packageQuantity={packageQuantity}
              usePallets={usePallets}
              onTogglePallets={setUsePallets}
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md flex-1 relative view-landscape border border-gray-700">
          {showCanvas && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [1500, 1500, 3000],
                  fov: 30,
                  near: 0.1,
                  far: 10000
                }}
                gl={{
                  antialias: true,
                  powerPreference: "default"
                }}
              >
                <color attach="background" args={["#333333"]} />
                
                <Suspense fallback={null}>
                  <ContainerVisualizer 
                    containerDimensions={containerDimensions}
                    packageDimensions={packageDimensions}
                    packageQuantity={packageQuantity}
                    usePallets={usePallets}
                  />
                </Suspense>
              </Canvas>

              {/* Info panel with keyboard controls */}
              <InfoPanel />
            </>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-2 text-center text-sm">
        <p>{t.copyright} {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

// Componente principale dell'App con i provider
// Основной компонент приложения с провайдерами
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppContent />
        <Toaster position="top-right" />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

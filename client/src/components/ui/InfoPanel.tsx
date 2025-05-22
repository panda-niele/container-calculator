import { useState } from "react";
import { Info, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function InfoPanel() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-10">
      {isOpen ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-md border border-gray-700 text-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{t.keyboardControls}</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <p><span className="font-bold text-gray-200">{t.cameraViews}</span></p>
            <ul className="space-y-1 pl-4">
              <li><span className="font-mono bg-gray-700 px-1 rounded">1</span> - {t.defaultView}</li>
              <li><span className="font-mono bg-gray-700 px-1 rounded">2</span> - {t.topView}</li>
              <li><span className="font-mono bg-gray-700 px-1 rounded">3</span> - {t.frontView}</li>
              <li><span className="font-mono bg-gray-700 px-1 rounded">4</span> - {t.sideView}</li>
              <li><span className="font-mono bg-gray-700 px-1 rounded">5</span> - {t.cornerView}</li>
            </ul>
            
            <p><span className="font-bold text-gray-200">{t.mouseControls}</span></p>
            <ul className="space-y-1 pl-4">
              <li><span className="font-semibold text-red-300">Left click + drag</span> - {t.rotateCamera}</li>
              <li><span className="font-semibold text-red-300">Right click + drag</span> - {t.panCamera}</li>
              <li><span className="font-semibold text-red-300">Scroll wheel</span> - {t.zoomInOut}</li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition-colors"
          title={t.keyboardControls}
        >
          <Info size={24} />
        </button>
      )}
    </div>
  );
}
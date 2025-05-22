import { useMemo } from "react";
import { 
  Dimensions, 
  calculateFillPercentage, 
  calculateMaxBoxes,
  STANDARD_PALLET
} from "@/lib/packing-algorithm";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/LanguageContext";

interface PackageStatsProps {
  containerDimensions: Dimensions;
  packageDimensions: Dimensions;
  packageQuantity: number;
  usePallets?: boolean;
  onTogglePallets?: (usePallets: boolean) => void;
}

export default function PackageStats({
  containerDimensions,
  packageDimensions,
  packageQuantity,
  usePallets = true,
  onTogglePallets,
}: PackageStatsProps) {
  const { t } = useLanguage();
  
  // Calculate statistics
  const stats = useMemo(() => {
    const fillPercentage = calculateFillPercentage(
      containerDimensions,
      packageDimensions,
      packageQuantity,
      usePallets
    );
    
    const maxBoxes = calculateMaxBoxes(containerDimensions, packageDimensions, usePallets);
    const fittingStatus = packageQuantity <= maxBoxes ? "fits" : "exceeds";
    
    const containerVolume = 
      containerDimensions.width * 
      containerDimensions.height * 
      containerDimensions.depth;
      
    const packageVolume = 
      packageDimensions.width * 
      packageDimensions.height * 
      packageDimensions.depth;
      
    const totalPackageVolume = packageVolume * packageQuantity;

    // Calculate pallet information
    let palletsNeeded = 0;
    let boxesPerPallet = 0;
    
    if (usePallets) {
      const boxesPerPalletX = Math.floor(STANDARD_PALLET.width / packageDimensions.width);
      const boxesPerPalletZ = Math.floor(STANDARD_PALLET.depth / packageDimensions.depth);
      boxesPerPallet = boxesPerPalletX * boxesPerPalletZ;
      palletsNeeded = Math.ceil(packageQuantity / boxesPerPallet);
    }
    
    return {
      fillPercentage,
      maxBoxes,
      fittingStatus,
      containerVolume,
      packageVolume,
      totalPackageVolume,
      actualBoxesFitted: Math.min(packageQuantity, maxBoxes),
      palletsNeeded,
      boxesPerPallet
    };
  }, [containerDimensions, packageDimensions, packageQuantity, usePallets]);

  // Ottieni il colore per la barra di avanzamento | Получить цвет для индикатора выполнения
  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg space-y-4 border border-gray-600">
      <h3 className="text-lg font-medium text-gray-100">{t.statistics}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-300">{t.fillPercentage}</span>
          <span className="font-semibold text-white">{stats.fillPercentage.toFixed(1)}%</span>
        </div>
        <Progress 
          value={stats.fillPercentage} 
          className={getProgressColor(stats.fillPercentage)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800 p-2 rounded border border-gray-600">
          <div className="text-sm text-gray-400">{t.maxBoxes}</div>
          <div className="font-bold text-white">{stats.maxBoxes}</div>
        </div>
        
        <div className="bg-gray-800 p-2 rounded border border-gray-600">
          <div className="text-sm text-gray-400">{t.currentlyFit}</div>
          <div className="font-bold text-white">{stats.actualBoxesFitted}</div>
        </div>
      </div>
      
      {usePallets && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 p-2 rounded border border-gray-600">
            <div className="text-sm text-gray-400">{t.palletsNeeded}</div>
            <div className="font-bold text-white">{stats.palletsNeeded}</div>
          </div>
          
          <div className="bg-gray-800 p-2 rounded border border-gray-600">
            <div className="text-sm text-gray-400">{t.boxesPerPallet}</div>
            <div className="font-bold text-white">{stats.boxesPerPallet}</div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300">{t.status}</span>
        {stats.fittingStatus === "fits" ? (
          <Badge className="bg-green-600">{t.allPackagesFit}</Badge>
        ) : (
          <Badge variant="destructive">
            {packageQuantity - stats.maxBoxes} {t.packagesDontFit}
          </Badge>
        )}
      </div>
      
      {onTogglePallets && (
        <div className="flex items-center space-x-2 pt-3 mt-2 border-t border-gray-600">
          <div className="bg-gray-900 p-3 rounded-lg w-full border border-red-800">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="use-pallets" 
                className="font-medium text-red-300"
              >
                {t.usePallets}
              </Label>
              <Switch 
                id="use-pallets" 
                checked={usePallets}
                onCheckedChange={onTogglePallets}
                className="data-[state=checked]:bg-red-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
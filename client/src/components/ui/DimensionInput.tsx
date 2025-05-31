import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dimensions } from "@/lib/packing-algorithm";
import { useLanguage } from "@/lib/LanguageContext";

interface DimensionInputProps {
  dimensions: Dimensions;
  onChange: (dimensions: Dimensions) => void;
  hideWeight?: boolean;
}

export default function DimensionInput({ dimensions, onChange, hideWeight = false }: DimensionInputProps) {
  const { t } = useLanguage();
  const [width, setWidth] = useState(dimensions.width.toString());
  const [height, setHeight] = useState(dimensions.height.toString());
  const [depth, setDepth] = useState(dimensions.depth.toString());
  const [weight, setWeight] = useState((dimensions.weight || 0).toString());

  const handleChange = (dimension: "width" | "height" | "depth" | "weight", value: string) => {
    // Only allow positive numbers
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    // Update local state
    if (dimension === "width") setWidth(value);
    if (dimension === "height") setHeight(value);
    if (dimension === "depth") setDepth(value);
    if (dimension === "weight") setWeight(value);
  };

  // Update dimensions when inputs are changed and valid
  useEffect(() => {
    const newWidth = parseFloat(width);
    const newHeight = parseFloat(height);
    const newDepth = parseFloat(depth);
    const newWeight = parseFloat(weight);
    
    // Only update if all required values are valid numbers greater than 0
    if (newWidth > 0 && newHeight > 0 && newDepth > 0) {
      onChange({
        width: newWidth,
        height: newHeight,
        depth: newDepth,
        weight: newWeight >= 0 ? newWeight : 0,
      });
    }
  }, [width, height, depth, weight, onChange]);

  const gridCols = hideWeight ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${gridCols} gap-2`}>
      <div>
        <Label htmlFor="width">{t.width}</Label>
        <Input
          type="text"
          id="width"
          value={width}
          onChange={(e) => handleChange("width", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="height">{t.height}</Label>
        <Input
          type="text"
          id="height"
          value={height}
          onChange={(e) => handleChange("height", e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="depth">{t.depth}</Label>
        <Input
          type="text"
          id="depth"
          value={depth}
          onChange={(e) => handleChange("depth", e.target.value)}
          className="mt-1"
        />
      </div>
      {!hideWeight && (
        <div>
          <Label htmlFor="weight">{t.weight}</Label>
          <Input
            type="text"
            id="weight"
            value={weight}
            onChange={(e) => handleChange("weight", e.target.value)}
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
}

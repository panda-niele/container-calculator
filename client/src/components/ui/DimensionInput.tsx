import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Dimensions } from "@/lib/packing-algorithm";
import { useLanguage } from "@/lib/LanguageContext";

interface DimensionInputProps {
  dimensions: Dimensions;
  onChange: (dimensions: Dimensions) => void;
}

export default function DimensionInput({ dimensions, onChange }: DimensionInputProps) {
  const { t } = useLanguage();
  const [width, setWidth] = useState(dimensions.width.toString());
  const [height, setHeight] = useState(dimensions.height.toString());
  const [depth, setDepth] = useState(dimensions.depth.toString());

  const handleChange = (dimension: "width" | "height" | "depth", value: string) => {
    // Only allow positive numbers
    if (!/^\d*\.?\d*$/.test(value)) return;
    
    // Update local state
    if (dimension === "width") setWidth(value);
    if (dimension === "height") setHeight(value);
    if (dimension === "depth") setDepth(value);
  };

  // Update dimensions when inputs are changed and valid
  useEffect(() => {
    const newWidth = parseFloat(width);
    const newHeight = parseFloat(height);
    const newDepth = parseFloat(depth);
    
    // Only update if all values are valid numbers greater than 0
    if (newWidth > 0 && newHeight > 0 && newDepth > 0) {
      onChange({
        width: newWidth,
        height: newHeight,
        depth: newDepth,
      });
    }
  }, [width, height, depth, onChange]);

  return (
    <div className="grid grid-cols-3 gap-2">
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
    </div>
  );
}

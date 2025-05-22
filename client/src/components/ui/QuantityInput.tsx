import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface QuantityInputProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

export default function QuantityInput({ quantity, onChange }: QuantityInputProps) {
  const { t } = useLanguage();
  const [value, setValue] = useState(quantity.toString());

  const handleChange = (newValue: string) => {
    // Only allow positive integers
    if (!/^\d*$/.test(newValue)) return;
    
    setValue(newValue);
  };

  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    onChange(newQuantity);
    setValue(newQuantity.toString());
  };

  const handleDecrement = () => {
    // Don't go below 1
    if (quantity <= 1) return;
    
    const newQuantity = quantity - 1;
    onChange(newQuantity);
    setValue(newQuantity.toString());
  };

  // Update quantity when input is changed
  useEffect(() => {
    const newQuantity = parseInt(value);
    
    // Only update if value is a valid number greater than 0
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onChange(newQuantity);
    }
  }, [value, onChange]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <div className="flex-1">
        <Label htmlFor="quantity" className="sr-only">
          {t.packageQuantity}
        </Label>
        <Input
          type="text"
          id="quantity"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="text-center"
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrement}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

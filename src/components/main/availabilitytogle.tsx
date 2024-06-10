import React from "react";
import { Button } from "@/components/ui/button";

interface AvailabilityToggleProps {
  showAvailable: boolean;
  setShowAvailable: (available: boolean) => void;
}

const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({
  showAvailable,
  setShowAvailable,
}) => (
  <div className="mb-4 w-full flex space-x-4">
    <Button
      className="px-4 py-2"
      variant={showAvailable ? "default" : "outline"}
      onClick={() => setShowAvailable(true)}
    >
      Available
    </Button>
    <Button
      className="px-4 py-2"
      variant={!showAvailable ? "default" : "outline"}
      onClick={() => setShowAvailable(false)}
    >
      All
    </Button>
  </div>
);

export default AvailabilityToggle;

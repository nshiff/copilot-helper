import React, { useState } from "react";

export const ExampleComponent: React.FC = () => {
  const [isRed, setIsRed] = useState(true);

  const toggleColor = () => {
    setIsRed(!isRed);
  };

  return (
    <div>
      <p style={{ color: isRed ? "red" : "blue" }}>This text changes color!</p>
      <button onClick={toggleColor}>Toggle Color</button>
    </div>
  );
};

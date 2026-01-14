import { useState } from "react";

export const useToggle = (initialValue: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);
  const toggle = () => setIsOpen(!isOpen);
  return [isOpen, toggle, setIsOpen] as const;
};

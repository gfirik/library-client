import { FC, ReactNode } from "react";

interface DescriptionProps {
  children: ReactNode;
}

const Description: FC<DescriptionProps> = ({ children }) => {
  return <p id="dialog-description">{children}</p>;
};
export default Description;

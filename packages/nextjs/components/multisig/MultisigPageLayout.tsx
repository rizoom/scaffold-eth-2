import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";

type MultisigPageLayoutProps = {
  children?: React.ReactNode;
};
export const MultisigPageLayout = ({ children }: MultisigPageLayoutProps) => {
  return (
    <div className="relative flex flex-col grow items-center bg-base-300 gap-8 p-10">
      <DiamondIcon className="absolute left-0 top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />
      {children}
    </div>
  );
};

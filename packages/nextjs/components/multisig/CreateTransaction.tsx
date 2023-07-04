import { useEffect, useState } from "react";
import { MultisigPageLayout } from "./MultisigPageLayout";
import { type TransactionDescription } from "ethers/lib/utils.js";
import { useLocalStorage } from "usehooks-ts";
import { Spinner } from "~~/components/Spinner";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const CONTRACT_NAME = "MetaMultiSigWallet";

export const CreateTransaction = () => {
  return (
    <MultisigPageLayout>
      <CreateTransactionCard />
    </MultisigPageLayout>
  );
};

function CreateTransactionCard() {
  return (
    <div className="flex flex-col w-full sm:max-w-lg gap-4 bg-base-100 rounded-2xl shadow-md  border border-base-300 p-5">
      <CreateTransactionCardContent />
    </div>
  );
}

function CreateTransactionCardContent() {
  // TODO: decode data or allow custom tx?

  const [encodedData] = useLocalStorage<string | undefined>("multisig.owners.encodedData", undefined);
  const [parsedData, setParsedData] = useState<TransactionDescription | undefined>(undefined);

  const { data: multisigContract, isLoading } = useScaffoldContract({ contractName: CONTRACT_NAME });

  useEffect(() => {
    if (encodedData && multisigContract) {
      const parsed = multisigContract.interface.parseTransaction({ data: encodedData });
      setParsedData(parsed);

      console.log("parsed: ", parsed);
    }
  }, [encodedData, multisigContract]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (!multisigContract) {
    return <div className="text-error">{`No contract found by the name of "${CONTRACT_NAME}"!`}</div>;
  }

  return (
    <>
      <div>{parsedData ? "Has parsed data" : "No parsed data"}</div>
      <div>{parsedData?.name}</div>
      <div>{parsedData?.signature}</div>
      <div>{parsedData?.args.map(v => v.toString()).join()}</div>
    </>
  );
}

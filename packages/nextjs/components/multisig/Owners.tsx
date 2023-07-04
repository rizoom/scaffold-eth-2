import { MultisigPageLayout } from "./MultisigPageLayout";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const CONTRACT_NAME = "MetaMultiSigWallet";

export const Owners = () => {
  return (
    <MultisigPageLayout>
      <OwnerCard />
    </MultisigPageLayout>
  );
};

function OwnerCard() {
  // TODO isLoading
  const { data: signaturesRequired } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "signaturesRequired",
  });

  const {
    data: events,
    // isLoading: isLoadingEvents,
    // error: errorReadingEvents,
  } = useScaffoldEventHistory({
    contractName: CONTRACT_NAME,
    eventName: "Owner",
    // Specify the starting block number from which to read events.
    fromBlock: 1,
    // blockData: true,
    // Apply filters to the event based on parameter names and values { [parameterName]: value },
    // filters: { premium: true }
    // If set to true it will return the transaction data for each event (default: false),
    // transactionData: true,
    // If set to true it will return the receipt data for each event (default: false),
    // receiptData: true
  });

  console.log("events", events);
  console.log("signaturesRequired", signaturesRequired);

  return (
    <div className="flex flex-col w-full sm:max-w-xs gap-4 bg-base-200 opacity-90 p-5 rounded-2xl shadow-lg">
      <span className="text-2xl">Signatures required: {signaturesRequired?.toNumber()}</span>
      {events?.map(event => (
        <div key={`owner_${event.args.owner}`} className="flex justify-between">
          <Address address={event.args.owner} />
          <div>{event.args.added ? "👍" : "👎"}</div>
        </div>
      ))}
    </div>
  );
}

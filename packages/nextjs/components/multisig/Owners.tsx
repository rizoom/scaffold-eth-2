import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { MultisigPageLayout } from "./MultisigPageLayout";
import { useLocalStorage } from "usehooks-ts";
import { Spinner } from "~~/components/Spinner";
import { Address, AddressInput, InputBase } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

const CONTRACT_NAME = "MetaMultiSigWallet";

export const Owners = () => {
  return (
    <MultisigPageLayout>
      <OwnerCard />
      <ModifyOwnersCard />
    </MultisigPageLayout>
  );
};

function OwnerCard() {
  return (
    <div className="flex flex-col w-full sm:max-w-xs gap-4 bg-base-200 opacity-90 p-5 rounded-2xl shadow-lg">
      <OwnerCardContent />
    </div>
  );
}

function OwnerCardContent() {
  const {
    data: signaturesRequired,
    isLoading: isLoadingSignaturesRequired,
    error: errorSignaturesRequired,
  } = useScaffoldContractRead({
    contractName: CONTRACT_NAME,
    functionName: "signaturesRequired",
  });

  const {
    data: events,
    isLoading: isLoadingEvents,
    error: errorEvents,
  } = useScaffoldEventHistory({
    contractName: CONTRACT_NAME,
    eventName: "Owner",
    fromBlock: 1,
  });

  if (isLoadingSignaturesRequired || isLoadingEvents || !signaturesRequired || !events) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (errorSignaturesRequired || errorEvents) {
    console.error("Owner card error", errorSignaturesRequired || errorEvents);
    return <div className="text-error">Error while retrieving owners.</div>;
  }

  return (
    <>
      <span className="text-2xl">Signatures required: {signaturesRequired.toNumber()}</span>
      {events.map(event => (
        <div key={`owner_${event.args.owner}`} className="flex justify-between">
          <Address address={event.args.owner} />
          <div>{event.args.added ? "👍" : "👎"}</div>
        </div>
      ))}
    </>
  );
}

type MethodName = "addSigner" | "removeSigner";

function ModifyOwnersCard() {
  return (
    <div className="flex flex-col w-full sm:max-w-lg gap-4 bg-base-100 rounded-2xl shadow-md  border border-base-300 p-5">
      <ModifyOwnersCardContent />
    </div>
  );
}

function ModifyOwnersCardContent() {
  const router = useRouter();

  const [methodName, setMethodName] = useState<MethodName | undefined>(undefined);
  const [address, setAddress] = useState<string>("");
  const [signaturesRequired, setSignaturesRequired] = useState<number | undefined>(undefined);

  const [, setEncodedData] = useLocalStorage<string | undefined>("multisig.owners.encodedData", undefined);

  const { data: multisigContract, isLoading } = useScaffoldContract({ contractName: CONTRACT_NAME });

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

  const onMethodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMethodName((e.target.value as MethodName) || undefined);
  };

  const onSignaturesRequiredChange = (rawValue: string) => {
    const value = rawValue.trim();
    if (value) {
      const number = parseInt(value);
      if (!isNaN(number)) {
        setSignaturesRequired(number);
      }
    } else {
      setSignaturesRequired(undefined);
    }
  };

  return (
    <>
      <select
        value={methodName || ""}
        onChange={onMethodChange}
        className={`select select-bordered w-full max-w-xs border-2 border-base-300 bg-base-200${
          !methodName ? " opacity-50" : ""
        }`}
      >
        <option value="" disabled>
          Pick a method to update owners
        </option>
        <option value="addSigner">addSigner()</option>
        <option value="removeSigner">removeSigner()</option>
      </select>
      <AddressInput placeholder="owner address" value={address} onChange={setAddress} />
      <InputBase
        placeholder="new # of signatures required"
        value={signaturesRequired !== undefined ? String(signaturesRequired) : ""}
        onChange={onSignaturesRequiredChange}
      />

      <div className="flex justify-end gap-2">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            setMethodName(undefined);
            setAddress("");
            setSignaturesRequired(undefined);
          }}
        >
          Clear
        </button>
        <button
          className="btn btn-primary btn-sm"
          disabled={!methodName || !address || !signaturesRequired}
          onClick={() => {
            const encodedData = multisigContract.interface.encodeFunctionData(methodName!, [
              address,
              signaturesRequired,
            ]);
            setEncodedData(encodedData);

            setMethodName(undefined);
            setAddress("");
            setSignaturesRequired(undefined);

            router.push("/multisig/create");
          }}
        >
          Submit tx
        </button>
      </div>
    </>
  );
}

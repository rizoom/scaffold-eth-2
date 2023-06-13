import { CopyIcon } from "./assets/CopyIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { HareIcon } from "./assets/HareIcon";
import { QRCodeSVG } from "qrcode.react";
import { Spinner } from "~~/components/Spinner";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

const CONTRACT_NAME = "MetaMultiSigWallet";

export const Multisig = () => {
  return (
    <div className="relative flex flex-col grow items-center bg-base-300 gap-8 p-10">
      <DiamondIcon className="absolute left-0 top-24" />
      <CopyIcon className="absolute bottom-0 left-36" />
      <HareIcon className="absolute right-0 bottom-24" />

      <MultisigContractCard />
      <TransactionsTable />
    </div>
  );
};

function MultisigContractCard() {
  return (
    <div className="flex gap-2 w-full max-w-xs">
      <div className="flex flex-col grow gap-4 bg-base-200 opacity-90 p-5 rounded-2xl shadow-lg">
        <span className="text-2xl text-black">{CONTRACT_NAME}</span>
        <MultisigContractCardContent />
      </div>
    </div>
  );
}

function MultisigContractCardContent() {
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(CONTRACT_NAME);

  if (deployedContractLoading) {
    return <Spinner />;
  }

  if (!deployedContractData) {
    return <div className="text-error">{`No contract found by the name of "${CONTRACT_NAME}"!`}</div>;
  }

  return (
    <div className="items-center flex flex-col">
      <Balance address={deployedContractData.address} className="px-0 mb-2" />
      <div className="rounded-2xl bg-white p-6">
        <QRCodeSVG value={deployedContractData.address} size={180} level="H" />
      </div>
      <div className="mt-4">
        <Address address={deployedContractData.address} />
      </div>
    </div>
  );
}

function TransactionsTable({}) {
  const targetNetwork = getTargetNetwork();
  const isLoading = true;

  // TODO

  return (
    <div className="flex justify-center opacity-90">
      <table className="table table-zebra w-full shadow-lg">
        <thead>
          <tr>
            <th className="bg-primary">Transaction Hash</th>
            <th className="bg-primary">Function Called</th>
            <th className="bg-primary">Block Number</th>
            <th className="bg-primary">Time Mined</th>
            <th className="bg-primary">From</th>
            <th className="bg-primary">To</th>
            <th className="bg-primary text-end">Value ({targetNetwork.nativeCurrency.symbol})</th>
          </tr>
        </thead>
        {isLoading ? (
          <tbody>
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex} className="bg-base-200 hover:bg-base-300 transition-colors duration-200 h-12">
                {[...Array(7)].map((_, colIndex) => (
                  <td className="w-1/12" key={colIndex}>
                    <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            {/* {blocks.map(block =>
              block.transactions.map(tx => {
                const receipt = transactionReceipts[tx.hash];
                const timeMined = new Date(block.timestamp * 1000).toLocaleString();
                const functionCalled = tx.data.substring(0, 10);

                return (
                  <tr key={tx.hash} className="hover text-sm">
                    <td className="w-1/12">
                      <TransactionHash hash={tx.hash} />
                    </td>
                    <td className="w-2/12">
                      {tx.functionName === "0x" ? "" : <span className="mr-1">{tx.functionName}</span>}
                      {functionCalled !== "0x" && (
                        <span className="badge badge-primary font-bold text-xs">{functionCalled}</span>
                      )}
                    </td>
                    <td className="w-1/12">{block.number}</td>
                    <td className="w-2/12">{timeMined}</td>
                    <td className="w-2/12">
                      <Address address={tx.from} size="sm" />
                    </td>
                    <td className="w-2/12">
                      {!receipt?.contractAddress ? (
                        tx.to && <Address address={tx.to} size="sm" />
                      ) : (
                        <div className="relative">
                          <Address address={receipt.contractAddress} size="sm" />
                          <small className="absolute top-4 left-4">(Contract Creation)</small>
                        </div>
                      )}
                    </td>
                    <td className="text-right">
                      {ethers.utils.formatEther(tx.value)} {targetNetwork.nativeCurrency.symbol}
                    </td>
                  </tr>
                );
              }),
            )} */}
          </tbody>
        )}
      </table>
    </div>
  );
}

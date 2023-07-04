import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { CreateTransaction } from "~~/components/multisig/CreateTransaction";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader title="MultiSig | Create transaction" />
      <CreateTransaction />
    </>
  );
};

export default Home;

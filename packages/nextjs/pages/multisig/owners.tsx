import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { Owners } from "~~/components/multisig/Owners";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader title="MultiSig | Owners" />
      <Owners />
    </>
  );
};

export default Home;

import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { Multisig } from "~~/components/multisig/Multisig";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader title="MultiSig" />
      <Multisig />
    </>
  );
};

export default Home;

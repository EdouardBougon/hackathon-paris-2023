import { Network } from "alchemy-sdk";

export const uniswapNftAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const contractDelegation = "0xB5866Fca36161E09640B8E192B62F9CBD8aC90A4";
export const uniswapPackageManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
};

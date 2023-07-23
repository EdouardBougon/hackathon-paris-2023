import { Network } from "alchemy-sdk";

export const uniswapNftAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const contractDelegation = "0x0324EDb6c8C3a4Fd3b5cA596816FEa17D1d2044E";
export const uniswapPackageManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
};

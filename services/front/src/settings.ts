import { Network } from "alchemy-sdk";

export const uniswapNftAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const contractDelegation = "0xAEFa3a63f8196545459050E78c462E9479038aeC";
export const uniswapPackageManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
};

import { Network } from "alchemy-sdk";

export const uniswapNftAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const contractDelegation = "0x01b944fC076bD7B84fA8f00e3708C50279F92945";
export const uniswapPackageManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
};

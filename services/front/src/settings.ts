import { Network } from "alchemy-sdk";

export const uniswapNftAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
export const contractDelegation = "0x8c5617d1076cb3F2FBAec77c78cEC20af33A035d";
export const uniswapPackageManager =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

export const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_KEY,
  network: Network.MATIC_MAINNET,
};

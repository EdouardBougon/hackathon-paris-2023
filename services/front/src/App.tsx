import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Navbar } from "./components/navbar/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, zora } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { CardPosition } from "./components/card/Card";
import { ButtonTx } from "./components/buttonTx/ButtonTx";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Navbar />
          <CardPosition />
          <ButtonTx />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

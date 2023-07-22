import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Navbar } from "./components/navbar/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { CardPosition } from "./components/card/Card";
import { IsConnected } from "./context/isConnected";

const { chains, publicClient } = configureChains([polygon], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "b65e7127e551cc0f9290785b43b289d5",
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
          <IsConnected>
            <CardPosition />
          </IsConnected>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;

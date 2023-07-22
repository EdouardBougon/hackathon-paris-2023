import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    react({
      useContractRead: true,
      useContractFunctionRead: true,
      usePrepareContractFunctionWrite: true,
    }),
    foundry({
      project: "../contracts",
      exclude: [
        // the following patterns are excluded by default
        "IERC165.sol",
      ],
    }),
  ],
});

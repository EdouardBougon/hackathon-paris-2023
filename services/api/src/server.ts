/* eslint-disable quotes */
import type { Request, Response } from 'express';
import {
  PublicClient,
  createPublicClient,
  http,
} from 'viem';
import { positionDelegateAbi } from "./abis/positionDelegate.abi";

import cors from 'cors';
import express from 'express';
import { polygon } from 'viem/chains';

const app: express.Express = express();
const internalPort: number = process.env.PORT !== undefined ? Number(process.env.PORT) : 8887;
const externalPort: number = process.env.PORT !== undefined ? 443 : internalPort;
const protocol: string = externalPort === 443 ? 'https' : 'http';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const provider: PublicClient | undefined = createPublicClient({
  chain: polygon,
  transport: http(),
  batch: {
    multicall: false,
  },
});
const positionDelegateContractAddress: `0x${string}` = '0x8c5617d1076cb3F2FBAec77c78cEC20af33A035d';

app.get('/api/heartbeat', async (req: Request, res: Response): Promise<void> => {
  res.writeHead(200, {}).end('ok')
});

app.get('/api/token/metadata', async (req: Request, res: Response): Promise<void> => {
  if (req.query.tokenId === undefined) {
    res.writeHead(400, {}).end('Missing tokenId query parameter');
    return;
  }

  const tokenId: bigint = BigInt(req.query.tokenId as string);
  const permission: string = await isTokenIdOwnerOfWallet(BigInt(tokenId)) ?
    'OWNER' :
    'USER';
  const walletAddress: string | undefined = await getWalletAddress(tokenId);
  const position: bigint | undefined = await getWalletPosition(tokenId);
  const positionString: string =  position?.toString() ?? '0';

  const body: any = {
    name: `Delegated ${permission}`,
    description: `NFT ${tokenId} for the delegated position account ${walletAddress}`,
    image: `${protocol}://${req.hostname}:${externalPort}/api/token/metadata/image?tokenId=${tokenId}`,
    external_url: `https://polygonscan.com/tx/${walletAddress}`,
    attributes: [
      {
        trait_type: "Position",
        value: positionString,
      },
      {
        trait_type: "Wallet Address",
        value: walletAddress,
      },
      {
        trait_type: "Permission",
        value: walletAddress,
      },      
    ]
  };

  console.log(walletAddress, permission, position, positionString)

  res.writeHead(200, {}).end(JSON.stringify(body))
});

app.get('/api/token/metadata/image', async (req: Request, res: Response): Promise<void> => {
  if (req.query.tokenId === undefined) {
    res.writeHead(400, {}).end('Missing tokenId query parameter');
    return;
  }

  const tokenId: bigint = BigInt(req.query.tokenId as string);
  const walletAddress: string | undefined = await getWalletAddress(tokenId);
  const position: bigint | undefined = await getWalletPosition(tokenId);
  const positionString: string =  position?.toString() ?? '0';

  const permission: string = await isTokenIdOwnerOfWallet(tokenId) ?
    'OWNER' :
    'USER';

  const body: any =`<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" x="0" y="0" fill="#1F2548" />
      <a href="https://polygonscan.com/address/${walletAddress}#tokentxnsErc721" target="_blank">
        <text x="50%" y="10%" fill="white" text-decoration="underline" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle" font-size="20px">Delegated Wallet ${tokenId}</text>
      </a>
      <text x="50%" y="35%" fill="white" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle" font-size="20px">Wallet: ${walletAddress?.slice(0, 4)}...${walletAddress?.slice(-4)}</text>
      <text x="50%" y="45%" fill="white" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle" font-size="20px">Permission: ${permission}</text>
      <text x="50%" y="75%" fill="white" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle" font-size="20px">Total Value:</text>
      <text x="50%" y="85%" fill="white" font-family="Arial, Helvetica, sans-serif" dominant-baseline="middle" text-anchor="middle" font-size="20px">${positionString} USD</text>
    </svg>`;

  res.writeHead(200, {'Content-Type': 'image/svg+xml'}).end(body)
});


async function isTokenIdOwnerOfWallet(tokenId: bigint): Promise<boolean> {
  return (await provider?.readContract({
    address: positionDelegateContractAddress,
    abi: positionDelegateAbi,
    functionName: 'isTokenIdOwner',
    args: [tokenId],
  })) === true; 
}

async function getWalletAddress(tokenId: bigint): Promise<string | undefined> {
  return provider?.readContract({
    address: positionDelegateContractAddress,
    abi: positionDelegateAbi,
    functionName: 'getSafeAddressForTokenId',
    args: [tokenId],
  }) 
}

async function getWalletPosition(tokenId: bigint): Promise<bigint | undefined> {
  return provider?.readContract({
    address: positionDelegateContractAddress,
    abi: positionDelegateAbi,
    functionName: 'getValueOfUniswapPositionsFromTokenId',
    args: [tokenId],
  }) 
}

app.listen(internalPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Dev server started on port ${internalPort}`);
});


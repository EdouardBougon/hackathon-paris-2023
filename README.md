# Splitooor

We build Splitooor, a project to unlock owner/user separation for accounts.

To understand the project goal, let’s take a simple example. Let's imagine we own a liquidity position token on Uniswap V3, and we want to use it as a collateral to lend cryptos on a lending protocol. As a lending protocols require to have ownership of the collateral used to be able to seize it in case of non-repaiement, we would temporary lose the management on this liquidity provision. If the price shifts outside of the liquidity concentration range we initially defined, we would stop earning yield with this position.

Splitooor is an extension of the ERC-6551 (NFT Bound Accounts), which, in addition to providing me with an NFT that owns my account and can be use as a collateral, provides me with a NFT with limited privileges. This second NFT allows me to manage my account during a loan, without being able to extract any value.

So the first NFT representing the ownership goes to the lending protocol, while I can keep my second NFT to manage my liquidity position, such as for adjusting the liquidity concentration to follow the price of the pool and keep a maximal capital efficiency.
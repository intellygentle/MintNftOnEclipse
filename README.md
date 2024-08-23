# Guide To Minting NFT on Eclipse Testnet and Mainnet

## This is a three-steps task, try to sit tight

# STEP1

```
sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
```
## Run what you see in your terminal next

<img width="643" alt="expPath" src="https://github.com/user-attachments/assets/2a0fa0f4-aa79-4e70-86ed-4c068fd17cb8">

```
solana-install update
```

## Create a new wallet on backpack extension. Select eclipse in the option then run the next code and import the seedphrase of the wallet you just created
## Note that after pasting the seedphrase it wont show on the terminal. just click on enter, enter again, confirm the address, y, then enter

```
solana-keygen recover 'prompt:?key=0/0' --outfile ~/.config/solana/id.json --force
```
## for testnet 
```
solana config set --url https://testnet.dev2.eclipsenetwork.xyz/
```
## for mainnet 

```
solana config set --url https://mainnetbeta-rpc.eclipse.xyz
```
## Then continue here

```
solana config set --keypair ~/.config/solana/id.json
```
## You  can run solana address on the terminal to check the wallet address and note it down.
```
solana address
```

 # Step2

 ```
git clone https://github.com/Eclipse-Laboratories-Inc/eclipse-deposit
```
```
cd eclipse-deposit
```
```
yarn install
```




```
git clone https://github.com/Eclipse-Laboratories-Inc/eclipse-deposit
cd eclipse-deposit
yarn install
```
```
https://github.com/intellygentle/MintNftOnEclipse.git
MintNftOnEclipse
```
 

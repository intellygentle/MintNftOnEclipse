# Guide To Minting NFT on Eclipse Testnet and Mainnet

## This is a three-steps task, try to sit tight

# STEP1- Install Solana CLI

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

 # Step2- Bridge to Eclipse

 ```
git clone https://github.com/Eclipse-Laboratories-Inc/eclipse-deposit
```

```
cd eclipse-deposit

```

```
yarn install
```

##  fund a wallet with sepolia Eth 0.1 or mainnet Eth 0.0035, copy the private key and paste it in example-private-key.txt
```
nano example-private-key.txt 
```
## clean the text there, input the private key of the sepolia Eth and press ctrl+x then y and enter

## for testnet
```
node bin/cli.js -k example-private-key.txt -d yourBackPackWalletAddressForEclipse -a 0.005 --sepolia
```
## for Mainnet 
```
node bin/cli.js -k example-private-key.txt -d yourBackPackWalletAddressForEclipse -a 0.002 --mainnet
```

## Depending on the network you are running you should see this hash response which means you have bridged to eclipse testnet or mainnet

<img width="633" alt="hshh" src="https://github.com/user-attachments/assets/5aa465b1-0911-4ccd-a146-40f697a3f8ca">

# Step3- Mint NFT

```
git clone https://github.com/intellygentle/MintNftOnEclipse.git
```

```
cd MintNftOnEclipse
```

```
nvm install --lts
nvm use --lts
npm install -g typescript
npm install -g ts-node
tsc -v
ts-node -v
```
 ## Run solana config get then copy the keypair path, go to line 51 in index.ts and replace the "...blabla..." 
## with the keypair path you copied

```
solana config get
```

 <img width="607" alt="get" src="https://github.com/user-attachments/assets/9ef23878-dfee-44b4-895d-16a9f859ebc8">

 <img width="212" alt="indxts" src="https://github.com/user-attachments/assets/3ed887db-ce61-4fb1-aa26-637d27262943">

 <img width="821" alt="indxEdt" src="https://github.com/user-attachments/assets/232f27eb-6f9e-4a3d-a79b-dfbb011b9b4e">

 ## open new terminal

```
wget https://dist.ipfs.tech/go-ipfs/v0.19.1/go-ipfs_v0.19.1_linux-amd64.tar.gz
```

```
tar -xvzf go-ipfs_v0.19.1_linux-amd64.tar.gz
```
```
cd go-ipfs
sudo bash install.sh
ipfs init
```

```
ipfs daemon
```
## when you see Deamon Ready, go back to terminal

<img width="595" alt="readyD" src="https://github.com/user-attachments/assets/26746b80-f4e8-48a5-b98d-312c89a60ab4">

## Run the code to mint NFT
```
ts-node index.ts
```
<img width="557" alt="mntd" src="https://github.com/user-attachments/assets/bbf241a6-becf-45f1-8a27-0b1fa1e25cad">



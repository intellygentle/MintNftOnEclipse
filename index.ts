import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    TransactionBuilderSendAndConfirmOptions,
    createGenericFile,
    createGenericFileFromJson,
    createSignerFromKeypair,
    generateSigner,
    keypairIdentity,
} from '@metaplex-foundation/umi';
import {
    metadata,
    mint,
    niftyAsset,
    fetchAsset,
    Metadata,
    royalties,
    creators,
    Royalties,
    Creators,
} from '@nifty-oss/asset';
import { readFile } from "fs/promises";
import { uploadToIpfs } from './upload';
import fs from 'fs';

const CLUSTERS = {
    'mainnet': 'https://mainnetbeta-rpc.eclipse.xyz',
    'testnet': 'https://testnet.dev2.eclipsenetwork.xyz',
    'devnet': 'https://staging-rpc.dev2.eclipsenetwork.xyz',
    'localnet': 'http://127.0.0.1:8899',
};

const OPTIONS: TransactionBuilderSendAndConfirmOptions = {
    confirm: { commitment: 'processed' }
};

const NFT_DETAILS = {
    name: "Intell Eclipse Test",
    symbol: "IET",
    royalties: 500, // Basis Points (5%)
    description: 'Pixel infrastructure for everyone!',
    imgType: 'image/png',
    attributes: [
        { trait_type: 'Speed', value: 'Quick' },
    ]
};

const IPFS_API = 'http://127.0.0.1:5001/api/v0'; // 👈 Replace this with your IPFS API endpoint

const umi = createUmi(CLUSTERS.testnet, OPTIONS.confirm).use(niftyAsset()); // 👈 Replace .testnet or .mainnet

const wallet = '/home/xyz/cofig/blablabla'; // 👈 Replace this with your wallet path 
const secretKey = JSON.parse(fs.readFileSync(wallet, 'utf-8'));
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));

const creator = createSignerFromKeypair(umi, keypair);
const owner = creator; // Mint to the creator
const asset = generateSigner(umi);

async function uploadImage(path: string, contentType = 'image/png'): Promise<string> {
    try {
        const image = await readFile(path);
        const fileName = path.split('/').pop() ?? 'unknown.png';
        const genericImage = createGenericFile(image, fileName, { contentType });
        const cid = await uploadToIpfs(genericImage /*IPFS_API*/);
        console.log(`1. ✅ - Uploaded image to IPFS`);
        return cid;
    } catch (error) {
        console.error('1. ❌ - Error uploading image:', error);
        throw error;
    }
}

async function uploadMetadata(imageUri: string): Promise<string> {
    try {
        const metadata = {
            name: NFT_DETAILS.name,
            description: NFT_DETAILS.description,
            image: imageUri,
            attributes: NFT_DETAILS.attributes,
            properties: {
                files: [
                    {
                        type: NFT_DETAILS.imgType,
                        uri: imageUri,
                    },
                ]
            }
        };

        const file = createGenericFileFromJson(metadata, 'metadata.json');
        const cid = await uploadToIpfs(file /*IPFS_API*/);
        console.log(`2. ✅ - Uploaded metadata to IPFS`);
        return cid;
    } catch (error) {
        console.error('2. ❌ - Error uploading metadata:', error);
        throw error;
    }
}

async function mintAsset(metadataUri: string): Promise<void> {
    try {
        await mint(umi, {
            asset,
            owner: owner.publicKey,
            authority: creator.publicKey,
            payer: umi.identity,
            mutable: false,
            standard: 0,
            name: NFT_DETAILS.name,
            extensions: [
                metadata({
                    uri: metadataUri,
                    symbol: NFT_DETAILS.symbol,
                    description: NFT_DETAILS.description,
                }),
                royalties(NFT_DETAILS.royalties),
                creators([{ address: creator.publicKey, share: 100 }]),
            ]
        }).sendAndConfirm(umi, OPTIONS);
        const nftAddress = asset.publicKey.toString();
        console.log(`3. ✅ - Minted a new Asset: ${nftAddress}`);
    } catch (error) {
        console.error('3. ❌ - Error minting a new NFT.', error);
    }
}

async function verifyOnChainData(metadataUri: string): Promise<void> {
    try {
        const assetData = await fetchAsset(umi, asset.publicKey, OPTIONS.confirm);

        const onChainCreators = assetData.extensions.find(ext => ext.type === 3) as Creators;
        const onChainMetadata = assetData.extensions.find(ext => ext.type === 5) as Metadata;
        const onChainRoyalties = assetData.extensions.find(ext => ext.type === 7) as Royalties;

        const checks = [
            // Asset Checks
            { condition: assetData.owner.toString() === owner.publicKey.toString(), message: 'Owner matches' },
            { condition: assetData.publicKey.toString() === asset.publicKey.toString(), message: 'Public key matches' },
            { condition: assetData.name === NFT_DETAILS.name, message: 'Asset name matches' },

            // Creator Extension Checks
            { condition: !!onChainCreators, message: 'Creators extension not found' },
            { condition: onChainCreators.values.length === 1, message: 'Creators length matches' },
            { condition: onChainCreators.values[0].address.toString() === creator.publicKey.toString(), message: 'Creator address matches' },
            { condition: onChainCreators.values[0].share === 100, message: 'Creator share matches' },
            { condition: onChainCreators.values[0].verified === true, message: 'Creator not verified' },

            // Metadata Extension Checks
            { condition: !!onChainMetadata, message: 'Metadata extension not found' },
            { condition: onChainMetadata.symbol === NFT_DETAILS.symbol, message: 'Symbol matches' },
            { condition: onChainMetadata.description === NFT_DETAILS.description, message: 'Description matches' },
            { condition: onChainMetadata.uri === metadataUri, message: 'Metadata URI matches' },

            // Royalties Extension Checks
            { condition: !!onChainRoyalties, message: 'Royalties extension not found' },
            { condition: onChainRoyalties.basisPoints.toString() === NFT_DETAILS.royalties.toString(), message: 'Royalties basis points match' },
        ];

        checks.forEach(({ condition, message }) => {
            if (!condition) throw new Error(`Verification failed: ${message}`);
        });

        console.log(`4. ✅ - Verified Asset Data`);
    } catch (error) {
        console.error('4. ❌ - Error verifying Asset Data:', error);
    }
}

async function main() {
    const imageCid = await uploadImage('/workspaces/codespaces-blank/EclipseInteract/eclipse-nft/pixel.png'); // 👈 Replace this with the path to your image
    const metadataCid = await uploadMetadata(imageCid); 
    await mintAsset(metadataCid);
    await verifyOnChainData(metadataCid);
}

main();

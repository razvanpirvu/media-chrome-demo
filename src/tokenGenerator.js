// const {ClientSecretCredential, AzureCliCredential} = require ("@azure/identity");
// const {SecretClient} = require("@azure/keyvault-secrets");


// const credentials = {
//     tenantID: "72f988bf-86f1-41af-91ab-2d7cd011db47",
//     aadClientId: "2cf1bfe1-59d8-4be7-b86e-7263af600928",
// }


// async function main() {
//     console.log("hello there")
//     const spSecret = await initPortalContext();
//     const credential = new ClientSecretCredential(credentials.tenantID, credentials.aadClientId, spSecret);
// }

// async function initPortalContext() {
//     const credential = new AzureCliCredential();
//     const keyVaultUrl = `https://amsuxintegrationtesting.vault.azure.net/`;
//     const client = new SecretClient(keyVaultUrl, credential);
//     const localSpSecret = (await client.getSecret("spsecret")).value;
//     return localSpSecret;
// }

// module.exports = {
//     main
// }
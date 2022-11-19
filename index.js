const express = require("express");
const crypto = require("node:crypto");

const app = express();
const port = 3000;

const { ClientSecretCredential } = require("@azure/identity");

const { AzureMediaServices } = require("@azure/arm-mediaservices");

async function getContentKeyPoliciesWithSecrets() {
  const credentials = {
    tenantID: "---enter-value-here---",
    aadClientId: "---enter-value-here---",
    subscriptionId: "---enter-value-here---",
    resourceGroup: "---enter-value-here---",
    accountName: "---enter-value-here---",
    clientSecret: "---enter-value-here---",
  };

  const secretCredential = new ClientSecretCredential(
    credentials.tenantID,
    credentials.aadClientId,
    credentials.clientSecret
  );
  const mediaServicesClient = new AzureMediaServices(
    secretCredential,
    credentials.subscriptionId
  );
  let policyResult;
  try {
    policyResult =
      await mediaServicesClient.contentKeyPolicies.getPolicyPropertiesWithSecrets(
        credentials.resourceGroup,
        credentials.accountName,
        "testpolicymulti2"
      );
  } catch (ex) {
    throw new Error(ex);
  }
  return policyResult;
}

function isClientTokenEnabled() {
  // feature flag from portal, just return true by default
  return true;
}

async function getPlayPlayerProtectionInfo() {
  let playerProtection = [];
  const policyResult = await getContentKeyPoliciesWithSecrets();
  const contentKeyPolicy = policyResult;
  const tokenPromiseList = [];

  contentKeyPolicy.options.map((contentKeyPolicyOption) => {
    console.log(contentKeyPolicyOption);
    if (
      contentKeyPolicyOption.restriction &&
      contentKeyPolicyOption.restriction.odataType ===
        "#Microsoft.Media.ContentKeyPolicyTokenRestriction"
    ) {
      const contentKeyPolicyRestriction = contentKeyPolicyOption.restriction;
      const tokenClaims = [];
      contentKeyPolicyRestriction.requiredClaims.map((requiredClaim) => {
        const tokenClaim = {
          type: requiredClaim.claimType,
          value: requiredClaim.claimValue,
        };
        tokenClaims.push(tokenClaim);
      });

      const tokenRestrictionData = {
        type: contentKeyPolicyRestriction.restrictionTokenType.toUpperCase(),
        issuer: contentKeyPolicyRestriction.issuer,
        scope: contentKeyPolicyRestriction.audience,
        secondaryVerificationKey:
          contentKeyPolicyRestriction.alternateVerificationKeys,
        primaryVerificationKey:
          contentKeyPolicyRestriction.primaryVerificationKey.keyValue,
        claims: tokenClaims,
        expirationInMin: 10,
      };
      if (!!tokenRestrictionData) {
        const token = isClientTokenEnabled()
          ? generateToken(tokenRestrictionData)
          : issueToken(tokenRestrictionData, "");
        const configurationType =
          contentKeyPolicyOption.configuration.odataType;

        playerProtection.push({
          authenticationToken: token,
          type: getPlayerProtectionType(configurationType),
        });
      }
    }
  });
  return playerProtection;
}

function generateToken(tokenRestrictionData) {
  if (tokenRestrictionData.type === "JWT") {
    return generateJwtToken(tokenRestrictionData);
  } else {
    return generateSwtToken(tokenRestrictionData);
  }
}

function generateJwtToken(tokenRestrictionData) {
  const headerObj = {
    typ: "JWT",
    alg: "HS256",
  };
  const claims = {};
  tokenRestrictionData.claims.forEach((claim) => {
    claims[claim.type] = claim.value;
  });
  let payloadObj = {
    ...claims,
    iss: tokenRestrictionData.issuer,
    aud: tokenRestrictionData.scope,
    exp: Math.floor(
      (Date.now() + tokenRestrictionData.expirationInMin * 60 * 1000) / 1000
    ),
    nbf: Math.floor((Date.now() - 60 * 1000) / 1000),
  };
  const headerPart = stringToBase64Url(JSON.stringify(headerObj));
  const payloadPart = stringToBase64Url(JSON.stringify(payloadObj));

  const signaturePart = getHmacSha256({
    key: tokenRestrictionData.primaryVerificationKey,
    stringToHash: `${headerPart}.${payloadPart}`,
  });
  const bearer = `Bearer ${headerPart}.${payloadPart}.${convertBase64ToBase64Url(
    signaturePart
  )}`;
  return bearer;
}

function stringToBase64Url(str) {
  const strb64 = btoa(str);
  return convertBase64ToBase64Url(strb64);
}

function convertBase64ToBase64Url(str) {
  return _trimEnd(str, "=").replace(/\+/g, "-").replace(/\//g, "_");
}

function _trimEnd(str, ch) {
  let len = str.length;
  while (len - 1 >= 0 && str[len - 1] === ch) {
    --len;
  }
  return str.substr(0, len);
}

function getHmacSha256(obj) {
  const b64 = Buffer.from(obj.key).toString("base64");
  const hash = crypto
    .createHmac("SHA256", b64)
    .update(obj.stringToHash, "utf8")
    .digest("base64");
  return hash;
}

function issueToken(tokenRestrictionData, str) {}

function getPlayerProtectionType(configurationType) {
  switch (configurationType) {
    case "#Microsoft.Media.ContentKeyPolicyClearKeyConfiguration":
      return 2;
    case "#Microsoft.Media.ContentKeyPolicyPlayReadyConfiguration":
      return 0;
    case "#Microsoft.Media.ContentKeyPolicyWidevineConfiguration":
      return 1;
    case "#Microsoft.Media.ContentKeyPolicyFairPlayConfiguration":
      return 3;
    default:
      return -1;
  }
}

app.get("/", async (req, res) => {
  const playerProtection = await getPlayPlayerProtectionInfo();

  res.json({ message: playerProtection });
});

app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
});

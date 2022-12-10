import {
  Bridge
} from "@chainsafe/chainbridge-contracts";
import {BigNumber, providers, utils} from "ethers";
import { useEffect, useState } from "react";
import {BridgeConfig } from "../../../chainbridgeConfig";
import {Erc20DetailedFactory} from "../../../Contracts/Erc20DetailedFactory";

export function useSetBridgeSettingsHook(
    homeBridge?: Bridge,
    homeChainConfig?:BridgeConfig,
    destinationDomainId?: number,
    selectedToken?: string,
    depositAmount?: number,
    provider?: providers.Web3Provider
) {
  const [bridgeFee, setBridgeFee] = useState<number | undefined>();
  const [bridgeFeeToken, setBridgeFeeToken] = useState<string | undefined>();
  const [relayerThreshold, setRelayerThreshold] = useState<number | undefined>();

  useEffect(() => {
    const getRelayerThreshold = async () => {
      if (homeBridge) {
        const threshold = BigNumber.from(
          await homeBridge._relayerThreshold()
        ).toNumber();
        setRelayerThreshold(threshold);
      }
    };
    getRelayerThreshold();
  }, [homeBridge]);

  useEffect(() => {
    const getBridgeFee = async () => {

      if (homeBridge && selectedToken &&selectedToken !== "" && homeChainConfig && provider && depositAmount) {
        const token = homeChainConfig.tokens.find(
            (token) => token.address === selectedToken
        );
        if (!token) {
          console.log("Token not found");
          return;
        }
        const signer = provider.getSigner();
        const recipient = await signer.getAddress();
        const erc20 = Erc20DetailedFactory.connect(token.address, signer);
        const isNative = token.address == "0x0000000000000000000000000000000000000000";
        const erc20Decimals = token.decimals || (isNative? 18: await erc20.decimals());

        const data =
            "0x" +
            utils
                .hexZeroPad(
                    BigNumber.from(
                        utils.parseUnits(depositAmount.toString(), erc20Decimals)
                    ).toHexString(),
                    32
                )
                .substr(2) + // Deposit Amount (32 bytes)
            utils
                .hexZeroPad(utils.hexlify((recipient.length - 2) / 2), 32)
                .substr(2) + // len(recipientAddress) (32 bytes)
            recipient.substr(2); // recipientAddress (?? bytes)

        try{
          const {feeToken, fee} = await homeBridge.calculateFee(
              BigNumber.from(destinationDomainId),
              token.resourceId,
              data
          );
          const feeTokenInfos = homeChainConfig.tokens.find(
              (token) => token.address === feeToken
          );
          let decimals;
          if (feeToken == "0x0000000000000000000000000000000000000000") {
            decimals = 18;
          } else {
            if (!feeTokenInfos || !feeTokenInfos.decimals) {
              const feeTokenErc20 = Erc20DetailedFactory.connect(feeToken, signer);
              decimals = await feeTokenErc20.decimals();
              if (feeTokenInfos) {
                feeTokenInfos.decimals = decimals;
              }
            } else {
              decimals = feeTokenInfos.decimals;
            }
          }
          const bridgeFee = Number(utils.formatUnits(fee, decimals));
          setBridgeFee(bridgeFee);
          setBridgeFeeToken(feeToken);
        } catch (e) {
          setBridgeFee(undefined);
          setBridgeFeeToken(undefined);
          return
        }

        // const bridgeFee = Number(utils.formatEther(await homeBridge._fee()));
      }
    };
    getBridgeFee();
  }, [selectedToken, depositAmount])

  return {
    bridgeFee,
    bridgeFeeToken,
    relayerThreshold
  };
}

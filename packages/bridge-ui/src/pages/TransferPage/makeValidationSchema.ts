import * as yup from "yup";
import { utils } from "ethers";

import { isValidSubstrateAddress } from "../../utils/Helpers";
import { BridgeConfig } from "../../chainbridgeConfig";
import { PreflightDetails } from "./TransferPage";

type MakeValidationSchemaOptions = {
  homeConfig: BridgeConfig | undefined;
  tokens: any;
  destinationChainConfig: any;
  preflightDetails: PreflightDetails;
  bridgeFee: any;
  bridgeFeeToken: any;
  checkSupplies: any;
};
export default function makeValidationSchema({
  preflightDetails,
  tokens,
  bridgeFee,
  bridgeFeeToken,
  homeConfig,
  destinationChainConfig,
  checkSupplies,
}: MakeValidationSchemaOptions) {
  const selectedToken = homeConfig?.tokens.find(
    (token) => token.address === preflightDetails.token
  );
  const DECIMALS =
    selectedToken && selectedToken.decimals ? selectedToken.decimals : 18;

  const REGEX = new RegExp(`^[0-9]{1,18}(\\.?[0-9]{0,${DECIMALS}})?$`);
  return yup.object().shape({
    tokenAmount: yup
      .string()
      .test("Token selected", "Please select a token", (value) => {
        return (
            !!value &&
            preflightDetails &&
            tokens[preflightDetails.token] &&
            tokens[preflightDetails.token].balance !== undefined
        )
      })
      .test("InputValid", "Input invalid", (value) => {
        try {
          return REGEX.test(`${value}`);
        } catch (error) {
          console.error(error);
          return false;
        }
      })
      .test("Max", "Insufficent funds", (value) => {
        if (
          value &&
          preflightDetails &&
          tokens[preflightDetails.token] &&
          tokens[preflightDetails.token].balance
        ) {
          if (homeConfig?.type === "Ethereum") {
            return parseFloat(value) <= tokens[preflightDetails.token].balance;
          } else {
            const ethFee = bridgeFeeToken ? bridgeFeeToken == "0x0000000000000000000000000000000000000000"? bridgeFee: 0 : 0;
            return (
              parseFloat(value + (ethFee)) <=
              tokens[preflightDetails.token].balance
            );
          }
        }
        return false;
      })
      .test("Fee", "Invalid for Fee", (value) => {
        if (
            value &&
            preflightDetails &&
            tokens[preflightDetails.token] &&
            tokens[preflightDetails.token].balance
        ) {
          return bridgeFeeToken && typeof bridgeFee !== "undefined"
        }
        return false;
      })
      .test(
        "Bridge Supplies",
        "Not enough tokens on the destination chain. Please contact support.",
        async (value) => {
          if (checkSupplies && destinationChainConfig && value) {
            const supplies = await checkSupplies(
              parseFloat(value),
              preflightDetails.token,
              destinationChainConfig.domainId
            );
            return Boolean(supplies);
          }
          return false;
        }
      )
      .test("Min", "Less than minimum", (value) => {
        if (value) {
          return parseFloat(value) > 0;
        }
        return false;
      })
      .required("Please set a value"),
    token: yup.string().required("Please select a token"),
    receiver: yup
      .string()
      .test("Valid address", "Please add a valid address", (value) => {
        if (destinationChainConfig?.type === "Substrate") {
          return isValidSubstrateAddress(value as string);
        }
        return utils.isAddress(value as string);
      })
      .required("Please add a receiving address"),
  });
}

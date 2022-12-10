import { Erc20DetailedFactory } from "../Contracts/Erc20DetailedFactory";
import { BigNumber as BN } from "bignumber.js";
import { BigNumber, ethers, utils, providers } from "ethers";
import {
  Actions,
  LocalWeb3State,
  TokenInfo,
} from "../contexts/localWeb3Context";
import { API as OnboardAPI } from "bnc-onboard/dist/src/interfaces";
import { Erc20Detailed } from "../Contracts/Erc20Detailed";

export const refreshGasPrice = async (
  dispatcher: (action: Actions) => void,
  ethGasStationApiKey: string,
  gasPriceSetting: any
) => {
  try {
    let gasPrice;
    if (ethGasStationApiKey) {
      const ethGasStationResponse = await (
        await fetch(
          `https://ethgasstation.info/api/ethgasAPI.json?api-key=${ethGasStationApiKey}`
        )
      ).json();
      gasPrice = ethGasStationResponse[gasPriceSetting] / 10;
    } else {
      const etherchainResponse = await (
        await fetch("https://www.etherchain.org/api/gasPriceOracle")
      ).json();
      gasPrice = Number(etherchainResponse[gasPriceSetting]);
    }

    const newGasPrice = !isNaN(Number(gasPrice)) ? Number(gasPrice) : 65;
    //@ts-ignore
    dispatcher({ type: "setGasPrice", payload: newGasPrice });
  } catch (error) {
    console.log(error);
    console.log("Using 65 gwei as default");
    //@ts-ignore
    dispatcher({ type: "setGasPrice", payload: 65 });
  }
};

export const checkIsReady = async (
  onboard: OnboardAPI,
  dispatcher: (action: Actions) => void
) => {
  const isReady = await onboard?.walletCheck();
  dispatcher({
    type: "setIsReady",
    payload: !!isReady,
  });
  if (!isReady) {
    dispatcher({
      type: "setBalance",
      payload: 0,
    });
  }
  return !!isReady;
};

export const resetOnboard = (
  dispatcher: (action: Actions) => void,
  onboard: OnboardAPI
) => {
  localStorage.setItem("onboard.selectedWallet", "");
  dispatcher({
    type: "setIsReady",
    payload: false,
  });
  onboard?.walletReset();
};

export const checkBalanceAndAllowance = async (
  token: Erc20Detailed,
  dispatcher: (action: Actions) => void,
  address: string,
  spenderAddress: string | undefined
) => {
  if (address) {
    const isNative = token.address == "0x0000000000000000000000000000000000000000";
    let decimals: number;
    let bal: BigNumber;
    if (isNative){
      decimals = 18;
      bal = await token.provider.getBalance(address);
    } else {
      decimals = await token.decimals()
      bal = await token.balanceOf(address);
    }
    const balanceBN = new BN(bal.toString()).shiftedBy(-decimals);
    const balance = Number(balanceBN.toPrecision(15, BN.ROUND_DOWN));
    let spenderAllowance = 0;
    if (spenderAddress && !isNative) {
      spenderAllowance = Number(
        utils.formatUnits(
          BigNumber.from(await token.balanceOf(address)),
          decimals
        )
      );
    }

    dispatcher({
      type: "updateTokenBalanceAllowance",
      payload: {
        id: token.address,
        spenderAllowance: spenderAllowance,
        balance: balance,
        balanceBN,
      },
    });
  }
};

export const getTokenData = async (
  networkTokens: any,
  dispatcher: (action: Actions) => void,
  state: LocalWeb3State,
  spenderAddress: string | undefined
) => {
  let eventFilters = []

  for (const token of networkTokens) {
    const signer = await state.provider.getSigner();
    const tokenContract = Erc20DetailedFactory.connect(token.address, signer);

    const newTokenInfo: TokenInfo = {
      decimals: 0,
      balance: 0,
      balanceBN: new BN(0),
      imageUri: token.imageUri,
      name: token.name,
      symbol: token.symbol,
      spenderAllowance: 0,
      allowance: tokenContract.allowance,
      approve: tokenContract.approve,
      transfer: tokenContract.transfer,
    };

    const isNative = token.address == "0x0000000000000000000000000000000000000000";

    if (!token.name) {
      if (!isNative) {
        try {
          newTokenInfo.name = await tokenContract.name();
        } catch (error) {
          console.log(
              "There was an error getting the token name. Does this contract implement ERC20Detailed?"
          );
        }
      } else {
        newTokenInfo.name = "Native coin";
      }
    }
    if (!token.symbol) {
      if (!isNative) {
        try {
          newTokenInfo.symbol = await tokenContract.symbol();
        } catch (error) {
          console.error(
              "There was an error getting the token symbol. Does this contract implement ERC20Detailed?"
          );
        }
      } else {
        newTokenInfo.symbol = "Coin"
      }
    }

    if (!token.symbol && !isNative) {
      try {
        newTokenInfo.decimals = await tokenContract.decimals();
      } catch (error) {
        console.error(
            "There was an error getting the token decimals. Does this contract implement ERC20Detailed?"
        );
      }
    } else {
      newTokenInfo.decimals = 18;
    }

    dispatcher({
      type: "addToken",
      payload: { id: token.address, token: newTokenInfo },
    });

    checkBalanceAndAllowance(
      tokenContract,
      dispatcher,
      state.address,
      spenderAddress
    );

    eventFilters.push(
      tokenContract.filters.Approval(
        state.address,
        null,
        null
      ).topics![0],
      tokenContract.filters.Transfer(
        state.address,
        null,
        null
      ).topics![0],
      tokenContract.filters.Transfer(
        null,
        state.address,
        null
      ).topics![0]
    );
  }

  state.provider.on({
    topics: eventFilters
  }, (filterEvent) => {
    const tokenContract = networkTokens.find((token: { address: any; }) => token.address == filterEvent.address)
    if(typeof tokenContract === 'undefined' ){
      return
    }
    checkBalanceAndAllowance(
        tokenContract,
        dispatcher,
        state.address,
        spenderAddress
    )
  })
};

export const signMessage = async (
  message: string,
  provider: providers.Web3Provider
) => {
  if (!provider) return Promise.reject("The provider is not yet initialized");

  const data = ethers.utils.toUtf8Bytes(message);
  const signer = await provider.getSigner();
  const addr = await signer.getAddress();
  return await provider.send("personal_sign", [
    ethers.utils.hexlify(data),
    addr.toLowerCase(),
  ]);
};

import { SUPPORT_LOCKS } from "config/constants/supportChains";
import { useRouter } from 'next/router'
import { TokenLocksOverview } from '../../../views/Locks'

const TokenLocksOverviewPage = () => {
  const { tokenAddress } = useRouter().query
  if (!tokenAddress) return null
  return <TokenLocksOverview tokenAddress={String(tokenAddress)} />
}

TokenLocksOverviewPage.chains = SUPPORT_LOCKS

export default TokenLocksOverviewPage

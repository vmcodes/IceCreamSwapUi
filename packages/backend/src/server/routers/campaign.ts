import { z } from 'zod'
import { isKyc } from '../session'
import { publicProcedure, router } from '../trpc'
import { prisma } from '../prisma'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getChain } from '@icecreamswap/constants/src/chains'
import { Contract, providers } from 'ethers'
import campaignFactoryAbi from '@passive-income/launchpad-contracts/abi/contracts/PSIPadCampaignFactory.sol/PSIPadCampaignFactory.json'

export const campaignRouter = router({
  add: publicProcedure
    .input(
      z.object({
        address: z.string().length(42),
        chainId: z.number(),
        website: z.string().url(),
        banner: z.string().optional(),
        twitter: z.string().optional(),
        telegram: z.string().optional(),
        discord: z.string().optional(),
        github: z.string().optional(),
        reddit: z.string().optional(),
        description: z.string().min(50),
        tags: z.string().array(),
        deleted: z.boolean(),
        startDate: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        throw new Error('MissingLogin')
      } else if (!isKyc(ctx.session.user)) {
        throw new Error('MissingKYC')
      }

      const campaign = await prisma.campaign.findFirst({
        where: {
          address: {
            equals: input.address.toLowerCase(),
            mode: 'insensitive',
          },
          chainId: input.chainId,
        },
      })

      if (campaign) {
        throw new Error('CampaignExists')
      }

      const chain = getChain(input.chainId)

      if (!chain) {
        throw new Error('MissingChainId')
      }

      if (chain.campaignFactory) {
        const provider = new providers.JsonRpcProvider(chain.rpcUrls.default)

        const contract = new Contract(chain.campaignFactory, campaignFactoryAbi, provider)

        const userCampaigns = await contract.getUserCampaigns(ctx.session.user.wallet)

        const campaigns = [...userCampaigns]

        campaigns.reverse()

        let match = false

        for (const x of campaigns) {
          // eslint-disable-next-line no-await-in-loop
          const current = await contract.campaigns(Number(x))

          if (current === input.address) {
            match = true
            break
          }
        }

        if (!match) {
          throw new Error('MissingUserContract')
        }
      }

      try {
        if (input.banner) {
          // const s3Client = new S3Client({})
          // const binary = Buffer.from(input.banner, 'base64')
          // await s3Client.send(
          //   new PutObjectCommand({
          //     Bucket: process.env.S3_BUCKET_NAME,
          //     Key: `token/${input.chainId}/${address}.png`,
          //     Body: binary,
          //     ContentType: 'image/png',
          //     GrantRead: 'uri=http://acs.amazonaws.com/groups/global/AllUsers',
          //   }),
          // )
        }

        await prisma.campaign.create({
          data: {
            address: input.address,
            chainId: input.chainId,
            website: input.website,
            banner: input.banner,
            twitter: input.twitter,
            telegram: input.telegram,
            discord: input.discord,
            github: input.github,
            reddit: input.reddit,
            description: input.description,
            tags: input.tags,
            deleted: input.deleted,
            startDate: input.startDate,
          },
        })
      } catch {
        throw new Error('Unable to create campaign')
      }
    }),
})

import type { BlockTag, Chain } from 'viem'
import {
  type GetBlockParameters as viem_GetBlockParameters,
  type GetBlockReturnType as viem_GetBlockReturnType,
  getBlock as viem_getBlock,
} from 'viem/actions'

import { type Config } from '../createConfig.js'
import type { SelectChains } from '../types/chain.js'
import type { ChainIdParameter } from '../types/properties.js'
import type { Evaluate } from '../types/utils.js'

export type GetBlockParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends
    | config['chains'][number]['id'] = config['chains'][number]['id'],
> = Evaluate<
  viem_GetBlockParameters<includeTransactions, blockTag> &
    ChainIdParameter<config, chainId>
>

export type GetBlockReturnType<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  ///
  chains extends readonly Chain[] = SelectChains<config, chainId>,
> = Evaluate<
  {
    [key in keyof chains]: viem_GetBlockReturnType<
      chains[key],
      includeTransactions,
      blockTag
    >
  }[number]
>

export type GetBlockError = Error

/** https://alpha.wagmi.sh/core/actions/getBlock */
export function getBlock<
  config extends Config,
  chainId extends config['chains'][number]['id'],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
>(
  config: config,
  parameters: GetBlockParameters<
    includeTransactions,
    blockTag,
    config,
    chainId
  > = {},
): Promise<GetBlockReturnType<includeTransactions, blockTag, config, chainId>> {
  const { chainId } = parameters
  const client = config.getClient({ chainId })
  return viem_getBlock(client, parameters) as {} as Promise<
    GetBlockReturnType<includeTransactions, blockTag, config, chainId>
  >
}

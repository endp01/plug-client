export const DEFAULT_ADDRESS = '0x62180042606624f02D8A130dA8A3171e9b33894d' as const
export const DEFAULT_AUTH = '0x0000000000000000000000000000000000000000000000000000000000000000' as const
export const DEFAULT_DOMAIN = {
    name: 'test contract',
    version: '1',
    chainId: 1,
    verifyingContract: DEFAULT_ADDRESS
} as const
export const DEFAULT_PERMISSION = {
    domain: DEFAULT_DOMAIN,
    message: {
        permission: {
            delegate: DEFAULT_ADDRESS,
            authority: DEFAULT_AUTH,
            caveats: [],
            salt: DEFAULT_AUTH
        },
        signature: '0x0'
    }
} as const

export const DEFAULT_TRANSACTION = {
    to: DEFAULT_ADDRESS,
    gasLimit: 21000n,
    data: '0x0'
} as const

export const DEFAULT_REPLAY_PROTECTION = {
    nonce: 0n,
    queue: 0n
} as const

export const DEFAULT_INTENT = {
    transaction: DEFAULT_TRANSACTION,
    authority: [DEFAULT_PERMISSION.message]
} as const

export const DEFAULT_INTENTS = {
    domain: DEFAULT_DOMAIN,
    message: {
        batch: [DEFAULT_INTENT],
        replayProtection: DEFAULT_REPLAY_PROTECTION
    }
} as const

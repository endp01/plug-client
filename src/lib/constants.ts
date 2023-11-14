export const DEFAULT_ADDRESS =
  "0x62180042606624f02D8A130dA8A3171e9b33894d" as const;
export const DEFAULT_AUTH =
  "0x0000000000000000000000000000000000000000000000000000000000000000" as const;
export const DEFAULT_DOMAIN = {
  name: "test contract",
  version: "1",
  chainId: 1,
  verifyingContract: DEFAULT_ADDRESS,
} as const;
export const DEFAULT_PIN = {
  domain: DEFAULT_DOMAIN,
  message: {
    pin: {
      neutral: DEFAULT_ADDRESS,
      live: DEFAULT_AUTH,
      fuses: [],
      salt: DEFAULT_AUTH,
    },
    signature: "0x0",
  },
} as const;

export const DEFAULT_CURRENT = {
  ground: DEFAULT_ADDRESS,
  voltage: 21000n,
  data: "0x0",
} as const;

export const DEFAULT_REPLAY_PROTECTION = {
  nonce: 0n,
  queue: 0n,
} as const;

export const DEFAULT_PLUG = {
  current: DEFAULT_CURRENT,
  pins: [DEFAULT_PIN.message],
} as const;

export const DEFAULT_PLUGS = {
  domain: DEFAULT_DOMAIN,
  message: {
    plugs: [DEFAULT_PLUG],
    breaker: DEFAULT_REPLAY_PROTECTION,
  },
} as const;

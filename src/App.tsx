import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    createTRPCProxyClient,
    createWSClient,
    httpBatchLink,
    splitLink,
    wsLink
} from '@trpc/client'

import { AppRouter } from '../../server/api'
import { useState } from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useSignTypedData } from 'wagmi'
import { constants } from '@nftchance/emporium-types'

const wsClient = createWSClient({
    url: 'ws://localhost:3000/trpc'
})
const client = createTRPCProxyClient<AppRouter>({
    links: [
        splitLink({
            condition: op => {
                return op.type === 'subscription'
            },
            true: wsLink({
                client: wsClient
            }),
            false: httpBatchLink({
                url: 'http://localhost:3000/trpc'
            })
        })
    ]
})

const DEFAULT_ADDRESS = '0x62180042606624f02D8A130dA8A3171e9b33894d'
const BASE_AUTH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const DEFAULT_PERMISSION = {
    domain: {
        name: 'test contract',
        version: '1',
        chainId: 1,
        verifyingContract: DEFAULT_ADDRESS
    },
    message: {
        permission: {
            delegate: DEFAULT_ADDRESS,
            authority: BASE_AUTH,
            caveats: [],
            salt: BASE_AUTH
        },
        signature: '0x0'
    }
} as const

function App() {
    const { open } = useWeb3Modal()
    const { address } = useAccount()

    const [query, setQuery] = useState(JSON.stringify(DEFAULT_PERMISSION, null, 4));

    const { data, isError, isLoading, isSuccess, signTypedData } = useSignTypedData({
        domain: DEFAULT_PERMISSION.domain,
        message: DEFAULT_PERMISSION.message.permission,
        primaryType: 'Permission',
        types: constants.types
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        e.stopPropagation()

        const json = JSON.parse(query)
        await client.permissions.create.mutate(json)
    }

    return (
        <>
            <Button onClick={() => open({ view: 'Networks' })}>Networks</Button>
            <Button onClick={() => open()}>Connect</Button>

            <p>Connected Address: {address ? address : 'Not Connected'}</p>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                <label htmlFor="name">
                    Permission
                    <Textarea
                        name="permission"
                        value={query}
                        className="h-[50vh]"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>

                <Button type="button" onClick={() => signTypedData()}
                    disabled={isLoading || !address || !query}
                >{isLoading ? 'Signing...' : 'Sign'}</Button>

                <Button type="submit"
                    disabled={!isSuccess}
                >Submit</Button>

                {isSuccess && <p>Signature: {data}</p>}
                {isError && <p>Error signing message.</p>}
            </form>
        </>
    )
}

export default App

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { constants } from '@nftchance/emporium-types'
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useSignTypedData } from "wagmi"

import { getConnector } from "../../../server/src/connector"
import { DEFAULT_INTENTS } from "@/lib/constants"

export default function Intents<
    P extends {
        connector: ReturnType<typeof getConnector>
    }
>({ connector }: P) {
    const { open } = useWeb3Modal()
    const { address } = useAccount()

    const [query, setQuery] = useState(JSON.stringify(DEFAULT_INTENTS, null, 4));

    const { data, isError, isLoading, isSuccess, reset, signTypedData } = useSignTypedData({
        domain: DEFAULT_INTENTS.domain,
        message: DEFAULT_INTENTS.message,
        primaryType: 'Intents',
        types: constants.types,
        onSuccess: (signature) => {
            const stateQuery = JSON.parse(query)
            stateQuery.message.signature = signature
            setQuery(JSON.stringify(stateQuery, null, 4))
        }
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        e.stopPropagation()

        // TODO: Handle the creation.
        connector

        reset()
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

                <Button type="button" onClick={() => signTypedData({})}
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

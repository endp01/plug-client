import { constants } from '@nftchance/emporium-types'

import { useEffect, useState } from 'react'
import { useAccount, useSignTypedData } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DEFAULT_PERMISSION } from '@/lib/constants'
import { createTRPCProxyClient } from '@trpc/client'
import { useWeb3Modal } from '@web3modal/wagmi/react'

import { AppRouter } from '../../../server/src/server/api'

export default function Permission<
	P extends {
		client: ReturnType<typeof createTRPCProxyClient<AppRouter>>
	}
>({ client }: P) {
	const { open } = useWeb3Modal()
	const { address } = useAccount()

	const [query, setQuery] = useState(
		JSON.stringify(DEFAULT_PERMISSION, null, 4)
	)

	const { data, isError, isLoading, isSuccess, reset, signTypedData } =
		useSignTypedData({
			domain: DEFAULT_PERMISSION.domain,
			message: DEFAULT_PERMISSION.message.permission,
			primaryType: 'Permission',
			types: constants.types,
			onSuccess: signature => {
				const stateQuery = JSON.parse(query)
				stateQuery.message.signature = signature
				setQuery(JSON.stringify(stateQuery, null, 4))
			}
		})

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		e.stopPropagation()

		const json = JSON.parse(query)
		await client.permissions.create.mutate(json)

		reset()
	}

	useEffect(() => {
		// * Open the onCreate susbcription.
		client.permissions.onCreate.subscribe(undefined, {
			onData: permission => {
				console.log('Permission created:', permission)
			}
		})
	}, [client])

	return (
		<>
			<Button onClick={() => open({ view: 'Networks' })}>Networks</Button>
			<Button onClick={() => open()}>Connect</Button>

			<p>Connected Address: {address ? address : 'Not Connected'}</p>

			<form onSubmit={handleSubmit} className="space-y-8">
				<label htmlFor="name">
					Permission
					<Textarea
						name="permission"
						value={query}
						className="h-[50vh]"
						onChange={e => setQuery(e.target.value)}
					/>
				</label>

				<Button
					type="button"
					onClick={() => signTypedData({})}
					disabled={isLoading || !address || !query}
				>
					{isLoading ? 'Signing...' : 'Sign'}
				</Button>

				<Button type="submit" disabled={!isSuccess}>
					Submit
				</Button>

				{isSuccess && <p>Signature: {data}</p>}
				{isError && <p>Error signing message.</p>}
			</form>
		</>
	)
}

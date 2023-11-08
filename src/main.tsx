import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { WagmiConfig } from 'wagmi'

import {
	createTRPCProxyClient,
	createWSClient,
	httpBatchLink,
	splitLink,
	wsLink
} from '@trpc/client'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { AppRouter } from '../../server/src/api'
import App from './App.tsx'
import './index.css'
import Intents from './pages/Intents.tsx'
import Permission from './pages/Permission.tsx'
import ReactDOM from 'react-dom/client'
import { mainnet } from 'wagmi/chains'

const projectId = '91222ec4c7d553d05264028fb3276d8c'

const metadata = {
	name: 'Emporium',
	description: 'Emporium',
	url: 'https://emporium.app'
}

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

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

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/permission', element: <Permission client={client} /> },
	{ path: '/intents', element: <Intents client={client} /> }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WagmiConfig config={wagmiConfig}>
			<RouterProvider router={router} />
		</WagmiConfig>
	</React.StrictMode>
)

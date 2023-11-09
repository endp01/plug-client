import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { getConnector } from '../../server/src/connector'

import App from './App.tsx'
import Intents from './pages/Intents.tsx'
import Permission from './pages/Permission.tsx'

import './index.css'

const projectId = '91222ec4c7d553d05264028fb3276d8c'

const metadata = {
	name: 'Emporium',
	description: 'Emporium',
	url: 'https://emporium.app'
}

const chains = [mainnet]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

const connector = getConnector('localhost:3000/trpc')

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/permission', element: <Permission connector={connector} /> },
	{ path: '/intents', element: <Intents connector={connector} /> }
])

createWeb3Modal({ wagmiConfig, projectId, chains })

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WagmiConfig config={wagmiConfig}>
			<RouterProvider router={router} />
		</WagmiConfig>
	</React.StrictMode>
)

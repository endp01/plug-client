import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { WagmiConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { connector } from '../../server/src/server/connector.ts'

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


const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/permission', element: <Permission client={connector} /> },
	{ path: '/intents', element: <Intents client={connector} /> }
])

createWeb3Modal({ wagmiConfig, projectId, chains })

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WagmiConfig config={wagmiConfig}>
			<RouterProvider router={router} />
		</WagmiConfig>
	</React.StrictMode>
)

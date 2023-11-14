import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { WagmiConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { getConnector } from "../../server/src/connector";

import { Wrapper } from "./components/wrapper";

import App from "./App";
import Plugs from "./pages/Plugs";
import Pin from "./pages/Pin";

import "./utils";
import "./index.css";

const connector = getConnector();

const projectId = "91222ec4c7d553d05264028fb3276d8c";

const metadata = {
  name: "Plug",
  description: "Plug",
  url: "https://plug.app",
};

const chains = [mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/pin", element: <Pin connector={connector} /> },
  { path: "/plugs", element: <Plugs connector={connector} /> },
]);

createWeb3Modal({ wagmiConfig, projectId, chains });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <Wrapper />

      <RouterProvider router={router} />
    </WagmiConfig>
  </React.StrictMode>
);

import { constants } from "@nftchance/plug-types";

import { useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PLUGS } from "@/lib/constants";

import { getConnector } from "../../../server/src/connector";

export default function Plugs<
  P extends {
    connector: ReturnType<typeof getConnector>;
  }
>({ connector }: P) {
  const { address } = useAccount();

  const [query, setQuery] = useState(JSON.stringify(DEFAULT_PLUGS, null, 4));

  const { data, isError, isLoading, isSuccess, reset, signTypedData } =
    useSignTypedData({
      domain: DEFAULT_PLUGS.domain,
      message: DEFAULT_PLUGS.message,
      primaryType: "Plugs",
      types: constants.types,
      onSuccess: (signature) => {
        const stateQuery = JSON.parse(query);
        stateQuery.message.signature = signature;
        setQuery(JSON.stringify(stateQuery, null, 4));
      },
    });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    const json = JSON.parse(query);
    await connector.plugs.create.mutate(json);

    reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <label htmlFor="name">
          Pin
          <Textarea
            name="pin"
            value={query}
            className="h-[50vh]"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <Button
          type="button"
          onClick={() => signTypedData({})}
          disabled={isLoading || !address || !query}
        >
          {isLoading ? "Signing..." : "Sign"}
        </Button>

        <Button type="submit" disabled={!isSuccess}>
          Submit
        </Button>

        {isSuccess && <p>Signature: {data}</p>}
        {isError && <p>Error signing message.</p>}
      </form>
    </>
  );
}

import { constants } from "@nftchance/plug-types";

import { useEffect, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PIN } from "@/lib/constants";

import { getConnector } from "../../../server/src/connector";

export default function Pin<
  P extends {
    connector: ReturnType<typeof getConnector>;
  }
>({ connector }: P) {
  const { address } = useAccount();

  const [query, setQuery] = useState(
    JSON.stringify(DEFAULT_PIN, null, 4)
  );

  const { data, isError, isLoading, isSuccess, reset, signTypedData } =
    useSignTypedData({
      domain: DEFAULT_PIN.domain,
      message: DEFAULT_PIN.message.pin,
      primaryType: "Pin",
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
    await connector.pin.create.mutate(json);

    reset();
  }

  useEffect(() => {
    // * Open the onCreate susbcription.
    connector.pin.onCreate.subscribe(undefined, {
      onData: (pin) => {
        console.log("Pin created:", pin);
      },
    });
  }, [connector]);

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

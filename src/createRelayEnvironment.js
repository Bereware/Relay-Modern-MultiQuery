import { Environment, Network, RecordSource, Store } from "relay-runtime";

const API_HOST = "__ENDPOINT__";

function fetchQuery(operation, variables) {
    return fetch(`${API_HOST}`, {
        credentials: "include",
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    })
        .then((response) => {
            if (response.redirected) {
                document.location = response.url;
            }
            return response.json();
        })
        .then((json) => {
            return json;
        });
}

const RelayEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
});

export default RelayEnvironment;

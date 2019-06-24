import { commitMutation } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../createRelayEnvironment";

const mutation = graphql`
    mutation UpdateContactMutation($input: UpdateContactMutationInput!) {
        update_contact(input: $input) {
            contact {
                id
            }
        }
    }
`;

export default function UpdateContactMutation(id, first_name, last_name, email, phone) {
    const variables = {
        input: {
            id,
            first_name,
            last_name,
            email,
            phone,
            clientMutationId: ""
        }
    };
    commitMutation(environment, {
        mutation,
        variables,
        onCompleted: (response, errors) => {
            console.log(response, environment);
        },
        onError: (err) => console.error(err),
        updater: (proxyStore) => {
            const contact_node = proxyStore.get(id, "Contact");
            contact_node.setValue(first_name, "first_name");
            contact_node.setValue(last_name, "last_name");
            contact_node.setValue(email, "email");
            contact_node.setValue(phone, "phone");
        }
    });
}

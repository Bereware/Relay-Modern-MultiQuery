import React from "react";
import graphql from "babel-plugin-relay/macro";
import { QueryRenderer } from "react-relay";
import { Route, Switch, NavLink, Link } from "react-router-dom";
import { Row, Col, Nav, Navbar } from "react-bootstrap";

import environment from "../createRelayEnvironment";
import { ITEMS_PER_PAGE } from "../constants";

import { ContactList, CreateContact, ContactDetails } from "./Contact";
import "./App.css";

const SearchAllContactsQuery = graphql`
    query SearchAllContactsQuery($count: Int!, $filter: ContactFilter, $orderBy: ContactOrderBy) {
        ...ContactList_contacts @arguments(count: $count, filter: $filter, orderBy: $orderBy)
    }
`;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            countList: ITEMS_PER_PAGE,
            filterValue: "",
            orderBy: "id_DESC"
        };
    }

    renderModelList() {
        return (
            <QueryRenderer
                lookup={true}
                environment={environment}
                query={SearchAllContactsQuery}
                variables={{
                    count: ITEMS_PER_PAGE,
                    filter: {
                        name_contains: this.state.filterValue
                    },
                    orderBy: this.state.orderBy
                }}
                render={({ error, props }) => {
                    if (error) {
                        return <div>{error.message}</div>;
                    } else if (props) {
                        return <ContactList contacts={props} />;
                    }
                    return <div>Loading</div>;
                }}
            />
        );
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Navbar id="top-header">
                        <Navbar.Brand as={Link} to="/">
                            RelayMultiQuery
                        </Navbar.Brand>
                        <Nav className="mx-auto">
                            <Nav.Link as={NavLink} activeClassName="active" to="/">
                                Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} activeClassName="active" to="/contacts">
                                Contacts
                            </Nav.Link>
                        </Nav>
                    </Navbar>
                </header>
                <Switch>
                    <Route
                        exact
                        path={`${this.props.match.url}contacts`}
                        render={() => (
                            <section>
                                <Row>
                                    <Col sm={9}>{this.renderModelList()}</Col>
                                </Row>
                            </section>
                        )}
                    />
                    <Route path={`${this.props.match.url}contacts/create`} component={CreateContact} />
                    <Route path={`${this.props.match.url}contacts/:contactId`} component={ContactDetails} />
                </Switch>
            </div>
        );
    }
}

export default App;

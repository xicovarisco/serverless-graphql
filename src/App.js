import React, { Component } from "react"
import ApolloClient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';
import logo from "./logo.svg"
import "./App.css"
import AppWithData from './AppWithData';

class App extends Component {
  render() {
    const client = new ApolloClient({
      uri: "/.netlify/functions/graphql"
    });

    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
          </header>
          <AppWithData />
        </div>
      </ApolloProvider>
    );
  }
}

export default App

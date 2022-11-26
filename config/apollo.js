import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import fetch from 'node-fetch';

const cliente = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
        // uri: 'https://lit-beach-84279.herokuapp.com/',
        uri: ' http://localhost:4000/',
        fetch
    })
});

export default cliente;
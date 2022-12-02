import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import fetch from 'node-fetch';

const cliente = new ApolloClient({
    connectToDevTools: true,
    cache: new InMemoryCache(),
    link: new HttpLink({
        //heroki die 
        //uri: 'https://lit-beach-84279.herokuapp.com/',
        uri: 'https://bk-onlyofers-production.up.railway.app/',
        //uri: 'http://localhost:4000/',
        fetch
    })
});

export default cliente;
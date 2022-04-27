import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    uri: "http://graph.holaplex.com/v1",
    cache: new InMemoryCache({resultCaching: false})
})

export default client
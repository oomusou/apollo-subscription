import { ApolloServer, gql, PubSub } from 'apollo-server'

let data = [
  { title: 'FP in JavaScript', price: 100 },
  { title: 'RxJS in Action', price: 200 },
  { title: 'Speaking JavaScript', price: 300 }
]

let pubsub = new PubSub()

let typeDefs = gql`
  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(book: BookInput!): Book
  }

  type Book {
    title: String
    price: Int
  }

  input BookInput {
    title: String!
    price: Int!
  }

  type Subscription {
    bookAdded: Book
  }
`

let books = () => data

let addBook = (_, { book }) => {
  data.push(book)

  pubsub.publish('bookAdded', {
    bookAdded: book
  })

  return book
}

let bookAdded = {
  subscribe: () => pubsub.asyncIterator(['bookAdded'])
}

let resolvers = {
  Query: {
    books
  },
  Mutation: {
    addBook
  },
  Subscription: {
    bookAdded
  }
}

let apolloServer = new ApolloServer({ typeDefs, resolvers })

apolloServer.listen()
  .then(({ url }) => `GraphQL Server ready at ${ url }`)
  .then(console.log)

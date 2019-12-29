import { ApolloServer, gql, PubSub } from 'apollo-server'

let data = [
  { title: 'FP in JavaScript', price: 100 },
  { title: 'RxJS in Action', price: 200 },
]

let pubsub = new PubSub()

let typeDefs = gql`
  type Query {
    books: [Book]
  }
  
  type Mutation {
    addBook(book: BookInput!): Book
  }

  type Subscription {
    newBook: Book
  }

  type Book {
    title: String
    price: Int
  }

  input BookInput {
    title: String!
    price: Int!
  }
`

let books = () => data

let addBook = (_, { book }, { pubsub }) => {
  data.push(book)

  pubsub.publish('bookAdded', { newBook: book })

  return book
}

let newBook = {
  subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('bookAdded')
}

let resolvers = {
  Query: {
    books
  },
  Mutation: {
    addBook
  },
  Subscription: {
    newBook
  }
}

let context = () => ({ pubsub })

new ApolloServer({ typeDefs, resolvers, context })
  .listen()
  .then(({ url }) => `GraphQL Server ready at ${ url }`)
  .then(console.log)

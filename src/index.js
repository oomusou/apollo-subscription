import { ApolloServer, gql, PubSub, withFilter } from 'apollo-server'

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
    bookAdded(title: String!): Book
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

let addBook = (_, { book }) => {
  data.push(book)

  pubsub.publish('bookAdded', {
    bookAdded: book,
    title: book.title
  })

  return book
}

let bookAdded = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('bookAdded'),
    (payload, variables) => payload.title === variables.title
  )
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

new ApolloServer({ typeDefs, resolvers })
  .listen()
  .then(({ url }) => `GraphQL Server ready at ${ url }`)
  .then(console.log)

import { gql } from 'apollo-server-express'
const models = require('../models').db
const Op = models.Op

export const typeDefs = gql`
    extend type Query {
        users(
            page: Int!,
            size: Int!,
            userId: Int
        ): ResultListUser
        detailUser(id: ID!): DetailUser
    }
    type ResultListUser {
        results: [DetailUser],
        total: Int
    }
    type DetailUser {
        id: ID
        email: String
        name: String
    }
`

export const resolvers = {
  Query: {
    users: async (_obj, args, _context, _info) =>{
      const page = args.page
      let size = args.size
      if(size >= 100) size = 100
      let order = [["id", "DESC"]]
      const userId = args.userId
      let where = {
      }
      if(userId){
        where['id'] = userId
      }
      return {
        results: models.Users.findAll({
          where: where,
          order: order,
          limit: size,
          offset: (page - 1) * size,
        }),
        total: models.Users.count({where: where})
      }
    },
    detailUser: async (_obj, args, _context, _info) =>{
      return models.Users.findByPk(args.id)
    }
  }
}

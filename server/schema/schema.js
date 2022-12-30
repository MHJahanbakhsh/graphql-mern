const {projects,clients} = require('../sampleData')

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, } = require('graphql')

//Client type
const ClientType = new GraphQLObjectType({
    name:'Client',
    fields:()=>({
        id:{type: GraphQLID}, //altough in sampleData, it is just a string number
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString},
    })
})


const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        client:{
            type:ClientType,
            args: {id: {type: GraphQLID}}, //adding args specifies that this query requires argument
            resolve(parent,args){ //for now this is just a regular function.but later will be a mongoose function
                console.log(parent) //receive undefined. why? what is parent
                return clients.find(client=>client.id===args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery
})
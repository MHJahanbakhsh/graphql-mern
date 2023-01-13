const {projects,clients} = require('../sampleData')

const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, } = require('graphql')

//Client type
const ClientType = new GraphQLObjectType({
    name:'Client',
    fields:()=>({
        id:{type: GraphQLID}, //although in sampleData, it is just a string number
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString},
    })
})


//Project type
const ProjectType = new GraphQLObjectType({
    name:'Project',
    fields:()=>({
        id:{type: GraphQLID}, //altough in sampleData, it is just a string number
        name:{type:GraphQLString},
        description:{type:GraphQLString},
        status:{type:GraphQLString},
        client:{
            type:ClientType,
            resolve(parent,args){
                console.log(parent) //parent is a project
                return clients.find(client=>client.id ===parent.clientId)
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        projects:{
            type: new GraphQLList(ProjectType),
            //we have no args here,hence no argument while addressing that query 
            resolve(parent,args){
                return projects
            }
        },
        project:{
            type:ProjectType,
            args: {id: {type: GraphQLID}}, //adding args specifies that this query requires argument
            resolve(parent,args){ //for now this is just a regular function.but later will be a mongoose function
                console.log(parent) //receive undefined. why? what is parent
                return projects.find(project=>project.id===args.id)
            }
        },

        clients:{
            type: new GraphQLList(ClientType),
            //we have no args here,hence no argument while addressing that query 
            resolve(parent,args){
                return clients
            }
        },
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
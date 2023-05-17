/*
this is a code-first approach to build graphql apis. with this approach you dont write seprate SDL.
and your schema is on the go with your resolver.you would still see your schema in grapiql but there is no seperate .graphql file
*/ 

const {projects,clients} = require('../sampleData')
const {
    GraphQLObjectType,
    GraphQLID, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLNonNull, 
    GraphQLEnumType
} = require('graphql')

//mongoose models
const Project = require('../models/Project')
const Client = require('../models/Client')

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
        //above fields has no resolvers.
        client:{
            //we define type and resolver function(if needed) at the same time
            type:ClientType,
            resolve(parent,args){
                console.log(parent) //parent is a project
                return Client.findById(client=>client.id ===parent.clientId)
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
                return Project.find() //its wierd because still uses find method but give no arg to return everything. more intuitivly should have been findAll
            }
        },
        project:{
            type:ProjectType,
            args: {id: {type: GraphQLID}}, //adding args specifies that this query requires argument
            resolve(parent,args){ //for now this is just a regular function.but later will be a mongoose function
                console.log(parent) //receive undefined. why? what is parent
                return Project.findById(args.id)
            }
        },

        clients:{
            type: new GraphQLList(ClientType),
            //we have no args here,hence no argument while addressing that query 
            resolve(parent,args){
                return Client.find()
            }
        },
        client:{
            type:ClientType,
            args: {id: {type: GraphQLID}}, //adding args specifies that this query requires argument
            resolve(parent,args){ //for now this is just a regular function.but later will be a mongoose function
                console.log(parent) //receive undefined. why? what is parent
                return Client.findById(args.id)
            }
        }
    }
})



// ------------------------Mutations----------------------
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addClient:{
            //we define schemas as we define the resolvers.code-first approach
            type: ClientType,
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                phone:{type:GraphQLNonNull(GraphQLString)},
            },
            resolve(parent,args){
                //this is where we create a record
                const client = new Client({
                    name:args.name,
                    email:args.email,
                    phone:args.phone
                })
                //and save to mongodb database
                return client.save()
            }
        },
        deleteClient:{
            type:ClientType,
            args:{
                id:{type:GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                return Client.findByIdAndRemove(args.id)
            }
        },
        addProject:{
            type:ProjectType, //by type we mean return type?
            args:{
                name:{type:GraphQLNonNull(GraphQLString)},
                description:{type:GraphQLNonNull(GraphQLString)},
                email:{type:GraphQLNonNull(GraphQLString)},
                status:{type: new GraphQLEnumType({ //note to the "new" keyword
                    name:'ProjectStatus',
                    values:{
                        'new':{value:'Not Started'},
                        'progress':{value:'In Progress'},
                        'completed':{value:'Completed'},
                    },
                    defaultValue:'Not Started'
                }
                )},
                clientId:{type:GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                const project = new Project({
                    name:args.name,
                    email:args.email,
                    description:args.description,
                    clientId:args.clientId,
                    status:args.status
                })
                return project.save()
            }

        },
        deleteProject:{
            type:ProjectType,
            args:{
                projectId:{type:GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                const id = args.projectId
                return Project.findByIdAndRemove(id)
            }
        },
        updateProject: {
            type: ProjectType,
            args: {
              id: { type: GraphQLNonNull(GraphQLID) },
              name: { type: GraphQLString }, //we don't impose to be non-null because it is and update. if no arg given, then it won't update that field
              description: { type: GraphQLString },
              status: {
                type: new GraphQLEnumType({
                  name: 'ProjectStatusUpdate', //enums names should be diffrent. thats why this is diffrent from above
                  values: {
                    new: { value: 'Not Started' },
                    progress: { value: 'In Progress' },
                    completed: { value: 'Completed' },
                  },
                }),
              },
            },
            resolve(parent, args) {
              return Project.findByIdAndUpdate(
                args.id,
                {
                  $set: {
                    name: args.name,
                    description: args.description,
                    status: args.status,
                  },
                },
                { new: true }
              );
            },
          },
    }
})


module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
})
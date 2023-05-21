const express = require('express')
require('dotenv').config() //in order to .env to work
const {graphqlHTTP} = require('express-graphql')
const schema = require('./schema/schema');
const colors = require('colors');
const mongoDB = require('./config/db')
const cors = require('cors')
const port = process.env.PORT || 5000;

const app = express() 
app.use(cors())
mongoDB()
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:process.env.NODE_ENV==='development' //only true when we are in development
}))

app.listen(port, console.log(`server running at ${port}`))
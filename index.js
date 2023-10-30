const express =require('express')
const app= express();
const cors= require('cors');
require('dotenv').config()
const port=process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.px2gaoj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

        const menuCollections= client.db("b-deshi-restaurent").collection("menu")
        const reviewCollections= client.db("b-deshi-restaurent").collection("reviews")


        app.get('/menu',async(req,res)=>
        {
            const result= await menuCollections.find().toArray()
            res.send(result)
        })
        app.get('/reviews',async(req,res)=>
        {
            const result= await reviewCollections.find().toArray()
            res.send(result)
        })


  } finally {



  }
}
run().catch(console.dir);



app.get('/',(req,res)=>
{
    res.send('port is running')
})

app.listen(port,()=>
{
    console.log(`server is running on ${port}`)
})
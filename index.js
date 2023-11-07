const express =require('express')
const app= express();
const cors= require('cors');
require('dotenv').config()
const port=process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const cartCollections= client.db("b-deshi-restaurent").collection("carts")
        const userCollections= client.db("b-deshi-restaurent").collection("users")




        app.get('/users',async(req,res)=>
        {
          const result=await userCollections.find().toArray()
          res.send(result)
        })
      

        app.post('/users',async(req,res)=>
        {
          const user=req.body;
          const query={email:user.email}
          const existingUser=await userCollections.findOne(query)
          if(existingUser)
          {
            return res.send({message: 'user already exists'})
          }
          const result= await userCollections.insertOne(user)
          res.send(result)
        })

        app.patch('/users/admin/:id',async(req,res)=>
        {
            const id=req.params.id;
            const query= {_id: new ObjectId(id)}
            const updatedDoc= {
              $set: {
                role:`admin`
              },
            }
            const result =await userCollections.updateOne(query,updatedDoc);
            res.send(result);
        })


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

        // cart collection

        app.get('/carts', async(req,res)=>
        {
          const email=req.query.email;
          if(!email)
          {
            res.send([])
          }
          const query= {email: email};
          const result = await cartCollections.find(query).toArray();
          res.send(result)
        })

        app.post('/carts',async(req,res)=>
        {
          const item=req.body;
          const result= await cartCollections.insertOne(item);
          res.send(result);
        })

        app.delete('/carts/:id',async(req,res)=>
        {
          const id=req.params.id
          const query={_id: new ObjectId(id)}
          const result= await cartCollections.deleteOne(query);
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
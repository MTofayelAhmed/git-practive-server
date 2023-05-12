const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.qhvkztn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeePracticeDB").collection("coffee");
   





    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
      console.log(newCoffee);
    });


    app.get('/coffees', async(req, res)=>{
      const cursor = coffeeCollection.find();
      const result = await  cursor.toArray()
      res.send(result)
      
    })
    app.get('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })
    

app.put('/coffees/:id', async (req, res)=>{
  const id = req.params.id;
  const updateCoffees= req.body;
  const options = { upsert: true };
  const query= {_id: new ObjectId(id)}
  const update =  {
    $set: {
    name: updateCoffees.name,
    chef:updateCoffees.chef,
     supplier:updateCoffees.supplier,
     taste:updateCoffees.taste,
     category:updateCoffees.category,
     details:updateCoffees.details,
     photo: updateCoffees.photo
    },
  };
  const result = await coffeeCollection.updateOne(query, update, options)
  res.send(result)

})

    app.delete('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee server practice is running  ");
});
app.listen(port, () => {
  console.log(`coffee server practice is running on port: ${port}`);
});

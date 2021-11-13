const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// MIddleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qzeme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("wrishStore");
    const storeProductCollection = database.collection("products");
    const storeOrderCollection = database.collection("order");
    const storeUsersCollection = database.collection("users");
    const storeRiviewCollection = database.collection("reviews");

    //Get All Product Data From DB

    app.get('/products', async (req, res) => {
      const cursor = storeProductCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //Get Single Data Form Products ID
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await storeProductCollection.findOne(query);
      res.json(product);
    });

    //Post Add Product Data

    app.post('/products', async (req, res) => {
      const products = req.body;
      const result = await storeProductCollection.insertOne(products);
      console.log(result);
      res.json(result);
    });


    // Post Customer Order Data
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await storeOrderCollection.insertOne(order);
      res.json(result);
    });

    // Get All Order Customer Data
    // app.all("/order", async (req, res) => {
    //   const cursor = storeOrderCollection.find({});
    //   const orderDetails = await cursor.toArray();
    //   res.send(orderDetails);
    // });

    //Get Customer Order Data Filter By Email
    app.get('/order', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = storeOrderCollection.find(query);
      const orderDetails = await cursor.toArray();
      res.send(orderDetails);
    });

    // User Data Get For Admin Role
    app.get('/users/:email', async(req, res)=> {
      const email = req.params.email;
      const query ={email:email};
      const user = await storeUsersCollection.findOne(query);
      let isAdmin = false;
      if(user.role === 'admin') {
        isAdmin = true;
      }
      res.json({admin: isAdmin})
    })

    // User Information Data POST API
    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await storeUsersCollection.insertOne(users);
      console.log(result);
      res.json(result);
    });

    // User Role Update
    app.put('/users/admin', async(req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}};
      const result = await storeUsersCollection.updateOne(filter,updateDoc);
      res.json(result);
    })

    // ADD Review POST API
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await storeRiviewCollection.insertOne(reviews);
      console.log(result);
      res.json(result);
    });

    // GET ALL REVIEWS DATA
    app.get("/reviews", async (req, res) => {
      const cursor = storeRiviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });

    // DELETE Product 
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await storeProductCollection.deleteOne(query);
      res.json(result);
    });

     //DELETE Order Data

     app.delete('/order/:id', async (req, res) => {
      const email = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await storeOrderCollection.deleteOne(query);
      res.json(result);
    });
     
   
  } finally {
    //await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Assinment 12");
});

app.listen(port, (req, res) => {
  console.log("Server Running On", port);
});

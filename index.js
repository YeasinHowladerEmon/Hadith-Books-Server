const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID

const port = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())



app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3xzol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { 
useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connet err', err);
  const productCollection = client.db("book").collection("products");
  const ordersCollection = client.db("book").collection("orders");

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('added', newProduct)
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count' ,result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })
  
  
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log('added', order)
    ordersCollection.insertOne(order)
    .then(result => {
      console.log('inserted count' ,result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })  

  app.get('/orders', (req, res) => {
    // console.log(req.query.email)
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      console.log(documents)
      res.send(documents)
    })
  })

});


app.listen(process.env.PORT || port)
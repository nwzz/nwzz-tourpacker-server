const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());




//MONGODB CONNECTION

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pmqj1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("tourism");
    const dataCollection = database.collection("tourData");
    const bookingCollection = database.collection("bookingData");
    
    console.log('mongodb Connected');



    //GET API
    app.get('/tours', async (req, res) =>{
        const cursor = dataCollection.find({});
        const tours = await cursor.toArray();
        res.send(tours);
    })



    app.get('/orders', async (req, res) =>{
      const cursor = bookingCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
  })



    app.get('/tours/:id', async (req, res) =>{
      const id = (req.params.id);
      //console.log('the id is:',id);
      const query = await { _id: ObjectId(id)};
      console.log(query);
      const result = await dataCollection.findOne(query);
      console.log(result);
      res.json(result);
      //console.log('Detailing shows of:',user)
    })

 
 
    app.get('/orders/:id', async (req, res) =>{
      const id = (req.params.id);
      //console.log('the id is:',id);
      const query = await {_id: ObjectId(id)};
      console.log(query);
      const result = await bookingCollection.findOne(query);
      //console.log(result);
      res.json(result);
      //console.log('Detailing shows of:',user)
    })



     //POST API
     app.post('/orders', async(req, res) =>{
      const newBooking = req.body;
      const result = await bookingCollection.insertOne(newBooking);
      //console.log('got new user', req.body);
      console.log('added booking', result);
      //res.send('post hitted');
      res.json(result);
    });

    //POST API
    app.post('/tours', async(req, res) =>{
      const newPackage = req.body;
      const result = await dataCollection.insertOne(newPackage);
      //console.log('got new user', req.body);
      console.log('added package', result);
      //res.send('post hitted');
      res.json(result);
    });


    //DELETE API
    app.delete('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      const query ={ _id: ObjectId(id)};
      const result = await bookingCollection.deleteOne(query);
      console.log('deleting with id:', result);
      res.json(result);
    })

    //UPDATE API
    app.put('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email
        }
      }

      const result = await bookingCollection.updateOne(filter, updateDoc, options);
      res.json(result);
     //console.log('updating user', id);
    })




  } finally {
    //await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})
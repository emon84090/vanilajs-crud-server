const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5050;
require('dotenv').config()

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.trffq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();

        app.post('/users', async (req, res) => {

            const userCollection = client.db('vanilajs').collection('userrs');
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const userCollection = client.db('vanilajs').collection('userrs');
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)

        })

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const userCollection = client.db('vanilajs').collection('userrs');
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);


        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const userCollection = client.db('vanilajs').collection('userrs');
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);

        })

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const newbody = req.body;
            const userCollection = client.db('vanilajs').collection('userrs');
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: newbody.name,
                    email: newbody.email,
                    phone: newbody.phone
                }

            }
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })



    } finally {

    }

}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('vanila javascript crud operation with node js and mongodb')
})

app.listen(port, () => {
    console.log(`your server is running on ${port}`);
})
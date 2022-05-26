const mongodb = require("mongoose");
const mongourl = "mongodb://127.0.0.1:27017/searching"
mongodb.connect(mongourl)

const port = 8000;

const express = require("express")
const cors = require('cors');

const app = express()
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));



const movieDB = require('./models/movie');


app.get('/getMovie', async (req, res) => {
    movieDB.find({},(err,resT) => {
        if(err) {
            res.send(err)
        }
        else
        {
            res.send(resT)
        }
    })
});

app.post('/addMovie', async(req, res) => {
    try{
        const {title, likes, dislikes} = req.body
        let newMovie = new movieDB({title, likes, dislikes});

        await newMovie.save()
        res.json(newMovie);
    }
    catch (error) {
        res.send(error);
    }
  })


  app.put('/updateLikesMovie', async(req,res) => {
    try {
            await movieDB.findById(req.body._id, (error, movieToUpdate) => {
                movieToUpdate.likes++;
                movieToUpdate.save();
        }).clone()
    }
    catch(err) {
        console.log(err);
    }
    res.send("Updated");
})

app.put('/updateDisLikesMovie', async(req,res) => {
    try {
            await movieDB.findById(req.body._id, (error, movieToUpdate) => {
                movieToUpdate.dislikes++;
                movieToUpdate.save();
        }).clone()
    }
    catch(err) {
        console.log(err);
    }
    res.send("Updated");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
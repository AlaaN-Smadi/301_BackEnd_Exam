'use strict'

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {default: axios} = require('axios');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/finalExam', {useNewUrlParser: true, useUnifiedTopology: true});


// mongoose.connect('mongodb://AlaaN-Smadi:eK27ppQjA2BT4A@cluster0-shard-00-00.z6gxe.mongodb.net:27017,cluster0-shard-00-01.z6gxe.mongodb.net:27017,cluster0-shard-00-02.z6gxe.mongodb.net:27017/MyFinalExam?ssl=true&replicaSet=atlas-4riz20-shard-0&authSource=admin&retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});



const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Listening on PORT ${PORT}`)
})


////   our  Code 

////   Mongoose Sechamas and module 

const itemSchema = new Schema({
    name: String,
    image: String
})
const userSchema = new Schema({
    email: String,
    favItems: [itemSchema]
})

const userModel = new mongoose.model('User', userSchema)


////   Seeding Function

function seedFunction(){

    ///  Razan  User
    const razan = new userModel({
        email: 'quraanrazan282@gmail.com',
        favItems:[
            {
                name:'Black',
                image:"http://www.colourlovers.com/img/000000/100/100/Black.png"
            },
            {
                name:'serenity is . . .',
                image:"http://www.colourlovers.com/img/ADD8C7/100/100/serenity_is_._._..png"
            }
        ]
    })

    ///   user  for  alaaads27@gmail.com
    const alaa1 = new userModel({
        email: 'alaaads27@gmail.com',
        favItems:[
            {
                name:'Black',
                image:"http://www.colourlovers.com/img/000000/100/100/Black.png"
            },
            {
                name:'serenity is . . .',
                image:"http://www.colourlovers.com/img/ADD8C7/100/100/serenity_is_._._..png"
            }
        ]
    })

    ///   user for alaasmadi1010@gmail.com
    const alaa2 = new userModel({
        email: 'alaasmadi1010@gmail.com',
        favItems:[
            {
                name:'Black',
                image:"http://www.colourlovers.com/img/000000/100/100/Black.png"
            },
            {
                name:'serenity is . . .',
                image:"http://www.colourlovers.com/img/ADD8C7/100/100/serenity_is_._._..png"
            }
        ]
    })

    razan.save();
    alaa1.save();
    alaa2.save();

}


////    calling seeding function

// seedFunction()
////  Getting Data from API  =>

app.get('/getApiData', async(req, res) =>{
    const apiUrl = 'https://ltuc-asac-api.herokuapp.com/allColorData'
    const data = await axios.get(apiUrl)
    console.log(data.data)

    res.send(data.data)
})




////   Getting Fav  Items

app.get('/myFavItems', (req,res)=>{
    const userEmail = req.query.userEmail

    console.log(userEmail);


    userModel.find({email: userEmail}, function(error, userInfo){
        if(error){
            res.send('Data not Found')
        }else{
            console.log(userInfo[0].favItems);
            res.send(userInfo[0].favItems)
        }
    })

})

///   Add  to my Fav =>

app.get('/addNewFav', (req,res)=>{
    const userEmail = req.query.userEmail
    const itemName = req.query.itemName
    const itemImage = req.query.itemImage

    userModel.find({email: userEmail}, function(error, userInfo){
        if(error){
            res.send('Data not Found')
        }else{
            
            const newObj = {
                name: itemName,
                image: itemImage
            }

            userInfo[0].favItems.push(newObj)
            userInfo[0].save();

            res.send(userInfo[0].favItems)
        }
    })
})



/////    Update  My  Fave =>

app.get('/updateMyFave', (req,res)=>{
    const userEmail = req.query.userEmail
    const itemName = req.query.itemName
    const itemImage = req.query.itemImage
    const index = req.query.index

    userModel.find({email: userEmail}, function(error, userInfo){
        if(error){
            res.send('Data not Found')
        }else{
            

            userInfo[0].favItems[index].name = itemName
            userInfo[0].favItems[index].image = itemImage

            userInfo[0].save();

            res.send(userInfo[0].favItems)
        }
    })
})



/////    Delete My  Item  =>

app.get('/deleteMyItem', (req,res)=>{
    const userEmail = req.query.userEmail
    const index = req.query.index


    userModel.find({email: userEmail}, function(error, userInfo){
        if(error){
            res.send('Data not Found')
        }else{
           
            userInfo[0].favItems.splice(index, 1)

            userInfo[0].save();

            res.send(userInfo[0].favItems)
        }
    })
})
const express = require('express')
const router = express.Router()
const Person = require('../Model/Person')



// Create and Save a Record of a Model
router.post('/', (req, res) => {
    let info = req.body
    let newPerson = new Person(info)
    newPerson.save()
        .then(person => res.send(person))
        .catch(err => console.log(err.message))
})

// Create Many Records with model.create()

router.post('/manyPeople', (req, res) => {
    let info = req.body
     Person.create(info)
        .then(manyPeople => res.send(manyPeople))
        .catch(err => console.log(err.message))
})

// Use model.find() to Search Your Database

router.get('/manyPeople/:name', (req, res) => {
        Person.find({name: req.params.name})
        .then(person => res.send(person))
        .catch(err => console.log(err.message))
})

// Use model.findOne() to Return a Single Matching Document from Your Database

router.get('/manyPeople/favoriteFoods/:favoriteFoods', (req, res) => {
    Person.findOne({favoriteFoods: req.params.favoriteFoods })
    .then(person => res.send(person))
    .catch(err => console.log(err.message))
})

// Use model.findById() to Search Your Database By _id

router.get('/manyPeople/id/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => res.send(person))
    .catch(err => console.log(err.message))
})

// Perform Classic Updates by Running Find, Edit, then Save

router.put('/manyPeople/findAndUpdate/:id', (req, res) => {
    Person.findById(req.params.id) 
        .then(person => {
            person.favoriteFoods.push(req.body.favoriteFoods)

            person.save()
                .then(updated => res.send(updated))
                .catch(err => console.log(err.message))
        }
            )
        .catch(err => console.log(err.message))
})

// Perform New Updates on a Document Using model.findOneAndUpdate()

router.put('/manyPeople/findOneAndUpdate/:name', (req, res) => {
    Person.findOneAndUpdate({name: req.params.name},
        {$set: {age: req.body.age}},
        {
            new: true,                       
            runValidators: true              
          })
    .then(person => res.send(person))
    .catch(err => console.log(err.message))
})

// Delete One Document Using model.findByIdAndRemove

router.delete('/manyPeople/findOneAndRemove/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
    .then(response => res.send("One Person deleted From Collection with ID: " +req.params.id ))
      .catch(err => {
        console.error(err)
        
})
})

// MongoDB and Mongoose - Delete Many Documents with model.remove()

  router.delete('/manyPeople/Remove/:name', (req, res) => {
    Person.remove({ name: req.params.name })
        .then(person => res.send({NumberOfPersonDeleted: person.deletedCount}))
        .catch(err => console.log(err.message))
    
  })

//   Chain Search Query Helpers to Narrow Search Results

  router.get('/manyPeople/NarrowSearch/:food', (req, res) => {
    Person.find({favoriteFoods : req.params.food})                  
        .sort({name: 1})         
         .limit(2)                
         .select({age: false} )
         .exec((err , users)  => {
             if(err ) console.log(err)
             else res.send(users)
         })                   
        })
module.exports = router
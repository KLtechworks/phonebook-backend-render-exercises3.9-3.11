// 3.13: Phonebook database, step 1
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

app.use(cors())
app.use(express.json())
// app.use(express.static('../frontend/dist'))
app.use(express.static('dist'))

const Person = require('./models/person')


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons))
})

// 3.18*: Phonebook database step 6
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()    
      }
    })
    // 3.16: Phonebook database, step 4
    .catch(error => next(error))
})

// 3.18*: Phonebook database step 6
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `)
  })
})

// 3.14: Phonebook database, step 2
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // if (!body.name || !body.number) {
  //   return response.status(400).json({ 
  //     error: 'content missing' 
  //   })
  // }

  const person = new Person({
    name: body.name,       
    number: body.number,   
  })

  
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)   
    })
    .catch(error => next(error))
    // .catch(error => {
    //   console.log(error)
    //   response.status(400).send({ error: 'error.message' })
    // })
})

// 3.17*: Phonebook database, step 5
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

// 3.15: Phonebook database, step 3
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()   
    })
    .catch(error => next(error))   
})



// 3.16: Phonebook database, step 4
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// 3.16: Phonebook database, step 4
const errorHandler = (error, request, response, next) => {
  console.error( error.message)

  // if (error.name === 'CastError') {
  //   return response.status(400).send({ error: 'malformatted id' })
  // } 

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)   

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`backend phonebook running http://localhost:${PORT}`)
})
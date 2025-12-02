require('dotenv').config()
const express = require('express')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
// 3.9 Phonebook backend step 9
const cors = require('cors')
app.use(cors())

// https://my-backend-part3.onrender.com/

// const mongoose = require('mongoose')


// mongoose.set('strictQuery',false)
// mongoose.connect(url, { family: 4 })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

const Note = require('./models/note')
// const Note = require('./models/person')
// const addNotes = async () => {
//   const notes = [
//     { content: "HTML is Easy", important: true },
//     { content: "Mongoose makes use of mongo easy", important: true },
//     { content: "Callback functions suck", important: true }

//   ]

//   await Note.deleteMany({})
//   await Note.insertMany(notes)
//   console.log("Notes added")
// }

// addNotes()

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    console.log('json file response')
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })


  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'something went wrong' })
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

})
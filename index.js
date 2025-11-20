
const express = require('express')
const app = express()


const morgan = require('morgan')

app.use(express.static('dist'))
app.use(express.json())
// 3.9 Phonebook backend step 9
const cors = require('cors')
app.use(cors())

morgan.token('postData', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})

app.use(morgan(':method :url :status :response-time ms  :postData'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const totalPeople = persons.length
    const currentTime = new Date()
    response.send(`
        <p>Phonebook has info for ${totalPeople} people</p>
        <p>${currentTime}</P>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => Number(p.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'           
        })
    }

    const nameAlreadyExists = persons.find(p => p.name === body.name)
    if (nameAlreadyExists) {
        return response.status(400).json({
            error: 'name already exists in the phonebook'
        })
    }
   
    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    persons.push(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const index = persons.findIndex(p => p.id === id)

    if (index !== -1) {
    persons.splice(index, 1)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
})
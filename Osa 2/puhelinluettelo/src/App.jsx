import { useState, useEffect } from 'react'
import personService from './services/persons'

const Notification = ({ message }) => {
  const notificationStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div 
    style={notificationStyle}>
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  return (
    <div 
    style={errorStyle}>
      {message}
    </div>
  )
}

const Filter = ({ newFilter, handleFilterInput }) => {
  return (
    <div>
        filter shown with <input value={newFilter} onChange={handleFilterInput}></input>
    </div>
  )
}

const PersonsForm = ({addPerson, newName, handleNameInput, newNumber, handleNumberInput}) => {
  return (
    <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameInput}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberInput}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Persons = ({filteredPersons, deletePerson}) => {
  return (
    <>
      {filteredPersons.map((person) => 
          <p key={person.name}>
            {person.name}{' '}
            {person.number ? person.number : ""}{' '}
            <button 
              onClick={() => deletePerson(person)}>delete</button>
          </p>
        )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => { 
    personService
      .getAll()
        .then(data => {
          setPersons(data)})}
  , [])

  const handleNameInput = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberInput = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterInput = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (!(persons.some(person => person.name === newName))) {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
          .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${newName}`)
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
    } else {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) 
      {
        updateNumber()
      }
    }
  }

  const updateNumber = () => {
    const targetPerson = persons.find(p => p.name === newName)
        const changedPerson = {...targetPerson, number: newNumber}
        personService
          .update(targetPerson.id, changedPerson)
            .then(returnedPerson => {
            setPersons(persons.map(p => {
              return (p.id !== targetPerson.id ? p : returnedPerson)
              }))
              setNewName('')
              setNewNumber('')
              setMessage(`Changed ${targetPerson.name}'s number`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
            })
            .catch(error => {
              setErrorMessage(`Information of ${targetPerson.name} has already been removed from server`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000);
    })
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id).then(() => {
        personService.getAll().then(data => {
          setPersons(data)
          setMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      })
      .catch(() => {
        alert(
          `the person '${person.name}' was already deleted from server`
        )
      })
    }
  }

  const filteredPersons = persons.filter(
    person => person.name?.toLowerCase().includes(newFilter.toLowerCase())
  )
  


  return (
    <div>
      <h2>Phonebook</h2>
        <ErrorNotification message={errorMessage}></ErrorNotification>
        <Notification message={message}></Notification>
        <Filter newFilter={newFilter} handleFilterInput={handleFilterInput}></Filter>
      <h3>add a new</h3>
        <PersonsForm 
          addPerson={addPerson} 
          newName={newName} handleNameInput={handleNameInput} 
          newNumber={newNumber} handleNumberInput={handleNumberInput}>

        </PersonsForm>
      <h3>Numbers</h3>
        <Persons filteredPersons={filteredPersons}
        deletePerson={deletePerson}></Persons>
    </div>
  )

}

export default App
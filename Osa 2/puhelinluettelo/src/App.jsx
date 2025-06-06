import { useState, useEffect } from 'react'
import personService from './services/persons'

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
          setNewName('')
          setNewNumber('')
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
            })
            .catch(error => {
              alert(`the person '${targetPerson.name}' was already deleted from server`)
              setPersons(persons.filter(p => p.id !== targetPerson.id))
    })
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .remove(person.id).then(() => {
        personService.getAll().then(data => {
          setPersons(data)
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
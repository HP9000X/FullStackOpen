import { useState } from 'react'

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

const Persons = ({filteredPersons}) => {
  return (
    <>
      {filteredPersons.map((person) => 
          <p key={person.name}>{person.name} {person.number ? person.number : ""} </p>
        )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')

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
      const copy = [...persons, { name: newName, number: newNumber}]
      setPersons(copy)
      setNewName("")
      setNewNumber("")
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  const filteredPersons = persons.filter(
    person => person.name.toLowerCase().includes(newFilter.toLowerCase())
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
        <Persons filteredPersons={filteredPersons}></Persons>
    </div>
  )

}

export default App
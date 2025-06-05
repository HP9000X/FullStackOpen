import { useState } from 'react'


const Button = ({onClick, text}) => {
  return (
    <>
    <button onClick={onClick}>{text}</button>
    </>
  )
}

const StatisticLine = ({value, text}) => {
  return (
    <p>{text} {value}</p>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const lenght = good + neutral + bad;
  if (lenght === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  const sum = good * 1 + bad * (-1);
  const average = sum / lenght;

  const positiveProsentage = good / lenght * 100
  const positiveString = positiveProsentage + ' %'

  return (
    <>
    <StatisticLine text={"good"} value={good}></StatisticLine>
    <StatisticLine text={"neutral"} value={neutral}></StatisticLine>
    <StatisticLine text={"bad"} value={bad}></StatisticLine>
    <StatisticLine text={"average"} value={average}></StatisticLine>
    <StatisticLine text={"positive"} value={positiveString}></StatisticLine>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={"good"} onClick={ () => {setGood(good + 1)}}></Button>
      <Button text={"neutral"} onClick={ () => {setNeutral(neutral + 1)}}></Button>
      <Button text={"bad"} onClick={ () => {setBad(bad + 1)}}></Button>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
    </div>
  )
}

export default App
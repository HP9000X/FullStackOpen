const Header = (props) => <h1>{props.course}</h1>

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => <Part key={part.id} part={part}></Part>)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = ({ parts }) => <p><strong>Total of exercises {parts.reduce((acc, part) => acc + part.exercises, 0)}</strong></p>

const Course = ({ course }) => {
    return (
      <>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts}></Total>
      </>
    )
}

export default Course
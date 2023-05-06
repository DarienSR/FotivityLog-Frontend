export default function Task(props) {
  return (
    <div>
      <p>{props.task.task}</p>
      <button>Edit</button>
    </div>
  )
}
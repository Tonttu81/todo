import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Row from './components/Row.jsx'
import { useUser } from './context/useUser.jsx'

const apiUrl = 'http://localhost:3001'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user } = useUser()

  useEffect(() => {
    axios.get(`${apiUrl}/tasks`)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        alert(error.response.data ? error.response.data.message : error)
      })
  }, [])

  const addTask = (event) => {
    event.preventDefault()
    const newTask = { description: task }
    const headers = {headers: {Authorization: `Bearer ${user.token}`}}
    axios.post(`${apiUrl}/tasks`, { task: newTask }, headers)
      .then(response => {
        setTasks(currentTasks => [...currentTasks, response.data])
        setTask('')
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
  }

  const deleteTask = (deleted) => {
    const headers = {headers: {Authorization: `Bearer ${user.token}`}}
    axios.delete(`${apiUrl}/tasks/${deleted}`, headers)
      .then(response => {
        setTasks(currentTasks => currentTasks.filter(item => item.id !== deleted))
      })
      .catch(error => {
        alert(error.response ? error.response.data.error.message : error)
      })
    
  }

  return (
    <div id="container">
      <h3>Todos</h3>
      <form onSubmit={addTask}>
        <input placeholder='Add new task' 
          value={task}
          onChange={event => setTask(event.target.value)}
        />
      </form>
      <ul>
        {
          tasks.map(task => (
            <Row task={task} key={task.id} onDelete={deleteTask}/>
          ))
        }
      </ul>
    </div>
  )
}

export default App

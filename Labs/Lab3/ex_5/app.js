const rootElement = document.getElementById('root')
const UserList = () => {
    const [users, setUsers] = React.useState([])
    const [username, setUsername] = React.useState("")

    const editUser = (user) => {
        if (username === "") {
            alert("Please enter an username!")
        } else {
            axios.put('http://localhost:3000/api/users/' + user.user_id, {"username": username})
        }

    }

    const deleteUser = (user) => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then((response) => {
                setUsers(users.filter(u => u.user_id != user.user_id))
            })
    }

    const addUser = () => {
        if (username === "") {
            alert("Please enter an username!")
        } else {
            axios.post('http://localhost:3000/api/users', {"username":username})
        }
    }

    const getUsers = () => {
        axios.get('http://localhost:3000/api/users')
            .then((response) => {
                console.log(response.data)
                setUsers(response.data)
            }, (error) => {
                console.log(error)
            })
    }

    React.useEffect(() => {
        getUsers()
    }, []) // empty dependency array so effect only runs once

    const list_of_users = () => {
        return users.map((item) =>
            <li key={item.user_id}> <p>{item.username} <button onClick={() => deleteUser(item)}>Delete</button>
                <button onClick={() => editUser(item)}>Edit</button></p></li>)
    }

    const updateUsernameState = (event) => {
        setUsername(event.target.value)
    }

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {list_of_users()}
            </ul>
            <h2>Add a new user:</h2>
            <form onSubmit={addUser}>
                <input type="text" value={username}
                       onChange={updateUsernameState}/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}

function App() {
    return(
        <div>
            <UserList/>
        </div>
    )
}

ReactDOM.render(
    <App/>, rootElement
)
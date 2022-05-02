const rootElement = document.getElementById('root')
function App(){
    return (
        <div>
            <ShoppingList/>
        </div>
    )
}

const ShoppingList = () => {
    return (
        <div>
            <h1>My Shopping List</h1>
        </div>
    )
}

ReactDOM.render(<App/>, rootElement)
const rootElement = document.getElementById('root')
function App(){
    return (
        <div>
            <ShoppingList/>
        </div>
    )
}

const ShoppingList = () => {
    let visible = true
    let shopping_list = [{name:"bread", price:2.75}, {name: "milk",
        price: 2.50}, {name: "pasta", price: 1.99}]

    const calculateTotal = () => {
        return shopping_list.map(item => item.price).reduce((prev, next) => prev + next)
    }

    return (
        <div>
            <h1>My Shopping List</h1>
            <ul>
                {shopping_list.map((item, index) => (
                    <li key={index}>{item.name}: {item.price}</li>
                ))}
            </ul>
            <h3>Total: ${calculateTotal()}</h3>
        </div>
    )
}



ReactDOM.render(<App/>, rootElement)
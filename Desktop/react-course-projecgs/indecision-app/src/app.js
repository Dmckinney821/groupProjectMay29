console.log('App js is running')

// if statements
// ternary operators
// logical
var app = {
    title: 'Indecision App',
    subtitle: 'This is some info'
}
var template = (
    <div>
        <h1>{app.title}</h1>
        <p>{app.subtitle}</p>
        <ol>
            <li>Item one</li>
            <li>Item two</li>
        </ol>
    </div>
)
var user = {
    name: 'Dan',
    age: 36,
    location: 'Jax'
}
var userName = 'Mickey'
var userAge = 36
var userLocation = 'SF'
var templateTwo = (
    <div>
        <h1>{user.name + '!'}</h1>
        <p>Age: {user.age}</p>
        <p>Location: {user.location}</p>
        
    </div>
)
var appRoot = document.getElementById('app')
ReactDOM.render(templateTwo, appRoot);
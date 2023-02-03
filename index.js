// read write file
const fs = require('fs');
// Expreess app to accept todo
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// check if todo.json exists or else create
if (!fs.existsSync('todo.json')) {
    fs.writeFileSync('todo.json', '[]');
}
// refer to json file
const data = fs.readFileSync('todo.json');
// try to parse json file and catch error then save empty array
var todos = [];
try {
    todos = JSON.parse(data);
} catch (error) {
    todos = [];
    writeTodos();
}

function writeTodos() {
    fs.writeFileSync('todo.json', JSON.stringify(todos));
}

app.post('/todo', (req, res) => {
    console.log(req.body);
    todos.unshift({
        id: req.body.id,
        description: req.body.description,
        completed: false
    });
    //if todos length > 100 delete old one
    if (todos.length > 100) {
        todos.pop();
    }
    writeTodos();
    res.send({
        message: 'Todo added',
        status: 200,
        todo: {
            id: req.body.id,
            description: req.body.description,
            completed: false
        }
    });
});

app.get('/todos', (req, res) => {
    res.send(todos);
});

// update todo by id
app.put('/todo/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const index = todos.findIndex(todo => todo.id == id);
    if (index !== -1) {
        todos[index].completed = req.body.completed;
        writeTodos();
        res.send({
            message: 'Todo updated',
            status: 200
        });
    } else {
        res.status(404).send({
            message: 'Todo not found',
            status: 404
        });
    }
});

// delete todo by id
app.delete('/todo/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const index = todos.findIndex(todo => todo.id == id);
    if (index !== -1) {
        todos.splice(index, 1);
        writeTodos();
        res.send({
            message: 'Todo deleted',
            status: 200
        });
    } else {
        res.status(404).send({
            message: 'Todo not found',
            status: 404
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
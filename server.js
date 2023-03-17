const restify = require('restify');
const server = restify.createServer();
const port = process.env.PORT ?? 3000;

server.use(restify.plugins.bodyParser());

const todos = new Map();
let nextId = 1;

server.get('/todos', (_, res, next) => {
    res.json(Array.from(todos.values()));
    next();
});

server.get('/todos/:id', (req, res, next) => {
    const todo = todos.get(+req.params.id);
    if (todo) {
        res.json(todo);
    } else {
        res.send(404);
    }
    next();
});

server.post('/todos', (req, res, next) => {
    try {
        const todo = req.body;
        todo.id = nextId++;
        todos.set(todo.id, todo);
        res.json(201, todo);
        next();
    } catch (err) {
        console.log(err);
        res.send(400);
        next();
    }
});

server.put('/todos/:id', (req, res, next) => {
    try {
        const todo = req.body;
        todo.id = +req.params.id;
        console.log(todo.id);
        todos.set(todo.id, todo);
        res.send(204);
        next();
    } catch (err) {
        console.log(err);
        res.send(400);
        next();
    }
});

server.del('/todos/:id', (req, res, next) => {
    const removed = todos.delete(+req.params.id);
    res.send(removed ? 204 : 404);
    next();
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

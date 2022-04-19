const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const data = require('./users.json');
const {response} = require("express");
const users = data.users;
console.log(users);

app.get('/users', (req, res) => {
    res.status(200).send(users);
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;

    let response = `No user with id ${id}`;
    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            response = user;
            break;
        }
    }

    res.status(200)
        .send(response);
});

app.use(bodyParser.json());

app.post('/users', (req, res) => {
    const newUser = req.body;

    users.push(newUser);
    res.status(201)
        .send(users);
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;

    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            users[index] = updatedUser;
            break;
        }
    }

    res.status(200)
        .send(updatedUser);
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            const index = users.indexOf(user);
            users.splice(index, 1);
        }
    }
    res.send(users);
});

app.get('/users/:id/view_following', (req, res) => {
    const id = req.params.id;

    let response = `No user with id ${id}`;
    for (const user of users) {
        if (parseInt(id, 10) === user.id) {
            response = `${id} is following ${user.following}`;
            break;
        }
    }
    res.status(200).send(response);
});

app.put('/users/:Uid/follow/:Fid', (req, res) => {
    const Uid = req.params.Uid;
    const Fid = req.params.Fid;
    let updatedFollowers = []

    for (const user of users) {
        if (parseInt(Uid, 10) === user.id) {
            const index = users.indexOf(user);
            const oldFollows = users[index].following;
            updatedFollowers = oldFollows;
            updatedFollowers.push(parseInt(Fid, 10));
            break;
        }
    }
    res.status(200)
        .send(`${Uid} now follows ${Fid}\nFollowers: ${updatedFollowers}`);
});

app.put('/users/:Uid/unfollow/:Fid', (req, res) => {
    const Uid = req.params.Uid;
    const Fid = req.params.Fid;
    let response = `${Uid} does not follow ${Fid}`;

    for (const user of users) {
        if (parseInt(Uid, 10) === user.id) {
            const index = users.indexOf(user);
            const follows = users[index].following;
            if (follows.indexOf(parseInt(Fid, 10)) != -1) {
                follows.splice(follows.indexOf(parseInt(Fid, 10)))
                response = `${Uid} unfollowed ${Fid}\nFollowing: ${follows}`
            }
            break;
        }
    }
    res.status(200)
        .send(response);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());


//GET ALL ACCOUNTS
server.get('/api/accounts', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.json(accounts)
            
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to get accounts" })
        })
})

//GET ACCOUNT BY ID
server.get('/api/accounts/:id', (req, res) => {
    db('accounts').where({ id: req.params.id })
        .then(account => {
            res.json(account)
        })
        .catch(err => {
            res.status(500).json({ message: "Failed to get account." })
        })
})

//ADD ACCOUNT
server.post('/api/accounts', (req, res) => {
    const newAccount = { name: req.body.name, budget: req.body.budget }
    db('accounts').insert(newAccount)
        .then(id => {
            db('accounts').where({ id: id[0] })
                .then(account => {
                    res.json({message: "Account was created successfully", account: account})
                })
                .catch(err => {
                    res.json({ message: "There was an error fetching this account." })
                })
        })
        .catch(err => {
            res.json({ message: "There was an error creating this account." })
        })
})

//DELETE ACCOUNT
server.delete('/api/accounts/:id', (req, res) => {
    db('accounts').where({ id: req.params.id }).del()
        .then(count => {
            if(count > 0) {
                res.json({ message: "Account was deleted successfully" })
            } else {
                res.json({ message: "Could not find an account with this ID" })
            }
        })
        .catch(() => {
            res.status(500).json({ message: "There was an error removing this account." })
        })
})

//UPDATE ACCOUNT
server.put('/api/accounts/:id', (req, res) => {
    db('accounts').where({ id: req.params.id }).update({ name: req.body.name, budget: req.body.budget })
        .then(count => {
            if(count > 0) {
                res.json({ message: "Account was updated successfully" })
            } else {
                res.json({ message: "Could not find an account with this ID" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error updating this account." })
        })
})

module.exports = server;

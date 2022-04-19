import * as users from '../models/user.server.model';
import Logger from '../../config/logger';
import {Request, Response} from "express";


const list = async (req: Request, res: Response) : Promise<void> => {
    Logger.http('GET all users');
    try {
        const result = await users.getAll();
        res.status(200).send(result);
    } catch (err) {
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

const read = async (req: Request, res: Response) : Promise<void> =>
{
    Logger.http(`GET single user id: ${req.params.id}`)
    const id = req.params.id;
    try {
        const result = await users.getOne( parseInt(id, 10) );
        if( result.length === 0 ){
            res.status( 404 ).send('User not found');
        } else {
            res.status( 200 ).send( result[0] );
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR reading user ${id}: ${ err }`
        );
    }
};

const create = async (req: Request, res: Response) : Promise<void> => {
    Logger.http(`POST create a user with username:
${req.body.username}`)
    if (! req.body.hasOwnProperty("username")){
        res.status(400).send("Please provide username field");
        return
    }
    const username = req.body.username;
    try {
        const result = await users.insert( username );
        res.status( 201 ).send({"user_id": result.insertId} );
    } catch( err ) {
        res.status(500).send(`ERROR creating user ${username}: ${
            err}`);
    }
};

const update = async (req:Request, res:Response) : Promise<any> => {
    Logger.http(`PUT update user id: ${req.body.id} username with ${req.body.username}`);
    if (! req.params.hasOwnProperty("id")){
        res.status(400).send('Please provide id field');
        return
    }

    if (! req.body.hasOwnProperty("username")) {
        res.status(400).send('Please provide a non-empty username field')
        return
    }

    const userId = req.params.id;
    try {
        const idResult = await users.getOne( parseInt(userId, 10) );
        if( idResult.length === 0 ){
            res.status( 404 ).send('User not found');
        } else {
            const newUsername = req.body.username;
            try {
                const result = await users.alter(parseInt(userId, 10), newUsername);
                res.status(200).send(`User ${userId}'s username updated to ${newUsername}`)
            } catch (err) {
                res.status(500).send(`ERROR updating user id: ${userId} username to ${newUsername}: ${
                    err}`);
            }
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR reading user ${userId}: ${ err }`
        );
    }

};

const remove = async (req:Request, res:Response) : Promise<any> => {
    Logger.http(`DELETE user with id: ${req.params.id}`);
    const id = req.params.id;
    try {
        const getOneResult = await users.getOne( parseInt(id, 10) );
        if( getOneResult.length === 0 ){
            res.status( 404 ).send('User not found');
        } else {
            const result = await users.remove(parseInt(id, 10));
            res.status(200).send(`User ${id} removed from database`)
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR deleting user ${id}: ${ err }`
        );
    }
};

export {list, create, read, update, remove}
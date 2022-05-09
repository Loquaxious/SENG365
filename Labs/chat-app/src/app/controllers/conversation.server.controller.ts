import * as conversations from '../models/conversation.server.model';
import Logger from '../../config/logger';
import {Request, Response} from "express";

const list = async (req:Request, res:Response): Promise<void> => {
    Logger.http(`GET all conversations`);
    try {
        const result = await conversations.getAll();
        res.status( 200 ).send( result );
    } catch ( err ) {
        res.status( 500 ).send(`Error getting conversations ${err}`);
    }
}

const create = async (req:Request, res:Response): Promise<void> => {
    Logger.http(`POST create a conversation with name ${req.body.convo_name}`);
    const convo_name = req.body.convo_name;
    try {
        const result = await conversations.insert(convo_name);
        res.status( 201 ).send({"convo_id": result.insertId});
    } catch (err) {
        res.status( 500 ).send(`Error creating conversation ${err}`);
    }
}

const read = async  (req:Request, res:Response): Promise<void> => {
    Logger.http(`GET single conversation id: ${req.params.id}`)
    try {
        const id = parseInt(req.params.id, 10);
        const result = await conversations.getOne(id);
        if (result.length === 0){
            res.status(404).send(`Conversation not found`);
        } else {
            res.status(200).send(result[0]);
        }
    } catch ( err ) {
        res.status(500).send(`Error reading conversation ${req.params.id}: ${err}`);
    }
}

const update = async (req:Request, res:Response): Promise<void> => {
    Logger.http(`PATCH sing conversation id: ${req.params.id}`);
    const convo_name = req.body.convo_name;
    try {
        const id = parseInt(req.params.id, 10);
        const resultGet = await conversations.getOne(id);
        if(resultGet.length === 0) {
            res.status(404).send(`Conversation not found`);
        } else {
            const resultAlter = await conversations.alter(id, convo_name);
            res.status(200).send(`Conversation updated!`);
        }
    } catch (err) {
        res.status(500).send(`ERROR updating conversation ${req.params.id}: ${err}`);
    }
}

const remove = async(req:Request, res:Response):Promise<void> => {
    Logger.http(`DELETE conversation id: ${req.params.id}`);
    try {
        const id = parseInt(req.params.id, 10);
        const resultGet = await conversations.getOne(id);
        if( resultGet.length === 0 ){
            res.status( 404 ).send('Conversation not found');
            return
        } else {
            const resultDelete = await conversations.remove(id);
            res.status( 200 ).send( 'Conversation deleted!' );
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR deleting conversation ${req.params.id}: ${ err }` );
    }
}

export { list, create, read, update, remove }
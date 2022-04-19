import * as conversations from '../models/conversations.server.model';
import Logger from '../../config/logger';
import {Request, Response} from "express";

const list = async (req: Request, res: Response) : Promise<void> => {
    Logger.http('GET all conversations');
    try {
        const result = await conversations.getAll();
        res.status(200).send(result);
    } catch (err) {
        res.status(500)
            .send(`ERROR getting conversations ${err}`);
    }
};

const read = async (req: Request, res: Response) : Promise<void> =>
{
    Logger.http(`GET single conversation id: ${req.params.id}`)
    const id = req.params.id;
    try {
        const result = await conversations.getOne( parseInt(id, 10) );
        if( result.length === 0 ){
            res.status( 404 ).send('Conversation not found');
        } else {
            res.status( 200 ).send( result[0] );
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR reading conversation ${id}: ${ err }`
        );
    }
};

const create = async (req: Request, res: Response) : Promise<void> => {
    Logger.http(`POST create a conversation with convo_name:
${req.body.convo_name}`)
    if (! req.body.hasOwnProperty("convo_name")){
        res.status(400).send("Please provide convo_name field");
        return
    }
    const convoName = req.body.convo_name;
    try {
        const result = await conversations.insert( convoName );
        res.status( 201 ).send({"convo_id": result.insertId} );
    } catch( err ) {
        res.status(500).send(`ERROR creating conversation ${convoName}: ${
            err}`);
    }
};

const update = async (req:Request, res:Response) : Promise<any> => {
    Logger.http(`PUT update conversation id: ${req.body.id}'s conversation name with ${req.body.convo_name}`);
    if (! req.params.hasOwnProperty("id")){
        res.status(400).send('Please provide id field');
        return
    }

    if (! req.body.hasOwnProperty("convo_name")) {
        res.status(400).send('Please provide a non-empty conversation name field')
        return
    }

    const convoId = req.params.id;
    try {
        const idResult = await conversations.getOne( parseInt(convoId, 10) );
        if( idResult.length === 0 ){
            res.status( 404 ).send('Conversation not found');
        } else {
            const newConvoName = req.body.convo_name;
            try {
                const result = await conversations.alter(parseInt(convoId, 10), newConvoName);
                res.status(200).send(`Conversation ${convoId}'s conversation name updated to ${newConvoName}`)
            } catch (err) {
                res.status(500).send(`ERROR updating conversation id: ${convoId} conversation name to ${newConvoName}: ${
                    err}`);
            }
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR reading conversation ${convoId}: ${ err }`
        );
    }

};

const remove = async (req:Request, res:Response) : Promise<any> => {
    Logger.http(`DELETE conversation with id: ${req.params.id}`);
    const id = req.params.id;
    try {
        const getOneResult = await conversations.getOne( parseInt(id, 10) );
        if( getOneResult.length === 0 ){
            res.status( 404 ).send('Conversation not found');
        } else {
            const result = await conversations.remove(parseInt(id, 10));
            res.status(200).send(`Conversation ${id} removed from database`)
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR deleting conversation ${id}: ${ err }`
        );
    }
};

export {list, create, read, update, remove}
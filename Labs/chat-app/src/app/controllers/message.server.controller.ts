import * as messages from '../models/message.server.model';
import * as conversations from '../models/conversation.server.model';
import Logger from '../../config/logger'
import {Request, Response} from "express";

const list = async (req:Request, res:Response) : Promise<void> => {
    Logger.http(`GET all messages from conversation ${req.params.id}`)
    const convoId = req.params.id
    try {
        const resultConversations = await conversations.getOne(parseInt(convoId, 10));
        if( resultConversations.length === 0 ){
            res.status( 404 ).send('Conversation not found');
        } else {
            const resultMessages = await messages.getAll(parseInt(convoId, 10))
            res.status( 200 ).send( resultMessages );
        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR getting conversations ${ err }` );
    }
};

const create = async (req:Request, res:Response) : Promise<void> => {
    Logger.http(`POST create a message for conversation ${req.params.id}`)
    try {
        const convoId = parseInt(req.params.id, 10);
        const userId = parseInt(req.body.user_id, 10);
        const message = req.body.message;
        const resultConversations = await conversations.getOne(convoId);
        if( resultConversations.length === 0 ){
            res.status( 404 ).send('Conversation not found');
        } else {
            const result = await messages.insert(convoId, userId, message);
            res.status( 201 ).send( {"message_id": result.insertId} );
        }
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR creating message ${ err }` );
    }
};

const read = async (req:Request, res:Response) : Promise<void> => {
    Logger.http(`GET single message id: ${req.params.mid}`)
    try {
        const convoId = parseInt(req.params.id, 10);
        const messageId = parseInt(req.params.mid, 10);
        const result = await messages.getOne(convoId, messageId);
        if( result.length === 0 ){
            res.status( 404 ).send('Message not found');
        } else {
            res.status( 200 ).send( result[0] );
        }
    } catch( err ) {
        res.status( 500 ).send( `ERROR reading message ${req.params.mid}: ${ err }` );
    }
};

export { list, create, read }
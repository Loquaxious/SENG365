import { getPool } from "../../config/db";
import Logger from "../../config/logger";
import {ResultSetHeader} from "mysql2";

const getAll = async () : Promise<Conversation[]> => {
    Logger.info('Getting all conversations from the database');
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_conversations';
    const [rows] = await conn.query(query);
    conn.release();
    return rows;
};

const getOne = async (id: number) : Promise<Conversation[]> => {
    Logger.info(`Getting conversation ${id} from the database`);
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_conversations where convo_id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
};

const insert = async (convoName: string) : Promise<ResultSetHeader> => {
    Logger.info(`Adding conversation ${convoName} to the database`);
    const conn = await getPool().getConnection();
    const query = 'insert into lab2_conversations (convoName) values ( ? )';
    const [result] = await conn.query(query, [convoName]);
    conn.release();
    return result;
};


const alter = async (id: number, convoName: string) : Promise<ResultSetHeader> => {
    Logger.info(`Updating conversation id: ${id}'s conversation name to ${convoName}`);
    const conn = await  getPool().getConnection();
    const query = 'update lab2_conversations set convoName = ? where convo_id = ?'
    const result = await conn.query(query, [convoName, id]);
    conn.release();
    return result;
};

const remove = async (id: number) : Promise<Conversation[]> => {
    Logger.info(`Removing conversation id: ${id} from the database`);
    const conn = await  getPool().getConnection();
    const query = 'delete from lab2_conversations where convo_id = ?';
    const [result] = await conn.query( query, [id] );
    conn.release();
    return result
};

export {getAll, getOne, insert, alter, remove}
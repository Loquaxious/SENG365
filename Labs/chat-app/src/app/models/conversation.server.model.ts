import {getPool} from "../../config/db";
import Logger from "../../config/logger";

const getAll = async ():Promise<any> => {
    Logger.info(`Getting all conversations from the database`);
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_conversations';
    const [ rows ] = await conn.query( query );
    conn.release();
    return rows;
}

const getOne = async (id: number): Promise<any> => {
    Logger.info(`Getting conversation ${id} from the database`);
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_conversations where convo_id = ?';
    const [ rows ] = await conn.query( query, [ id ] );
    conn.release();
    return rows;
}

const insert = async (convoName: string) : Promise<any> => {
    Logger.info(`Adding conversation ${convoName} to the database`)
    const conn = await getPool().getConnection();
    const query = 'insert into lab2_conversations (convo_name) values ( ? )';
    const [ result ] = await conn.query( query, [ convoName ] );
    await conn.release();
    return result;
};

const alter = async (id: number, convoName: string) : Promise<any> => {
    Logger.info(`Updating conversation ${id} to ${convoName}`)
    const conn = await getPool().getConnection();
    const query = 'UPDATE lab2_conversations SET convo_name=? WHERE convo_id=?';
    const [ result ] = await conn.query( query, [ [convoName], [id] ] );
    await conn.release();
    return result;
};

const remove = async (id: number) : Promise<any> => {
    Logger.info(`Deleting conversation ${id}`)
    const conn = await getPool().getConnection();
    const query = 'DELETE FROM lab2_conversations WHERE convo_id=?';
    const [ result ] = await conn.query( query, [ id ] );
    await conn.release();
    return result;
};

export { getAll, getOne, insert, alter, remove }
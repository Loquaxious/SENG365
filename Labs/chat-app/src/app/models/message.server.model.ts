import { getPool } from "../../config/db";
import Logger from "../../config/logger";

const getAll = async (id: number) : Promise<any> => {
    Logger.info(`Getting all messages from the database`);
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_messages where convo_id=?';
    const [ rows ] = await conn.query( query, [id] );
    await conn.release();
    return rows;
};

const getOne = async (convoId: number, messageId:number) : Promise<any> => {
    Logger.info(`Getting message ${messageId} from the database`);
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_messages where convo_id=? and message_id=?';
    const [ rows ] = await conn.query( query, [ convoId, messageId ] );
    await conn.release();
    return rows;
};

const insert = async (convoId: number, userId:number, message: string) : Promise<any> => {
    Logger.info(`Adding message ${message} to conversation ${convoId} to the database`);
    const conn = await getPool().getConnection();
    const query = 'insert into lab2_messages (convo_id, user_id, message) values ( ? )';
    const [ result ] = await conn.query( query, [[convoId, userId, message]] );
    await conn.release();
    return result;
};

export { getAll, getOne, insert }
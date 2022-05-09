import {Express} from "express";
import * as conversations from '../controllers/conversation.server.controller';

module.exports = ( app: Express ) => {
    app.route('/api/conversations')
        .get( conversations.list )
        .post( conversations.create );

    app.route('/api/conversations/:id')
        .get( conversations.read )
        .put( conversations.update )
        .delete( conversations.remove );
}
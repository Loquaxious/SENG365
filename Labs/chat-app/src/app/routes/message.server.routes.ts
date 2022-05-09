import {Express} from "express";
import * as messages from '../controllers/message.server.controller';

module.exports = ( app: Express ) => {
    app.route('/api/conversations/:id/messages')
        .get( messages.list )
        .post( messages.create );

    app.route('/api/conversations/:id/messages/:mid')
        .get( messages.read );
}
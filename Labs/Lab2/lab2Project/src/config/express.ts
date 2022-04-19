import express from "express";
import bodyParser from "body-parser"

export default () => {
    const app = express();
    app.use( bodyParser.json() );
    require('../app/routes/users.server.routes.js') (app);
    require('../app/routes/converstations.server.routes.js') (app);
    return app;
};
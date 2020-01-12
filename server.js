const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = 5000;
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const classesRouter = require('./routes/classes');
const elementsRouter = require('./routes/element');
const absencesRouter = require('./routes/absence');
const sessionsRouter = require('./routes/session');




app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://root:root@theshadow-ohacd.mongodb.net/gestion?retryWrites=true&w=majority',{ useNewUrlParser: true,useCreateIndex:true} );
const connection = mongoose.connection;

connection.once('open',function(){
    console.log("MongoDB database connection established successfully");
});

app.use('/users',usersRouter);
app.use('/classes',classesRouter);
app.use('/auth',authRouter);
app.use('/elements',elementsRouter);
app.use('/absences',absencesRouter);
app.use('/sessions',sessionsRouter);

 
app.listen(PORT,function(){
    console.log("Server is running on Port :"+ PORT);
});
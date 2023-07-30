const express = require("express")
const app = express()
const mongoose = require("mongoose");
var cors = require('cors');
const bcrypt = require('bcrypt')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser')


app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser('thisIsSecret'))

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true // Enable sending cookies
}));

/*************************** Session store in database ********************************/

let sessionStore = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/quiz',
    collection: 'sessions'
});

// creating cookie for passport

app.use(session({
    secret: 'thisIsSecret',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
        expires: 1000*60*60*24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// global middleware

app.use((req,res,next)=>{

    res.locals.session = req.session;
    res.locals.user = req.user;
    next();

})

/************** passport config ******************/



////////// database Connection ////////////////


mongoose.connect('mongodb://localhost:27017/quiz', {useNewUrlParser: true });

const connection=mongoose.connection;

connection.once('open',(err) => {

    if(!err){
    console.log('Database connected');
    }
    else{
        console.log('Database connection failed');
    }

});

const Schema = mongoose.Schema;




/******** creating quizzes collection *****/

const quizSchema = new Schema({
    title: String,
    description: String,
    toughness: String,
    questions: []
});

const Quiz = mongoose.model('Quiz', quizSchema);

/******** creating results collection to store results of all students *****/

const resultsSchema = new Schema({
    quizId: String,
    quizTitle: String,
    userId: String,
    username: String,
    email: String,
    correct: Number,
    inCorrect: Number,
    unAttempted: Number,
    totalMarks: Number,
    shortlisted: Boolean,
    date: String
})

const Result = mongoose.model('Result', resultsSchema);


/******** creating users collection to store registered users *****/

const usersSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "student"}
})

const User = mongoose.model('user', usersSchema);

// Passport configuration


passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
    const user = await User.findOne({email:email});
    if(!user){
        return done(null, false, {message: 'No user found with this email'});
    } else {
        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {message: 'logged in successfully'});
            } else {
                return done(null, false, {message: 'Invalid username or password'});
            }
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong'});
        })
    }
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
})




// GET Routes


app.get("/quizzes", (req, res)=>{

    try{
        Quiz.find({}, (err, result)=>{
            if(err){
                throw err
            }
            res.json(result)
        })
    } catch (err){
        res.status(500).json({err: err.message})
    }
    
    
})

app.get("/quizzes/:quizId", (req, res)=>{

    if(!req.isAuthenticated()){
        return res.status(401).json({auth: false})
    }

    try{
        Quiz.findById(req.params.quizId, (err, result)=>{
            if(err){
                res.status(500).json({message: err})
            }
            res.json(result)
        })
    } catch (err){
        res.status(500).json({message: err.message})
    }
    

})

// for loading admin page 

app.get("/results", (req, res)=>{

    try{
        let pageRequestedUserId = req.session.passport.user;

        User.find({_id: pageRequestedUserId}, (err, result)=>{

            if(result.role === 'student'){
                res.status(401).json({err: "bad request"})
            }
            else{

                Result.find({}, (err, result)=>{

                    if(err){
                        throw err
                    }
                    res.json(result)
                })
                    

            }

        })
    } catch(err){
        res.status(500).json({err: err.message})
    }
    
})

//for results page

app.get("/admin/results/:quizId", (req, res)=>{

    let pageRequestedUserId = req.session.passport.user;

    User.find({_id: pageRequestedUserId}, (err, result)=>{

        if(result.role === 'student'){
            res.redirect("/")
        }

    })

    Result.find({quizId: req.params.quizId}, (err, result)=>{
        res.render("results", {results: result})
    })

})



// POST Routes

// creating a user

app.post('/api/user', async (req, res)=>{

    try {
        const body = req.body;
        const hashedPassword = await bcrypt.hash(body.password, 10);
      
        const result = await User.findOne({ email: body.email }).exec();
      
        if (result) {
          throw new Error("User already exists, Please login");
        } else {
          const user = new User({
            username: body.username,
            email: body.email,
            password: hashedPassword,
            role: body.role,
          });
      
          user.save((err, user)=>{
            if(err){
                throw new Error("Something went wrong")
            }
          });
          res.status(200).json({ message: "User added successfully" });
        }
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
      
})






                                        /*************** API's For Results ************/





// receiving and storing student results in database in results collection

app.post("/submit/result", (req, res)=>{

    const body = req.body
    
    const result = new Result({
        quizId: body.quizId,
        quizTitle: body.quizTitle,
        userId: body.userId,
        username: body.username,
        email: body.email,
        correct: body.correct,
        inCorrect: body.inCorrect,
        unAttempted: body.unAttempted,
        totalMarks: body.totalMarks,
        shortlisted: body.shortlisted,
        date: body.date
    })

    result.save().then((savedResult)=>{

        if(!savedResult){
            res.status(500).json({message: 'Something went wrong'})
        }
        else{
            res.status(200).json({message: 'Results submitted successfully'})
        }
    })

})


// sending result of a specific quiz by using quiz id

app.get("/api/results/:quizId", async (req, res) => {

    if(!req.isAuthenticated()){
        return res.status(401).json({auth: false})
    }
    try {
      const resultPromise = Result.find({ quizId: req.params.quizId }).exec();
      const quizPromise = Quiz.find({ _id: req.params.quizId }).exec();
  
      const [result, quiz] = await Promise.all([resultPromise, quizPromise]);
  
      console.log(quiz[0]);

      const data = {
        results: result,
        quiz: quiz[0]
      };
  
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  

                                            /*************** API's For Admin ************/



// receiving data and creating a new quiz

app.post("/api/admin/quiz", (req, res)=>{

    const body = req.body
    const quiz = new Quiz({

        category: body.category,
        questions: body.questionsArray

    })

    quiz.save().then((savedQuiz)=>{
        res.send({ message: 'Quiz created successfully', quizId: quiz._id})
    })

})

// update an entire quiz by using the quiz id

app.put("/api/admin/quizzes/:id", (req, res)=>{

    Quiz.findOneAndReplace({_id: req.params.id}, req.body, {upsert: true}, (err, doc)=>{

        if(err){
            res.send({err: err})
        }
        else{
            res.send({message: "quiz updated successfully"})
        }

    })

})

// deleting a specific quiz by using its id

app.delete("/api/admin/quizzes/:id", (req, res)=>{

    Quiz.findByIdAndRemove(req.params.id, (err, deletedDoc)=>{

        if(err){
            res.send({err: err})
        }
        else{
            res.send({message: "Deleted successfully"})
        }

    })

})

// Adding new question to the questions array in the database

app.post("/api/admin/questions/:quizId", (req, res)=>{

    Quiz.findOneAndUpdate({_id: req.params.quizId },  { $push: { questions: req.body } }, (err)=>{

        if(err){
            res.send({err: err})
        } else{
            res.send({message: "Successfully added the question"})
        }

    })

})

// Updating a specific question by using quizId and question id 

app.put("/api/admin/questions/:quizId/:qid", (req, res)=>{

    Quiz.findOneAndUpdate(
        {_id: req.params.quizId,'questions.qid': parseInt(req.params.qid)}, 
        {$set: {
            'questions.$.ques': 'this question is fucked',
            'questions.$.options': ['fuck1', 'fuck2', 'fuck3', 'fuck4'],
            'questions.$.crctOpIndex': 0
        }} ,
        (err, result)=>{
            
            if(err){
                res.send({err: err})
            } else{
                res.send({message: 'Question updated successfully'})
            }
        })

})

// deleting a specific question

app.delete("/api/admin/questions/:quizId/:qid", (req, res)=>{

    Quiz.findOneAndUpdate({_id: req.params.quizId }, { $pull: {'questions': {'qid': parseInt(req.params.qid) } } }, {safe: true, multi:true}, (err, result)=>{

        if(err){
            res.send({err: err})
        } else{
            res.send({message: 'Question deleted successfully'})
        }

    } )

})

                                        /*************** API's For Instructor ************/


// sending all the results of all quizzes

app.get("/api/instructor/results", (req, res)=>{

    Result.find({}, (err, result)=>{
        res.json(result)
    })

})

// sending results of specific quiz

app.get("/results/:userId", (req, res)=>{

    Result.find({ userId: req.params.userId }, (err, result)=>{
        if(err){
            res.status(500).json({message: err})
        } else {
            res.json(result)
        }
    })
    

})



                                        /*************** API's For Login And Registration ************/



// Delete a specific user by user id

app.delete('/api/users/:userId', (req, res)=>{
    
    User.findOneAndDelete({_id: req.params.userId}, (err, result)=>{

        if(result){
            res.json({message: 'Deleted successfully'})
        } 
        else {
            res.json({err: 'User does not exist'})
        }
        if(err){
            res.json({err: err})
        }

    })

})






app.post("/login", (req, res, next)=>{

        passport.authenticate('local', (err, user, info) => {
            if(err){
                console.log(err);
                return res.status(500).json({message: info.message})
            }
            if(!user){
                console.log(info.message);
                return res.status(500).json({message: info.message})
            } else {
                req.logIn(user, (err) => {
                    if(err){
                        console.log(err);
                        return res.status(500).json({message: info.message})
                    } else {
                        res.cookie('user', {_id: user._id, username: user.username, email: user.email, role: user.role})
                        res.json({message : "success", user: {_id: user._id, username: user.username, email: user.email, role: user.role}})
                    }
                })
            }
        })(req, res, next)
})






app.post("/logout", (req, res)=>{

    req.logout((err)=>{

        if(err){
            res.status(500).json({message: err})
        }
        res.send('Successfully logged out')
        

    })

})













app.listen(4000, ()=>{
    console.log(`server started at port 3000`);
})



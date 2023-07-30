import React, {useEffect, useRef, useState, useContext} from "react"
import { useNavigate, useParams } from "react-router-dom"
import Success from "../components/Success"
import Timer from "../components/Timer"
import axios from "axios"
import userContext from "../userContext"
import Cookies from 'universal-cookie'
import { toast } from "react-hot-toast"

const Quiz = ()=>{

    const {quizId} = useParams()
    const [quiz, setQuiz] = useState(null)
    let [question, setQuestion] = useState(null)
    const numberRef = useRef(0)
    const answersRef = useRef({})
    const [completed, setCompleted] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [answered, setAnswered] = useState(0)
    const {user, setUser} = useContext(userContext)
    const [screenConfirm, setScreenConfirm] = useState(false)

    const navigate = useNavigate()
    const cookies = new Cookies()
    const resultsRef = useRef({})
    
    useEffect(()=>{
        const confirm = window.confirm('You are about to enter Fullscreen Mode')
        if(confirm){
            setScreenConfirm(true)
        } else {
            navigate('/')
        }
    }, [])

    if(screenConfirm){
        if (user) {
            const element = document.documentElement; // Get the root element of the document
          
            if (element.requestFullscreen) {
                element
                .requestFullscreen()
                .catch((err) => console.error("Error attempting to enable full-screen mode:", err));
            } else if (element.webkitRequestFullscreen) {
                element
                .webkitRequestFullscreen()
                .catch((err) => console.error("Error attempting to enable full-screen mode:", err));
            } else if (element.msRequestFullscreen) {
                element
                .msRequestFullscreen()
                .catch((err) => console.error("Error attempting to enable full-screen mode:", err));
            }
        }
    }
        

    useEffect(()=>{
        axios.get(`http://localhost:4000/quizzes/${quizId}`, { withCredentials: true })
        .then(res => {
            setQuiz(res.data)
            setQuestion(res.data.questions[0])
        })
        .catch(err => {
            if(err.response.status === 401) {
                cookies.remove('user')
                setUser(null)
                console.log(err);
                navigate('/login')
            }
            else {
                console.log(err.response.data)
                toast.error('Something went wrong')
            };
        })

    }, [quizId])


    function handleNavigate(type){
        if(type === "next"){
            if(numberRef.current < quiz.questions.length-1){
                setCompleted(false)
                setQuestion(quiz.questions[++numberRef.current])
            } 
            if(numberRef.current === quiz.questions.length -1){
                setCompleted(true)
            }
        } else if(type === "prev"){
            if(numberRef.current>0){
                setCompleted(false)
                setQuestion(quiz.questions[--numberRef.current])
            }
            
        }
        
        
    }

    function handleAnswerChange(event) {
        const { name, value } = event.target;
        answersRef.current = {...answersRef.current, [name]: value}
        console.log(answersRef.current);
        // for showing how many answered and how many remaining
        setAnswered(Object.keys(answersRef.current).length)
    }

    useEffect(() => {
        if(quiz){
            if (answersRef.current[question.qid]) {
                const selectedOption = answersRef.current[question.qid];
                const radioInput = document.getElementById(selectedOption);
                if (radioInput) {
                  radioInput.checked = true;
                }
              }
        }
    }, [question, quiz]);

    function handleSubmit(){
        const answers = answersRef.current;
        const questions = quiz.questions;
        let correct=0, incorrect=0, unAttempted=0, shortlisted;

        questions.forEach((question)=>{
            if(answers[question.qid]){
                if(question.crctOpIndex === parseInt(answers[question.qid])){
                    correct++
                } else {
                    incorrect++
                }
            } else {
                unAttempted++
            }
        })

        
        if(correct >= quiz.qualifyMarks ){
            shortlisted = true
        }
        console.log("qualify marks: ", quiz.qualifyMarks);
        const results = {
            correct,
            incorrect,
            unAttempted,
            shortlisted
        }

        resultsRef.current = results

        const date= new Date()
        const day = (date.getDate()).toString()
        const month = (date.getMonth()+1).toString()

        const dateString = (day.length===1?('0'+day):day) +"/"+ (month.length===1?('0'+month):month) +"/"+ date.getFullYear()

        const data = {
            quizId: quizId,
            quizTitle: quiz.title,
            userId: user._id,
            username: user.username,
            email: user.email,
            correct: correct,
            inCorrect: incorrect,
            unAttempted: unAttempted,
            totalMarks: correct,
            shortlisted: shortlisted,
            date: dateString
        }

        axios.post('http://localhost:4000/submit/result', data)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err.data.message);
            toast.error('Something went wrong')
        })
        
        setSubmitted(true)
    }

    

    return(
        <>
            { screenConfirm? <div className="quiz-wrapper">
            { quiz? ( submitted? <Success results={resultsRef.current} /> : (
                <div>
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center" ,width: "100%", marginBottom: "1.5rem"}}>
                            <p>Answered: {answered}/{quiz.questions.length}</p>
                            <Timer handleSubmit={handleSubmit}/>
                        </div>
                        
                    <div className="question-div" >
                        
                        <h4 style={{marginBottom: "1.5rem"}}>Q{question.qid}. {question.ques}</h4>
                        
                            {
                                question.options.map((option, index)=>(

                                <div key={`${question.qid}-${index}`} className="option-wrap">
                                    <input value={index} onChange={(e)=>handleAnswerChange(e)} type="radio" name={question.qid} id={index} /> 
                                    <label htmlFor={index}>{option}</label> <br />
                                </div>
                                    
                                ))
                            }
                        
                        
                    </div>
                    <div className="navigate-btns">
                        <button disabled={numberRef.current === 0? true : false} id="prev-btn" onClick={()=>handleNavigate("prev")}>Previous</button>
                        <button disabled={numberRef.current === quiz.questions.length-1? true : false} id="next-btn" onClick={()=>handleNavigate("next")}>Next</button>
                        
                    </div>
                    <div className="submit">
                    {
                        completed? <button style={{display: "block" ,margin: "auto", marginTop: "1rem"}} onClick={handleSubmit}>Submit</button> : ''
                    }
                    </div>
                </div>
                )
            ) : 'Loading...' 
            }
            </div> 
            : ''}
        </>
                    
    )
}

export default Quiz;
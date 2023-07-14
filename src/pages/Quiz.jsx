import React, {useEffect, useRef, useState} from "react"
import { useLocation } from "react-router-dom"
import Success from "../components/Success"


const Quiz = ()=>{

    const location = useLocation()
    const quizRef = useRef(null)
    quizRef.current = location.state

    let [question, setQuestion] = useState(quizRef.current.questions[0])
    const numberRef = useRef(0)
    const answersRef = useRef({})
    const [completed, setCompleted] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [answered, setAnswered] = useState(0)
    const resultsRef = useRef({})

    function handleNavigate(type){

        if(type === "next"){
            if(numberRef.current < quizRef.current.questions.length-1){
                setCompleted(false)
                setQuestion(quizRef.current.questions[++numberRef.current])
            } 
            if(numberRef.current === quizRef.current.questions.length -1){
                setCompleted(true)
            }
        } else if(type === "prev"){
            if(numberRef.current>0){
                setCompleted(false)
                setQuestion(quizRef.current.questions[--numberRef.current])
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
        if (answersRef.current[question.qid]) {
          const selectedOption = answersRef.current[question.qid];
          const radioInput = document.getElementById(selectedOption);
          if (radioInput) {
            radioInput.checked = true;
          }
        }
    }, [question]);

    function handleSubmit(){
        const answers = answersRef.current;
        const questions = quizRef.current.questions;
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

        const qualify = Math.ceil(questions.length * 0.6);
        if(correct >= qualify ){
            shortlisted = true
        }
        console.log("qualify marks: ", qualify);
        const results = {
            correct,
            incorrect,
            unAttempted,
            shortlisted
        }

        resultsRef.current = results

        setSubmitted(true)
    }

    return(
        <>
        
            {
                submitted? <Success results={resultsRef.current} /> : (
                <div className="quiz-wrapper">
                    <p style={{marginBottom: "2rem"}}>Answered: {answered}/{quizRef.current.questions.length}</p>
                <div className="question-div" >
                    
                    <h4 style={{marginBottom: "1.5rem"}}>Q. {question.ques}</h4>
                    
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
                    <button onClick={()=>handleNavigate("prev")}>Previous</button>
                    <button onClick={()=>handleNavigate("next")}>Next</button>
                    
                </div>
                <div className="submit">
                {
                    completed? <button style={{display: "block" ,margin: "auto", marginTop: "1rem"}} onClick={handleSubmit}>Submit</button> : ''
                }
                </div>

            </div>)

            }

        </>
                    
    )
}

export default Quiz;
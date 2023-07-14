import { useNavigate } from "react-router-dom";


const Quiz = ({quiz})=>{

    const navigate = useNavigate()
    function handleClick(quiz){
        navigate(`/quiz/${quiz._id}`, {state: quiz})
    }

    return(
        <>
            <div className="quiz-wrap">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <div>
                    <span>{quiz.toughness}</span> <br/>
                    <button onClick={(e)=> handleClick(quiz)}>Start Quiz</button>
                </div>
                
            </div>
        
        </>
    )
}

export default Quiz;
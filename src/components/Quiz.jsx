import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import userContext from "../userContext";

const Quiz = ({ quiz }) => {
  const navigate = useNavigate();
  const { user } = useContext(userContext);
  const quizRef = useRef(quiz); // Create a ref to hold the quiz object

  function handleClick() {
    if (user && user.role === "admin") {
      navigate(`/admin/results/${quiz._id}`);
    } else {
      navigate(`/quiz/${quiz._id}`, { state: quizRef.current }); // Use the ref value here
    }
  }

  
  return (
    <>
      <div className="quiz-wrap">
        <h3>{quiz.title}</h3>
        <p>{quiz.description}</p>
        <div>
          {user && user.role === "admin" ? (
            <button onClick={handleClick}>Show Results</button>
          ) : (
            <>
              <span>{quiz.toughness}</span> <br />
              <button onClick={() => {handleClick();} }>Start Quiz</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Quiz;

import React, {useEffect, useState} from "react";
import Quiz from "../components/Quiz";
import axios from "axios"
// import { useCookies } from 'react-cookie';

const Home = ()=>{

    // const [cookies] = useCookies(['user']);
    // const user = cookies.user;
    // console.log(user);

    const [quizzes, setQuizzes] = useState(null)

    useEffect(() => {
        axios.get("/quizzes")
        .then((res) => {
            setQuizzes(res.data)
        })
        .catch((err) => {
            console.log(err);
        });
        }, []);
      

    return(
        <>
            <div className="quizzes-wrapper">
                {
                   quizzes ? (
                    quizzes.map((quiz) => (
                      <Quiz
                        quiz = {quiz}
                        key={quiz._id}
                      />
                    ))
                  ) : (
                    <p>Loading quizzes...</p>
                  )
                    
                    
                }
                
            </div>
        </>
        
    )
}

export default Home;
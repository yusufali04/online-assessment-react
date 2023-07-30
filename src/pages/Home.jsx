import React, {useContext, useEffect, useState} from "react";
import Quiz from "../components/Quiz";
import axios from "axios";
import { toast } from "react-hot-toast";
import userContext from "../userContext";

const Home = ()=>{

    
    const [quizzes, setQuizzes] = useState(null)
    const {user} = useContext(userContext)

    useEffect(() => {
        axios.get("http://localhost:4000/quizzes")
        .then((res) => {
            setQuizzes(res.data)
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
            toast.error('Something went wrong')
        });
    }, []);
      

    return(
        <>  
            <h2 style={{width: '80%', margin: 'auto', marginBottom: '2rem'}}>{ !user || (user && user.role !== 'admin')? "Available Assessments" : "Currently Live Assessments"}</h2>
            
            
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
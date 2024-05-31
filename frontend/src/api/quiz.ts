import axios, { AxiosResponse } from "axios"
const api = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:8000',
 })

const login = (email : string, password : string) => {
    return new Promise((resolve,reject) => {
        api.post("/auth/login", {
            email: email,
            password: password
        }).then((response) => {
            resolve(response)
        }).catch((error) => {
            reject(error)
        })
    })
}

const getUser = () => { 
    return new Promise((resolve,reject) => {
        api.get("/auth/users/me/").then((response : AxiosResponse) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })

}


const logout = () => {
    return new Promise((resolve,reject) => {
        api.post("/auth/logout/").then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

export interface ReigsterProps { 
    username: string
    email: string,
    password: string,
    first_name: string,
    last_name: string

}

const register = ( data : ReigsterProps) => { 
    return new Promise((resolve,reject) => {
        api.post("/auth/register",{
            username: data.username,
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name
        }).then((response) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })

}
const quizHistory = (only_names : boolean = false) => {
    return new Promise((resolve,reject) => {
        api.get("/quiz/history",{
            params: {
                only_names: only_names
            }
        
        }).then((response : AxiosResponse) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}
const createQuiz = (quizTopic : string,noOfQuestions : number ) => {
    return new Promise((resolve,reject) => {
        api.get("/quiz",{
            params: {
                quiz_topic: quizTopic,
                no_of_questions: noOfQuestions
              }
        }).then((response : AxiosResponse) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}

const quizHistoryById = (quizId : string) => {
    return new Promise((resolve,reject) => {
        api.get(`/quiz/history/${quizId}`).then((response : AxiosResponse) => {
            resolve(response.data)
        }).catch((error) => {
            reject(error)
        })
    })
}



export { login,quizHistory,quizHistoryById, createQuiz, getUser ,logout ,register};
export default api;
import React, { useEffect, useState } from 'react'
import "./Homepage.css"
import { auth,provider } from '../confib'
import {signInWithPopup} from "firebase/auth";
import {useNavigate} from "react-router-dom"

export default function Homepage() {
    const navigate = useNavigate();
    const [user , setUser] = useState('')
    async function handleauth(){
        await signInWithPopup(auth,provider).then((data)=>{
            setUser(data.user.displayName)
            localStorage.setItem("username",data.user.displayName);
            localStorage.setItem("logo",data.user.photoURL)
            if (data.user.displayName.length >= 2) {
                navigate('/userdashboard');
              }
        })
    }
    useEffect(()=>{
        const username = localStorage.username;
        if (username) {
            setUser(username);
        }
    },[])
  return (
    <div 
    style={{
        display:'flex',
        width:'100%',
        height:'99vh',
        padding:'1%',
        boxSizing:"border-box",
        flexDirection:"column",
    }}
    >
        <nav
            style={{
                display:'flex',
                width:'100%',
                border:'2px solid White',
                borderRadius: "15px",
                padding:"1%",
                justifyContent:'space-between',
            }}
        >
            <span onClick={()=>navigate("/")}>Dashboard</span>
            <span onClick={()=>navigate("/userdashboard")}>VideoLib</span>
        </nav>
        <div className='homepageContent'
            style={{
                display:'flex',
                width:"100%",
                height:'80%',
                justifyContent:'center',
                alignItems:'center'
            }}
        >
             <div className='contentDiv'>
                   Hey, user Login to enable Web VideoLibrary where you add view and manage different video collection.
                  <h5> Sign in by Google authencation </h5>
                  <button 
                  style={{
                    backgroundColor:'#635994',
                    borderRadius:'10px',
                    padding:'1%',
                    display:"flex",
                    alignItems:'center',
                    gap:'5px'
                }}
                onClick={handleauth}
                    ><h1>G</h1>Google</button>
                    {user.length>= 2 &&<span>signed as {user} goto videolib</span>}
             </div>  
        </div>
    </div> 
  )
}

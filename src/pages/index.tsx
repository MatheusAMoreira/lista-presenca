import React, { useState, useEffect } from 'react';
import './styles.css';

import { Card, CardProps } from '../components/Card';

type GitProfile = {
  name: string;
  avatar_url: string; 
}

export function Home() {
  const [studentName, setStudentName] = useState("");
  const [students, setStudents] = useState<CardProps[]>([]);
  const [user, setUser] = useState<GitProfile>({} as GitProfile);
  const defaulHolder = "Entre com o seu nome e sobrenome";
  const [inputHolder, setinputHolder] = useState(defaulHolder);

  type border = {
    border: string,
  }

  const [inputBorder, setinputBorder] = useState<border>({} as border);

  const holderColor = {color: getComputedStyle(document.documentElement).getPropertyValue("--color-holder"),
  opacity: getComputedStyle(document.documentElement).getPropertyValue("--opacity-holder")};

  function setHolderColor(color:string, opacity:string){
    color: document.documentElement.style.setProperty('--color-holder', color);
    opacity: document.documentElement.style.setProperty('--opacity-holder', opacity);
  }

  function handleAddStudent() {
    const regEx = /^[A-Za-z]+\s[A-Za-z]+$/;
    const changeBorder = "red solid 4px"

    if(studentName == ""){

      setinputHolder(defaulHolder + " por favor!");
      setinputBorder({border: changeBorder});
      setHolderColor("red","1");

    }else if(regEx.test(studentName)){

    const newStudent = {
      name: studentName,
      time: new Date().toLocaleTimeString("pt-br", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    };

    setStudents(prevState => [...prevState, newStudent]);
    
    setStudentName("");
    setinputHolder("Presença confirmada 👍!");
    setinputBorder({border: "green solid 2px"});
    setHolderColor("green","1");

    }else  {

      setStudentName("");
      setinputHolder("Name inválido 👎!");
      setinputBorder({border: changeBorder});
      setHolderColor("red","1");

    }
    
  }


  useEffect(() => {
    async function fetchData() {
      const response = await fetch('https://api.github.com/users/matheusamoreira');
      const data = await response.json() as GitProfile; 

      setUser({
        name: data.name,
        avatar_url: data.avatar_url,
      });

    }

    fetchData();
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Lista de presença</h1>

        <div>
          <strong>Encarregado: {user.name}</strong>
          <img src={user.avatar_url} alt="foto da pessoa encarregada pela lista" />
        </div>
      </header>

      <input style={inputBorder} type="text" placeholder={inputHolder} value={studentName} onChange={e => 
        {setinputBorder({border: "none"}), setHolderColor("black","0.5"), setStudentName(e.target.value)}}/>

      <button type="button" onClick={handleAddStudent}>Confirmar presença</button>

      {
        students.map(student => (
          <Card
            key={student.time}
            name={student.name}
            time={student.time}
          />
        ))
      }
    </div>
  )
}
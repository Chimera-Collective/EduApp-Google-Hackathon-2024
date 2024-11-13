// import { useState } from 'react'
import './App.css'

import { db } from "./firebase/firebase";
import { getDoc, collection, doc } from 'firebase/firestore';

import InputList from './components/InputList'
import AddInput from './components/AddInput'
import { useEffect, useMemo, useState } from 'react';

function App() {
  const [inputsList, setInputsList] = useState([])
  
  const inputs: string[] = ["Cow", "milk", "noodle", "left", "right"]

  // const inputDataCollectionRef = collection(db, "input_data")
  const inpuDocRef = doc(db, "input", "1")
  
  useMemo (() => {
    const getInputs = async () => {
      
      try {
        const firstDoc = await getDoc(inpuDocRef)

        console.log("DOCUMENT:", firstDoc) 
      } catch (err) {
        console.log("ERROR:", err)
      }
    } 

    getInputs()
  }, [])


  return (
    <>
      <AddInput/>
      <InputList items={inputs}/>
    </>
  )
}

export default App

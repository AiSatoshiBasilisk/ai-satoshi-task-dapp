import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
   const [data, setData] = useState(null);
   const [error, setError] = useState(null);
   useEffect(() => {
     async function fetchData() {
        try {
             const { data: tasks, error } = await supabase.from('tasks').select('*');
            if (error) {
                setError(error);
              return;
            }
            setData(tasks)
            console.log(tasks)
         } catch (error) {
               setError(error);
            }
     }
    fetchData()
  }, []);

 if(error) {
  return (
   <div className="App">
      <h1>Task DApp</h1>
       <p>Error: {error.message}</p>
    </div>
  );
  }
 return (
    <div className="App">
      <h1>Task DApp</h1>
        {data ? (
            <div>
                <p>Data loaded, check the console</p>
           </div>
        ):(
            <p>Loading...</p>
        )}

    </div>
  );
}

export default App;
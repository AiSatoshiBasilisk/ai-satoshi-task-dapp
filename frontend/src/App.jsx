import React, {useEffect} from 'react';
import { supabase } from './supabaseClient';
import './App.css';

  function App() {
      useEffect(() => {
          async function fetchData() {
              const { data, error } = await supabase.from('tasks').select('*');
              if (error) {
                  console.error('Error fetching data:', error);
                  return;
              }
              console.log('Fetched data:', data);
          }
        fetchData();
      }, []);

    return (
      <div className="App">
        <h1>Task DApp</h1>
          <p>This is a test</p>
        </div>
      );
  }

export default App;
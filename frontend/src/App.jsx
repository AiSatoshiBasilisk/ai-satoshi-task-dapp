import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { supabase } from "./supabaseClient";
import './App.css';

function App() {
    const [profile, setProfile] = useState(null);
    const [tasks, setTasks] = useState([]);

   async function connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const nonce = await supabase.auth.generateNonce();

          const message = `Sign this message to confirm you own the wallet address. Nonce: ${nonce}`;
          const signature =  await signer.signMessage(message);
            const { data, error } = await supabase.auth.signInWithCustomToken({
                    token: signature,
              });

            if(error) {
               console.log("Error signing in", error);
               return;
            }

            console.log("user signed in", data.user);
            await getUserProfile();
            await getTasks();

          } catch (error) {
            console.error('Error connecting wallet:', error);
          }
        } else {
          console.error('MetaMask not detected');
        }
    }

    async function getUserProfile() {
      const { data: profile, error } = await supabase.from('users').select('*').eq('id', supabase.auth.user().id).single();
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
      console.log('User profile:', profile);
        setProfile(profile);
    }

   async function getTasks() {
     const { data, error } = await supabase.functions.invoke('getTasks')
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

    console.log('Tasks:', data.data);
       setTasks(data.data);
    }

   useEffect(()=> {
      if(supabase.auth.user()) {
          getUserProfile();
          getTasks();
      }
  },[])

    return (
        <div className="App">
          <h1>Task DApp</h1>
          <button onClick={connectWallet}>Connect Wallet</button>

          {profile && (
            <div id="profile">
              <p>User ID: {profile.id}</p>
              <p>User Email: {profile.email || 'Not available'}</p>
              <p>User Address: {profile.wallet_address || 'Not available'}</p>
            </div>
          )}

          <h2>Available Tasks</h2>
           <ul id="tasks">
               {tasks.map((task) => (
                   <li key={task.id}>
                   <h3>{task.title}</h3>
                   <p>{task.description}</p>
                   <p>Required Skills: {task.required_skills}</p>
                    <p>Min Level: {task.min_level}</p>
                     <p>Base Reward: {task.base_reward}</p>
                     <p>Submission Deadline: {task.submission_deadline}</p>
                     <p>Status: {task.status}</p>
                     <p>Slots: {task.slots}</p>
                     <p>Notes: {task.notes}</p>
                   </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
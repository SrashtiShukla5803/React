// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { useState, useEffect} from 'react'

const Card = ({title}) => 
{
  const [count, setCount]=useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(()=>{
    console.log(`${title}has been liked: ${hasLiked}`);
  },[hasLiked]);

  // most common use case of useEffect
  useEffect(() => {
    console.log('CARD RENDERED')
  }, [])

  //conditional rendering

  return(
    <div className='card' onClick={() => setCount(count+1)}>
      <h2>
        {title} <br/> {count ? count : null}
      </h2>
      <button onClick={() => setHasLiked(!hasLiked)}>
      {hasLiked ? "❤️":"🤍"}
      </button>
    </div>
  );
}
const App = () => 
{
  return(
    <div className='card-container'>
    <h1>Functional Arrow Component</h1>
    <Card title="GOT"/>
    <Card title="Avengers"/>
    <Card title="Wrong Turn"/>
    </div>
  );
}

export default App

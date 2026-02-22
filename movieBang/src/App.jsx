import React, { useState , useEffect} from 'react'
import Search from './components/Search'
import hero from './assets/hero.png'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const[movieList, setMovieList] = useState([]);
  const[isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies,setTrendingMovies]=useState([]);

  useDebounce(()=> setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query='') => {

    setIsLoading(true);
    setErrorMessage('');
    // before anything happens we are setting up the loading
    try{
      const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      // alert(response);
      // throw new Error('Failed to fetch movies');

      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      // to check how much data we have
      // console.log(data)

      if(!data.results){
        setErrorMessage('Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }

    }catch(error){
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }finally{
      // whether we succeed or fail we want to stop the loading
      setIsLoading(false);// if it fails show the error else show the result no need to show the loading stage
    }
  }

  const loadTrendingMovies = async() => {
    try{
      const movies = await getTrendingMovies();
      console.log("TRENDING",movies)
      setTrendingMovies(movies);
    }catch(error){
      console.error(`Error fetching trending movies: ${error}`);
      //setErrorMessage('Error fetching trending movies.');
    }
  }

useEffect(() => {
  fetchMovies(debouncedSearchTerm);
}, [debouncedSearchTerm]);

useEffect(() => {
  loadTrendingMovies();
},[]);

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
        <header>
          <img src={hero} alt="Hero Banner" />

          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle
          </h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 &&(
          <section className='trending'>
            <h2>
              Trending Movies
            </h2>
            <ul>
              {trendingMovies.map((movie,index)=>(
                <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.searchTerm}/>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className='all-movies'>
        <h2 className='mt-[40px]'>All Movies</h2>

        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}

        {isLoading? (
          <Spinner/>
        ): errorMessage? (
          <p className='text-red-500'>{errorMessage}</p>
        ):(
          <ul>
            {movieList.map((movie) =>(
              // instead we wanna render the movieCards <p key={movie.id} className='text-white'>{movie.title}</p>
              <MovieCard key={movie.id} movie={movie}/>
            ))}
          </ul>
        )}
        </section>
        {/* <h1 className='text-white'>{searchTerm}</h1> */}


      </div>
    </main>
  )
}

export default App
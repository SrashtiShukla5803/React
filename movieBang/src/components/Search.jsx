import React from 'react'
import search from '../assets/search.svg'
const Search = ({searchTerm, setSearchTerm})=>{
    return(
        <div className = 'search'>
            <div>
                <img src={search} alt='search'/>

                <input 
                type = "text"
                placeholder='Search through thousands of movies'
                value = {searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            {/* <div className='text-white text-3xl'>{searchTerm}</div> */}
            </div>
        </div>
    )
    // we cannot have two return statements
    // return(
    //     <div className='text-white text-3xl'>{props.searchTerm}</div>
    // )
}

export default Search
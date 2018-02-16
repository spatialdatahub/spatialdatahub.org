import React from 'react';

const SearchBar = () => {
    return (
        <li className='searchBar' id='searchBar'>
          <form action='.' method='GET'>
            <input className='form-control'
                   name='q'
                   type='text'
                   title='Search Datasets'
                   placeholder='Search title, account, author, keyword'>
            </input>
          </form>  
        </li>  
    );
};

export default SearchBar;

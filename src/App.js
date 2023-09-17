import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [checkbox, setCheckbox] = useState({});
  const [Scheckbox, setScheckbox] = useState(false);
  const [pageInx, setPageInx] = useState(0);
  const [cache, setCache] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
   
    const fetchData = async () => {
      try {
        if (cache[pageInx]) {
         
          setData(cache[pageInx]);
        } else {
          
          const response = await fetch(`https://jsonplaceholder.typicode.com/todos?_start=${pageInx * 10}&_limit=10`); // Replace with your API endpoint
          const jsonData = await response.json();

          
          setCache((prevData) => ({ ...prevData, [pageInx]: jsonData }));
          
         
          setData(jsonData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pageInx, cache]);

  useEffect(() => {
   
    const urlParams = Object.keys(checkbox)
      .filter((key) => checkbox[key])
      .join('&');
    window.history.replaceState(null, null, `?${urlParams}`);
  }, [checkbox]);

  useEffect(() => {
   
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFiltered(filtered);
  }, [data, searchQuery]);

  const Change = (id) => {
    const box = { ...checkbox };
    box[id] = !box[id];
    setCheckbox(box);
  };

  const toggle = () => {
    setScheckbox(!Scheckbox);
  };

  const NextPage = () => {
    setPageInx(pageInx + 1);
  };

  const PrevPage = () => {
    if (pageInx > 0) {
      setPageInx(pageInx - 1);
    }
  };

  const Search = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <h1>Filtered Data</h1>
      <label>
        Show Checkbox
        <input type="checkbox" onChange={toggle} checked={Scheckbox} />
      </label>
      <input
        type="text"
        placeholder="Search by Title"
        value={searchQuery}
        onChange={Search}
      />
      <ul>
        {filtered.map((item) => (
          <li key={item.id}>
            {Scheckbox && (
              <input
                type="checkbox"
                checked={checkbox[item.id] || false}
                onChange={() => Change(item.id)}
              />
            )}
            {item.title}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={PrevPage} disabled={pageInx === 0}>Prev</button>
        <button onClick={NextPage}>Next</button>
      </div>
    </div>
  );
}

export default App;

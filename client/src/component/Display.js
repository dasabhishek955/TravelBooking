import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Display() {
    const [travelData, setTravelData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('location');
    const [isLiked, setIsLiked] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { state } = useLocation();
    const { user_id } = state;

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const handleLikeClick = (event) => {
        // Toggle the like state
        const cardId = event.currentTarget.id;

        console.log(cardId);
        setIsLiked(prevIsLiked => !prevIsLiked);

        // Send user's like status to the backend
        axios.post('http://localhost:5000/like', {
            user_id: user_id, // Assuming you have the user's ID available
            card_id: cardId,
        });
    };


    useEffect(() => {
        async function fetchTravelData() {
            try {
                const response = await axios.get('http://localhost:5000/traveldata');
                setTravelData(response.data);

            } catch (error) {
                console.error('Error fetching travel data:', error);
            }
        }
        fetchTravelData();

    }, []);

    const filteredTravelData = travelData.filter(data => {
        const searchValue = searchQuery.toLowerCase();


        if (searchType === 'location') {
            return data.location.toLowerCase().includes(searchValue);
        } else if (searchType === 'price') {
            if (searchValue.startsWith('under ')) {
                const maxPrice = parseInt(searchValue.split(' ')[1]);
                return data.price <= maxPrice;
            }
            // You can add more cases here for other price search formats
        }
        return false;
    });

    return (
        <>
            <div className={`home-page ${isDarkMode ? 'dark-mode' : ''}`}>
                <div className="search-bar">
                    <input type="text" placeholder="Search by location" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-type" >
                        <option value="location">Location</option>
                        <option value="price">Price</option>
                    </select>
                </div>
                <div className="card-container">
                    <h1>{console.log(filteredTravelData)}</h1>
                    {filteredTravelData.map((data) => (
                        <div className="card" key={data.id}>
                            <iframe src={`https://www.youtube.com/embed/${data.link.split('/').pop()}`} alt={data.location} />
                            <h2>{data.location}</h2>
                            <p>Price: {data.price}</p>
                            <p>Timeline: {data.timeline}</p>
                            <button className={`like-button ${data.like === 1 ? 'liked' : ''}`} onClick={handleLikeClick}>
                                {data.like === 1 ? 'Liked' : 'Like'}
                            </button>
                        </div>
                    ))}
                </div>
                <button className="dark-mode-button" onClick={toggleDarkMode}>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </>
    )

}
export default Display


{/* {filteredTravelData.map(card => (
                    <Card key={card.id} card={card} userId={user_id} > */}

{/* </Card> */ }

// useEffect(() => {
//     // Fetch the initial liked status from the backend
//     async function fetchInitialLikedStatus() {
//         try {
//             const response = await axios.get(`/api/like?user_id=${user_id}&card_id=${cardId}`);
//             const initialLikedStatus = response.data.is_liked;
//             setIsLiked(initialLikedStatus);
//         } catch (error) {
//             console.error('Error fetching initial liked status:', error);
//         }
//     }

//     fetchInitialLikedStatus();
// }, [user_id, cardId]); // Run effect when userId or cardId changes


// if (searchType === 'location') {
//     return data.location.toLowerCase().includes(searchValue);
// } else if (searchType === 'price') {
//     if (searchValue.startsWith('under ')) {
//         const maxprice = parseInt(searchValue.split(' ')[1]);
//         return data.price <= maxprice;
//     }
//     // You can add more cases here for other price search formats
// }
// return false;
// });



     //   <iframe width="420" height="210" src={`https://www.youtube.com/embed/${elink[1].split('/').pop()}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen frameborder="0"></iframe>

                //    <div className="card" key={data[1]}>
                //     {/* <img src={data.location_pic} alt={data.location} /> */}
                //     <img src={data[2]} alt={data[3]} />
                //     <h2>{data[3]}</h2>
                //     <p>price: {data[0]}</p>
                //     <p>Timeline: {data[5]}</p>
                //   </div>

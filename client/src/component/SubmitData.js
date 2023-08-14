import React, { useState } from 'react';
import axios from 'axios';

function SubmitData() {
    const [location, setLocation] = useState('');
    const [fare, setFare] = useState('');
    const [timeline, setTimeline] = useState('');
    const [link, setLink] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/submit', { location, fare, timeline, link });
            console.log(response.data); // You can handle success in your own way
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <div className="submit-page">
            <h1>Submit Data</h1>
            <div className="submit-form">
                <div className="form-field">
                    <label className="form-label">Location:</label>
                    <input type="text" className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Fare:</label>
                    <input type="text" className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Timeline:</label>
                    <input type="text" className="form-input" />
                </div>
                <button className="submit-button" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default SubmitData;

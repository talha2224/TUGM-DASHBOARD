import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config'; // Update path if needed

const Terms = () => {
  const [term, setTerm] = useState('');
  const [termId, setTermId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.baseUrl}/term/all`);
      const termsData = res?.data?.data;
      if (termsData?.length > 0) {
        setTerm(termsData[0].term);
        setTermId(termsData[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch terms", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (termId) {
        // Update existing term
        await axios.put(`${config.baseUrl}/term/update/${termId}`, { term });
        setMessage('Terms updated successfully.');
      } else {
        // Create new term
        const res = await axios.post(`${config.baseUrl}/term/create`, { term });
        setTermId(res?.data?.data?._id); // Save new ID
        setMessage('Terms created successfully.');
      }
    } catch (error) {
      console.error("Failed to save term", error);
      setMessage('Something went wrong!');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000); // clear message after 3s
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  return (
    <div className="">

      {loading && <p className="text-blue-500 mb-2">Loading...</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <textarea
        rows={25}
        className="w-full border rounded-md p-3 text-sm outline-none"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Enter terms and conditions..."
      />

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        disabled={loading}
      >
        {termId ? 'Update Terms' : 'Create Terms'}
      </button>
    </div>
  );
};

export default Terms;

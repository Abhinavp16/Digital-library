import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

const VisitCounter = () => {
  const [visits, setVisits] = useState(0);

  // Loading from localStorage on mount
  useEffect(() => {
    const storedVisits = Number(localStorage.getItem('visitCounter')) || 0;
    setVisits(storedVisits);
  }, []);

  // Saving in localStorage whenever visits change
  useEffect(() => {
    localStorage.setItem('visitCounter', visits.toString());
  }, [visits]);

  // Increase visits on every page load (refresh)
  useEffect(() => {
    setVisits((prevVisits) => prevVisits + 1);
  }, []);

  const exportToExcel = () => {
    const data = [
      ['Date', 'Visits'],
      [new Date().toLocaleDateString(), visits],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Visits');

    XLSX.writeFile(wb, `visits_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      <p>Visits: {visits}</p>
      <button onClick={exportToExcel}>Download Excel</button>
    </div>
  );
};

export default VisitCounter;

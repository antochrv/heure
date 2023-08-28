import React, { useState } from 'react';
import jsPDF from 'jspdf';


const HourCounter = () => {
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [overtimeHours, setOvertimeHours] = useState({});
  const [comments, setComments] = useState({});
  
  const handleHoursChange = (day, value) => {
    setOvertimeHours((prevOvertimeHours) => ({
      ...prevOvertimeHours,
      [day]: value
    }));
  };

  const handleCommentChange = (day, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [day]: value
    }));
  };

  const getTotalOvertimeMinutes = () => {
    return Object.values(overtimeHours).reduce((total, hours) => total + hours, 0);
  };

  const formatHoursMinutes = (minutes) => {
    const isNegative = minutes < 0;
    minutes = Math.abs(minutes);
    const hours = Math.floor(minutes / 60);
    const formattedMinutes = String(minutes % 60).padStart(2, '0');
    return isNegative ? `-${hours}:${formattedMinutes}` : `${hours}:${formattedMinutes}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pdfTitle = `Récapitulatif heures supplémentaires - Période du ${startDate} au ${endDate}`;
    doc.text(pdfTitle, 10, 10);
    
    let yPos = 30;
    Object.keys(overtimeHours).forEach((day) => {
      const hours = overtimeHours[day];
      doc.text(`${day}: ${formatHoursMinutes(hours)}`, 10, yPos);
      yPos += 10;
      if (comments[day]) {
        doc.text(`Commentaire: ${comments[day]}`, 20, yPos);
        yPos += 10;
      }
    });

    const totalOvertimeMinutes = getTotalOvertimeMinutes();
    doc.text(`Total heures supplémentaires: ${formatHoursMinutes(totalOvertimeMinutes)}`, 10, yPos + 10);

    doc.save(`${startDate}_to_${endDate}_recapitulatif.pdf`);
  };

  return (
    <div>
      <h1>Récapitulatif d'heures supplémentaires</h1>
      <label>Date de début:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>Date de fin:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      {daysOfWeek.map((day, index) => (
        <div key={index}>
          <div>{day}</div>
          <input
            type="number"
            min={-480}
            max={480}
            step={15}
            value={overtimeHours[day] || 0}
            onChange={(e) => handleHoursChange(day, parseInt(e.target.value))}
          />
          <div>{formatHoursMinutes(overtimeHours[day] || 0)}</div>
          <input
            type="text"
            placeholder="Commentaire"
            value={comments[day] || ''}
            onChange={(e) => handleCommentChange(day, e.target.value)}
          />
          <hr /> {/* Ajoutez un séparateur entre chaque jour */}
        </div>
      ))}
      <button onClick={generatePDF}>Générer PDF</button>
    </div>
  );
};

export default HourCounter;

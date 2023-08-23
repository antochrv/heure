import React, { useState } from 'react';
import jsPDF from 'jspdf';

const DayInput = ({ day, onHoursChange, onCommentChange }) => {
  return (
    <div>
      <label>{day} :</label>
      <input
        type="text"
        placeholder="hh:mm"
        onBlur={(e) => onHoursChange(day, e.target.value)}
      />
      <input
        type="text"
        placeholder="Commentaire"
        onBlur={(e) => onCommentChange(day, e.target.value)}
      />
    </div>
  );
};

const formatHoursMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const minutesRemaining = minutes % 60;
  return `${hours}h${minutesRemaining < 10 ? '0' : ''}${minutesRemaining}`;
};

const HourCounter = () => {
    const daysOfWeek = ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'samedi'];
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [overtimeHours, setOvertimeHours] = useState({});
    const [comments, setComments] = useState({});
    
    const calculateMinutes = (timeString) => {
      const [hours, minutes] = timeString.split(':').map(parseFloat);
      return hours * 60 + minutes;
    };
  
    const handleHoursChange = (day, timeString) => {
      const minutes = calculateMinutes(timeString);
      setOvertimeHours((prevOvertimeHours) => ({
        ...prevOvertimeHours,
        [day]: minutes
      }));
    };
  
    const handleCommentChange = (day, comment) => {
      setComments((prevComments) => ({
        ...prevComments,
        [day]: comment
      }));
    };
  
    const getTotalOvertimeMinutes = () => {
        return Object.values(overtimeHours).reduce((total, hours) => total + hours, 0);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pdfTitle = `Récapitulatif heures supplémentaires - Période du ${startDate} au ${endDate}`;
        doc.text(pdfTitle, 10, 10);
        
        const totalOvertimeMinutes = getTotalOvertimeMinutes();
      
        let yPos = 30;
        Object.keys(overtimeHours).forEach((day) => {
          doc.text(`${day}: ${formatHoursMinutes(overtimeHours[day])}`, 10, yPos);
          yPos += 10;
          if (comments[day]) {
            doc.text(`Commentaire: ${comments[day]}`, 20, yPos);
            yPos += 10;
          }
        });
      
        doc.text(`Total heures supplémentaires: ${formatHoursMinutes(totalOvertimeMinutes)}`, 10, yPos + 10);
      
        doc.save(`${startDate}_to_${endDate}_recapitulatif.pdf`);
      };
      
  

  return (
    <div>
      <h2>Calculateur d'heures supplémentaires</h2>
      <div>
        <label>Date de début de la semaine :</label>
        <input
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div>
        <label>Date de fin de la semaine :</label>
        <input
          type="text"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {daysOfWeek.map((day) => (
        <DayInput
          key={day}
          day={day}
          onHoursChange={handleHoursChange}
          onCommentChange={handleCommentChange}
        />
      ))}
      <h3>Heures supplémentaires par jour :</h3>
      <ul>
        {daysOfWeek.map((day) => (
          <li key={day}>
            {day}: {formatHoursMinutes(overtimeHours[day] || 0)}
            {comments[day] && <span> - Commentaire : {comments[day]}</span>}
          </li>
        ))}
      </ul>
      <p>Total heures supplémentaires: {formatHoursMinutes(getTotalOvertimeMinutes())}</p>
      <button onClick={generatePDF}>Générer le PDF</button>
    </div>
  );
};

export default HourCounter;

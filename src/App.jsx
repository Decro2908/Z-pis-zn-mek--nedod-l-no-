import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [grade, setGrade] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [average, setAverage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data));
  }, []);

  const addStudent = async () => {
    const response = await axios.post('http://localhost:5000/api/students', { name, class: studentClass });
    setStudents([...students, response.data]);
    setName('');
    setStudentClass('');
  };

  const addGrade = async () => {
    if (selectedStudent) {
      await axios.post(`http://localhost:5000/api/students/${selectedStudent.id}/grade`, { grade, weight, description });
      setGrade('');
      setWeight('');
      setDescription('');
    }
  };


  const calculateAverage = async (studentId) => {
    const response = await axios.get(`http://localhost:5000/api/students/${studentId}/average`);
    setAverage(response.data.average);
  };

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    setStudents(students.filter(student => student.id !== id));
  };

  const deleteGrade = async (studentId, gradeId) => {
    await axios.delete(`http://localhost:5000/api/students/${studentId}/grade/${gradeId}`);
  };

  return (
    <div>
      <h1>Správa studentů a známek</h1>

      {}
      <div>
        <h2>Přidat nového studenta</h2>
        <input
          type="text"
          placeholder="Jméno"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Třída"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        />
        <button onClick={addStudent}>Přidat studenta</button>
      </div>

      {}
      <div>
        <h2>Seznam studentů</h2>
        <ul>
          {students.map(student => (
            <li key={student.id}>
              {student.name} ({student.class})
              <button onClick={() => deleteStudent(student.id)}>Smazat</button>
              <button onClick={() => setSelectedStudent(student)}>Vybrat studenta</button>
              <button onClick={() => calculateAverage(student.id)}>Vypočítat průměr</button>
            </li>
          ))}
        </ul>
      </div>

      {}
      {average && (
        <div>
          <h3>Průměrná známka: {average.toFixed(2)}</h3>
        </div>
      )}

      {}
      {selectedStudent && (
        <div>
          <h2>Přidat známku studentovi: {selectedStudent.name}</h2>
          <input
            type="number"
            placeholder="Známka (1-5)"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          <input
            type="number"
            placeholder="Váha (1-10)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <input
            type="text"
            placeholder="Popis"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={addGrade}>Přidat známku</button>
        </div>
      )}
    </div>
  );
}

export default App;

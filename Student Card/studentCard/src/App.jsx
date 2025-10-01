// App.jsx
import StudentCard from './StudentCard';

const students = [
  { name: 'Chandan Singla', roll: '23BCS12759', course: 'B.Tech CSE' },
  { name: 'Akash Chaudhary', roll: '23BCS11228', course: 'B.Tech IT' },
  { name: 'Kamal', roll: '23BCS10406', course: 'B.Tech ECE' },
  { name: 'Arun Badyal', roll: '24BCS10519', course: 'B.Tech CSE' },
];

function App() {
  return (
    <div className="flex flex-wrap justify-center mt-10 bg-gray-200">
      {students.map((student) => (
        <StudentCard
          key={student.roll}
          name={student.name}
          roll={student.roll}
          course={student.course}
        />
      ))}
    </div>
  );
}

export default App;

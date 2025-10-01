
const StudentCard = ({ name, roll, course }) => (
  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg p-10 max-w-md w-full mx-4 my-6 font-sans">
    <h3 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>{name}</h3>
    <p className="text-lg text-purple-100 mb-2" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      Roll: <span className="font-semibold text-yellow-200">{roll}</span>
    </p>
    <p className="text-lg text-purple-100" style={{ fontFamily: 'Montserrat, Arial, sans-serif' }}>
      Course: <span className="font-semibold text-yellow-200">{course}</span>
    </p>
  </div>
);

export default StudentCard;

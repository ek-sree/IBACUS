import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import StudentsTaskTable from './StudentsTaskTable';

const mockData = {
  totalTasks: 50,
  students: [
    { name: 'John Doe', completedTasks: 45, email: 'john@example.com' },
    { name: 'Jane Smith', completedTasks: 30, email: 'jane@example.com' },
    { name: 'Alex Johnson', completedTasks: 25, email: 'alex@example.com' },
    { name: 'Emily Brown', completedTasks: 40, email: 'emily@example.com' },
    { name: 'Michael Chen', completedTasks: 35, email: 'michael@example.com' },
    { name: 'Sarah Davis', completedTasks: 20, email: 'sarah@example.com' },
  ],
  weeklyTrend: [10, 15, 20, 12], // For area chart
};

const Dashboard = () => {
  const [completedTasks, setCompletedTasks] = useState(1);
  const [notCompletedTasks, setNotCompletedTasks] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 4;

  useEffect(() => {
    const totalCompleted = mockData.students.reduce((sum, s) => sum + s.completedTasks, 0);
    const totalPossible = mockData.totalTasks * mockData.students.length;
    setCompletedTasks(totalCompleted);
    setNotCompletedTasks(totalPossible - totalCompleted);
  }, []);

  const topStudents = [...mockData.students]
    .sort((a, b) => b.completedTasks - a.completedTasks)
    .slice(0, 5);

  // Chart configs
  const pieChartOptions = {
    chart: { type: 'pie' },
    labels: ['Completed Tasks', 'Not Completed Tasks'],
    colors: ['#10B981', '#EF4444'],
  };
  const pieChartSeries = [completedTasks, notCompletedTasks];

  const barChartOptions = {
    chart: { type: 'bar' },
    xaxis: { categories: topStudents.map((s) => s.name) },
    colors: ['#3B82F6'],
  };
  const barChartSeries = [{ name: 'Tasks Completed', data: topStudents.map((s) => s.completedTasks) }];

  const areaChartOptions = {
    chart: { type: 'area' },
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    colors: ['#8B5CF6'],
  };
  const areaChartSeries = [{ name: 'Tasks Submitted', data: mockData.weeklyTrend }];

  const radialChartOptions = {
  chart: { type: 'radialBar' },
  plotOptions: {
    radialBar: {
      dataLabels: {
        total: {
          show: true,
          label: 'Overall Completion',
          formatter: () => {
            const total = completedTasks + notCompletedTasks;
            if (total === 0) return '0%';
            const percent = Math.round((completedTasks / total) * 100);
            return `${percent}%`;
          },
        },
      },
    },
  },
  labels: ['Progress'],
  colors: ['#F59E0B'],
};

const radialChartSeries = [
  completedTasks + notCompletedTasks === 0
    ? 0
    : Number(((completedTasks / (completedTasks + notCompletedTasks)) * 100).toFixed(2)),
];


  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = mockData.students.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(mockData.students.length / studentsPerPage);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg text-gray-700 font-semibold">Total Tasks Assigned</h3>
          <p className="text-2xl font-bold text-blue-600">{mockData.totalTasks}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg text-gray-700 font-semibold">Tasks Completed</h3>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg text-gray-700 font-semibold">Tasks Not Completed</h3>
          <p className="text-2xl font-bold text-red-600">{notCompletedTasks}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Completion Status</h2>
          <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={300} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Top 5 Students</h2>
          <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Weekly Submission Trend</h2>
          <Chart options={areaChartOptions} series={areaChartSeries} type="area" height={300} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Overall Progress</h2>
          <Chart options={radialChartOptions} series={radialChartSeries} type="radialBar" height={300} />
        </div>
      </div>

      {/* Table */}
      <StudentsTaskTable currentStudents={currentStudents} mockData={mockData} currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}/>
    </div>
  );
};

export default Dashboard;

import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import useFetchDashboard from '../../services/TeacherManagment/useFetchDashboard';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/redux/store/store';


const Dashboard = () => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [notCompletedTasks, setNotCompletedTasks] = useState(0);
const [radialChartSeries, setRadialChartSeries] = useState<number[]>([0]);
  

  const teacherId = useSelector((state:RootState)=>state.teacherAuth.id)

  const {data,error,loading} = useFetchDashboard(teacherId!)

  

useEffect(() => {
  if (data) {
    const completed = data.totalSubmissions || 0;
    const possibleSubmission =  (data.studentCount || 0) * (data.taskCount || 0);
    console.log("Possible",possibleSubmission);
    
    const notCompleted = possibleSubmission - completed;
    setCompletedTasks(Math.round(completed));
    setNotCompletedTasks(Math.round(notCompleted));
    setRadialChartSeries([Number(data.averageGradePercentage) || 0]);
  }
}, [data]);
useEffect(()=>{
  if(completedTasks && notCompletedTasks){
    console.log('notCompleted:', completedTasks,notCompletedTasks);

  }
},[])


  // Chart configs
 const pieChartOptions = useMemo(() => ({
    chart: { type: 'pie' },
    labels: ['Completed Tasks', 'Not Completed Tasks'],
    colors: ['#10B981', '#EF4444'],
    dataLabels: {
      enabled: true,
      formatter: (_: number, opts: any) => {
        return opts.w.globals.series[opts.seriesIndex];
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  }), []);

  const pieChartSeries = useMemo(() => [completedTasks, notCompletedTasks], [completedTasks, notCompletedTasks]);


  const barChartOptions = {
    chart: { type: 'bar' },
    xaxis: { categories: data?.topStudents?.map((s) => s.name) },
    colors: ['#3B82F6'],
  };
  const barChartSeries = [
  { name: 'Total Marks', data: data?.topStudents.map((s) => s.totalMarks || 0) }
];

  const areaChartOptions = {
    chart: { type: 'area' },
    xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
    colors: ['#8B5CF6'],
  };
  const areaChartSeries = [{ name: 'Tasks Submitted', data: data?.weeklySubmissions }];

  const radialChartOptions = {
  chart: { type: 'radialBar' },
  plotOptions: {
    radialBar: {
      hollow: { size: '70%' },
      dataLabels: {
        name: { show: true, fontSize: '16px', color: '#333' },
        value: {
          show: true,
          fontSize: '28px',
          color: '#111',
          formatter: (val: number) => `${Math.round(val)}%`,
        },
        total: {
          show: true,
          label: 'Average Grade',
          color: '#555',
          fontSize: '14px',
          formatter: () => `${radialChartSeries[0].toFixed(2)}%`,
        },
      },
    },
  },
  labels: ['Avg. Grade'],
  stroke: { lineCap: 'round' },
  colors: ['#F59E0B'],
};

if (loading) return <div>Loading dashboard...</div>;
if (error) return <div>Error loading dashboard</div>;
 
  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg text-gray-700 font-semibold">Total Tasks Assigned</h3>
          <p className="text-2xl font-bold text-blue-600">{data?.taskCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg text-gray-700 font-semibold">Total Students</h3>
          <p className="text-2xl font-bold text-green-600">{data?.studentCount || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg text-gray-700 font-semibold">Tasks Not Completed</h3>
          <p className="text-2xl font-bold text-red-600">{notCompletedTasks || 0}</p>
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
          <Chart  key={`radial-${radialChartSeries[0]}`} options={radialChartOptions} series={radialChartSeries} type="radialBar" height={300} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Calendar,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

const Home = () => {
  // Sample data
  const tasks = [
    { id: 1, title: 'Mathematics Assignment', subject: 'Math', dueDate: '2025-06-25', status: 'pending', points: 20 },
    { id: 2, title: 'Science Project', subject: 'Science', dueDate: '2025-06-28', status: 'pending', points: 35 },
    { id: 3, title: 'History Essay', subject: 'History', dueDate: '2025-06-23', status: 'completed', points: 25 },
    { id: 4, title: 'English Literature Review', subject: 'English', dueDate: '2025-06-30', status: 'pending', points: 30 },
  ];

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mt-1">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Alex!</h1>
        <p className="text-blue-100">Ready to conquer your tasks today?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Points Earned</p>
              <p className="text-2xl font-bold text-purple-600">{totalPoints}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600">{task.points} pts</p>
                  <p className="text-xs text-gray-500">{task.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-medium">{Math.round((completedTasks.length / tasks.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">This Week</p>
                <p className="font-bold text-green-600">{completedTasks.length} Tasks</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Next Goal</p>
                <p className="font-bold text-purple-600">100 Points</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
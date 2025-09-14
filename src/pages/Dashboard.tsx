import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Leaf, CloudRain, ShoppingBag, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const quickActions = [
    {
      icon: Brain,
      title: 'Disease Detection',
      description: 'Scan crop leaves for diseases',
      link: '/disease-detection',
      color: 'bg-red-500',
    },
    {
      icon: Leaf,
      title: 'Crop Suggestions',
      description: 'Get crop recommendations',
      link: '/crop-suggestion',
      color: 'bg-green-500',
    },
    {
      icon: CloudRain,
      title: 'Weather Forecast',
      description: 'Check weather conditions',
      link: '/weather',
      color: 'bg-blue-500',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Buy farming supplies',
      link: '/marketplace',
      color: 'bg-purple-500',
    },
  ];

  const recentActivities = [
    {
      icon: CheckCircle,
      title: 'Disease scan completed',
      description: 'Tomato leaf - Healthy',
      time: '2 hours ago',
      status: 'success',
    },
    {
      icon: AlertTriangle,
      title: 'Weather alert',
      description: 'Heavy rainfall expected tomorrow',
      time: '4 hours ago',
      status: 'warning',
    },
    {
      icon: Leaf,
      title: 'Crop suggestion generated',
      description: 'Wheat recommended for your soil',
      time: '1 day ago',
      status: 'info',
    },
    {
      icon: ShoppingBag,
      title: 'Order placed',
      description: 'Organic fertilizer - 50kg',
      time: '2 days ago',
      status: 'success',
    },
  ];

  const stats = [
    {
      title: 'Crops Monitored',
      value: '12',
      change: '+2 this month',
      color: 'text-green-600',
    },
    {
      title: 'Disease Scans',
      value: '45',
      change: '+8 this week',
      color: 'text-blue-600',
    },
    {
      title: 'Healthy Plants',
      value: '98%',
      change: '+3% improvement',
      color: 'text-green-600',
    },
    {
      title: 'Orders Placed',
      value: '8',
      change: '+3 this month',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening on your farm.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <TrendingUp className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center">
                      <div className={`${action.color} p-2 rounded-lg`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-lg ${
                        activity.status === 'success'
                          ? 'bg-green-100'
                          : activity.status === 'warning'
                          ? 'bg-yellow-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <activity.icon
                        className={`h-4 w-4 ${
                          activity.status === 'success'
                            ? 'text-green-600'
                            : activity.status === 'warning'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

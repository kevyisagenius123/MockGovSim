import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookmarkIcon, 
  ClockIcon, 
  StarIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const PersonalizedSection = ({ user }) => {
  // Mock user data
  const userData = {
    name: user?.name || 'John Doe',
    savedRaces: [
      { id: 1, race: 'Pennsylvania Senate', candidate: 'John Fetterman', status: 'Leading +0.8%' },
      { id: 2, race: 'Arizona Governor', candidate: 'Katie Hobbs', status: 'Trailing -1.2%' },
      { id: 3, race: 'Georgia Senate', candidate: 'Raphael Warnock', status: 'Leading +0.5%' }
    ],
    recentActivity: [
      { action: 'Viewed', item: 'Pennsylvania Polling Data', time: '2 hours ago' },
      { action: 'Bookmarked', item: 'Arizona Governor Race', time: '1 day ago' },
      { action: 'Commented on', item: 'National Polling Trends', time: '2 days ago' }
    ],
    predictions: [
      { race: 'Presidential', prediction: 'Biden +2.5%', confidence: 75 },
      { race: 'Senate Control', prediction: 'Democrats 51', confidence: 68 }
    ]
  };

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-900 to-purple-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome back, {userData.name}! 👋
          </h2>
          <p className="text-gray-300">Here's your personalized election dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Saved Races */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <BookmarkIcon className="w-5 h-5 mr-2" />
                Your Saved Races
              </h3>
              <Link to="/dashboard/saved" className="text-accent hover:underline text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {userData.savedRaces.map((race) => (
                <div key={race.id} className="bg-black bg-opacity-20 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{race.race}</h4>
                  <p className="text-gray-300 text-sm">{race.candidate}</p>
                  <p className="text-accent text-sm font-medium">{race.status}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-4">
              {userData.recentActivity.map((activity, index) => (
                <div key={index} className="bg-black bg-opacity-20 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                    </div>
                    <EyeIcon className="w-4 h-4 text-gray-400 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Predictions */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <StarIcon className="w-5 h-5 mr-2" />
                Your Predictions
              </h3>
              <Link to="/predictions" className="text-accent hover:underline text-sm">
                Make More
              </Link>
            </div>
            <div className="space-y-4">
              {userData.predictions.map((prediction, index) => (
                <div key={index} className="bg-black bg-opacity-20 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{prediction.race}</h4>
                  <p className="text-gray-300 text-sm">{prediction.prediction}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-accent text-sm ml-2 font-medium">
                      {prediction.confidence}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
            <ChartBarIcon className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-gray-300 text-sm">Races Tracked</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
            <StarIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-gray-300 text-sm">Predictions Made</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
            <BookmarkIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-gray-300 text-sm">Saved Articles</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-center">
            <EyeIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">89%</div>
            <div className="text-gray-300 text-sm">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedSection; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import liveDataService from '../../services/liveDataService';
import { 
  CalendarIcon, 
  ChartBarIcon, 
  MapIcon, 
  NewspaperIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, Brush } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background-light border border-border rounded-lg shadow-lg">
        <p className="label text-text-primary">{`${label}`}</p>
        <p className="intro text-blue-400">{`Approval: ${payload[0].value}%`}</p>
        <p className="intro text-red-400">{`Disapproval: ${payload[1].value}%`}</p>
      </div>
    );
  }
  return null;
};

const HomePage = () => {
  const [timeToElection, setTimeToElection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveStats, setLiveStats] = useState({});
  const [competitiveRaces, setCompetitiveRaces] = useState([]);
  const [recentNews, setRecentNews] = useState([]);
  const [trendingData, setTrendingData] = useState([
    { date: 'Jan', approval: 40, disapproval: 50 },
    { date: 'Feb', approval: 42, disapproval: 48 },
    { date: 'Mar', approval: 45, disapproval: 45 },
    { date: 'Apr', approval: 44, disapproval: 46 },
    { date: 'May', approval: 47, disapproval: 43 },
    { date: 'Jun', approval: 46, disapproval: 44 },
  ]);

  // Live data updates
  useEffect(() => {
    // Initial data load
    loadLiveData();
    
    // Set up live countdown
    const updateCountdown = () => {
      const countdown = liveDataService.getElectionCountdown();
      setTimeToElection(countdown.formatted);
    };
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 60000);

    // Set up WebSocket for real-time updates
    liveDataService.connectWebSocket();
    
    // Subscribe to live updates
    liveDataService.subscribe('polling', (data) => {
      if (data.trendData && data.trendData.length > 0) {
        setTrendingData(data.trendData);
      }
    });
    
    liveDataService.subscribe('races', (data) => {
      setCompetitiveRaces(data);
    });
    
    liveDataService.subscribe('news', (newPost) => {
      setRecentNews(prevNews => [newPost, ...prevNews].slice(0, 5));
    });

    // Periodic data refresh (every 5 minutes)
    const dataRefreshInterval = setInterval(loadLiveData, 5 * 60 * 1000);
    
    return () => {
      clearInterval(countdownInterval);
      clearInterval(dataRefreshInterval);
      liveDataService.disconnect();
    };
  }, []);

  const loadLiveData = async () => {
    try {
      const [stats, races, news, polling] = await Promise.all([
        liveDataService.getLiveStats(),
        liveDataService.getCompetitiveRaces(),
        liveDataService.getLiveNews(),
        liveDataService.getLivePollingData()
      ]);
      
      setLiveStats(stats);
      setCompetitiveRaces(races);
      setRecentNews(news);
      if (polling.trendData && polling.trendData.length > 0) {
        setTrendingData(polling.trendData);
      }
    } catch (error) {
      console.error('Error loading live data:', error);
    }
  };

  // Static data
  const partyData = [
    { name: 'Democrat', value: 48, color: '#2f81f7' },
    { name: 'Republican', value: 45, color: '#f85149' },
    { name: 'Independent', value: 7, color: '#d29922' }
  ];

  const quickActions = [
    { icon: MapIcon, title: 'Electoral Map', desc: 'Interactive state-by-state analysis', link: '/polling/dashboard', color: 'bg-blue-600' },
    { icon: ChartBarIcon, title: 'Polling Data', desc: 'Latest polls and trends', link: '/polling', color: 'bg-green-600' },
    { icon: NewspaperIcon, title: 'Election Results', desc: 'Real-time results and analysis', link: '/results', color: 'bg-purple-600' },
    { icon: UserGroupIcon, title: 'County Maps', desc: 'Detailed local election data', link: '/county', color: 'bg-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-extrabold mb-4">
              MockGovSim <span className="text-accent">2.0</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">The Living Political Universe</p>
            
            {/* Election Countdown */}
            <div className="bg-black bg-opacity-30 rounded-2xl p-8 max-w-4xl mx-auto backdrop-blur-sm">
              <div className="flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-accent mr-3" />
                <h2 className="text-2xl font-bold">2024 Presidential Election</h2>
              </div>
              <div className="text-4xl font-mono font-bold text-accent mb-4">{timeToElection}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{liveStats.voterTurnout || 67.8}%</div>
                  <div className="text-sm text-gray-300">Projected Turnout</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{liveStats.totalPolls || 1247}</div>
                  <div className="text-sm text-gray-300">Total Polls</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{liveStats.activeRaces || 435}</div>
                  <div className="text-sm text-gray-300">Active Races</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{liveStats.lastUpdated || '2 mins ago'}</div>
                  <div className="text-sm text-gray-300">Last Updated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates, races, or issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-background p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300 border border-border hover:border-accent"
              >
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Data Previews */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* National Polling Trends */}
            <div className="bg-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">National Approval Rating</h3>
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-400" />
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={trendingData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorApproval" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2f81f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2f81f7" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorDisapproval" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f85149" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f85149" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#b3b9c5" />
                    <YAxis domain={[35, 55]} stroke="#b3b9c5" />
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3}/>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="approval" name="Approval" stackId="1" stroke="#2f81f7" fillOpacity={1} fill="url(#colorApproval)" />
                    <Area type="monotone" dataKey="disapproval" name="Disapproval" stackId="1" stroke="#f85149" fillOpacity={1} fill="url(#colorDisapproval)" />
                    <Brush dataKey="date" height={30} stroke="#2f81f7" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Party Distribution */}
            <div className="bg-card p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Current Party Distribution</h3>
              <div className="flex items-center justify-between">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={partyData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {partyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {partyData.map((party, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: party.color }}></div>
                      <span className="text-sm">{party.name}: <strong>{party.value}%</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Races & News */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Trending Races */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Most Competitive Races</h3>
                <Link to="/polling/dashboard" className="text-accent hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {competitiveRaces.map((race, index) => (
                  <div key={index} className="bg-background p-4 rounded-lg border border-border hover:border-accent transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{race.state} {race.type}</h4>
                        <p className="text-sm text-gray-400">{race.leader}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{race.margin}</div>
                        <div className={`text-sm ${
                          race.trending === 'up' ? 'text-green-400' : 
                          race.trending === 'down' ? 'text-red-400' : 
                          'text-yellow-400'
                        }`}>
                          {race.trending === 'up' ? '↗' : race.trending === 'down' ? '↘' : '→'} {race.trending}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Latest News</h3>
                <BellIcon className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-4">
                {recentNews.map((news) => (
                  <div key={news.id} className="bg-background p-4 rounded-lg border border-border hover:border-accent transition-colors cursor-pointer">
                    <h4 className="font-semibold mb-2">{news.title}</h4>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{news.source}</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-accent to-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Political Conversation</h2>
          <p className="text-xl mb-8 opacity-90">Track races, analyze data, and stay informed about the democratic process</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/polling/dashboard" 
              className="bg-white text-accent px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Dashboard
            </Link>
            <Link 
              to="/auth/register" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-accent transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 
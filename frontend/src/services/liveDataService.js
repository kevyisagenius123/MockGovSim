import apiClient from '../api/apiClient';
import { safeCall, safeCallAsync } from '../utils/safeCall';

class LiveDataService {
  constructor() {
    this.websocket = null;
    this.updateCallbacks = new Map();
    let socket = null;
    let reconnectInterval = 5000; // 5 seconds

    const wsUrl = import.meta.env.VITE_WSS_URL;

    this.connectWebSocket = (onMessage) => {
      // This is, like, a super important check to make sure we don't have multiple sockets
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('WebSocket is already connected.');
        return;
      }

      if (!wsUrl) {
        console.log("WebSocket URL not provided. Skipping connection.");
        return;
      }
      
      try {
        // Use the dynamically generated URL
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket connection established');
          reconnectInterval = 5000; // Reset reconnect interval on successful connection
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleWebSocketMessage(data);
            safeCall(onMessage, data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        socket.onclose = (event) => {
          console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
          socket = null;
          
          // Exponential backoff for reconnection
          setTimeout(() => {
            if (reconnectInterval < 60000) { // Max 1 minute
              reconnectInterval *= 1.5;
            }
            console.log(`Attempting to reconnect WebSocket in ${reconnectInterval}ms...`);
            this.connectWebSocket(onMessage);
          }, reconnectInterval);
        };

        socket.onerror = (error) => {
          console.log('WebSocket connection failed - this is normal if WebSocket server is not available');
          socket = null;
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        socket = null;
      }
    };
  }

  // Real-time election countdown
  getElectionCountdown() {
    const targetDate = new Date('2024-11-05T00:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance < 0) {
        return { expired: true, message: 'Election Day!' };
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        days,
        hours,
        minutes,
        formatted: `${days}d ${hours}h ${minutes}m`,
        total: distance
      };
    };

    return updateCountdown();
  }

  // Live polling data from backend
  async getLivePollingData() {
    try {
      const response = await apiClient.get('/polling/live-aggregates');
      return response.data;
    } catch (error) {
      console.error('Error fetching live polling data:', error);
      return this.getMockPollingData();
    }
  }

  // Live competitive races
  async getCompetitiveRaces() {
    try {
      const response = await apiClient.get('/elections/competitive-races');
      return response.data;
    } catch (error) {
      console.error('Error fetching competitive races:', error);
      return this.getMockCompetitiveRaces();
    }
  }

  // Live news feed
  async getLiveNews() {
    try {
      const response = await apiClient.get('/news/election-feed');
      return response.data;
    } catch (error) {
      console.error('Error fetching live news:', error);
      return this.getMockNews();
    }
  }

  // Live stats aggregation
  async getLiveStats() {
    try {
      const response = await apiClient.get('/elections/live-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching live stats:', error);
      return this.getMockStats();
    }
  }

  handleWebSocketMessage(data) {
    const { type, payload } = data;
    this.notifyCallbacks(type, payload);
  }

  subscribe(type, callback) {
    if (!this.updateCallbacks.has(type)) {
      this.updateCallbacks.set(type, []);
    }
    this.updateCallbacks.get(type).push(callback);
  }

  notifyCallbacks(type, data) {
    if (this.updateCallbacks.has(type)) {
      this.updateCallbacks.get(type).forEach(callback => safeCall(callback, data));
    }
  }

  // Mock data fallbacks
  getMockPollingData() {
    return {
      national: [
        { name: 'John Doe', percentage: 51.2, trend: 1.5, party: 'left' },
        { name: 'Jane Smith', percentage: 48.8, trend: -1.2, party: 'right' },
      ],
      states: [
        { state: 'AL', support: { 'John Doe': 34, 'Jane Smith': 64 }, electoralVotes: 9 },
        { state: 'AK', support: { 'John Doe': 40, 'Jane Smith': 55 }, electoralVotes: 3 },
        { state: 'AZ', support: { 'John Doe': 50, 'Jane Smith': 49 }, electoralVotes: 11 },
        { state: 'AR', support: { 'John Doe': 36, 'Jane Smith': 61 }, electoralVotes: 6 },
        { state: 'CA', support: { 'John Doe': 63, 'Jane Smith': 34 }, electoralVotes: 55 },
        { state: 'CO', support: { 'John Doe': 55, 'Jane Smith': 42 }, electoralVotes: 9 },
        { state: 'CT', support: { 'John Doe': 59, 'Jane Smith': 39 }, electoralVotes: 7 },
        { state: 'DE', support: { 'John Doe': 58, 'Jane Smith': 40 }, electoralVotes: 3 },
        { state: 'FL', support: { 'John Doe': 48, 'Jane Smith': 51 }, electoralVotes: 29 },
        { state: 'GA', support: { 'John Doe': 49.5, 'Jane Smith': 49.2 }, electoralVotes: 16 },
        { state: 'HI', support: { 'John Doe': 63, 'Jane Smith': 34 }, electoralVotes: 4 },
        { state: 'ID', support: { 'John Doe': 33, 'Jane Smith': 64 }, electoralVotes: 4 },
        { state: 'IL', support: { 'John Doe': 57, 'Jane Smith': 40 }, electoralVotes: 20 },
        { state: 'IN', support: { 'John Doe': 41, 'Jane Smith': 57 }, electoralVotes: 11 },
        { state: 'IA', support: { 'John Doe': 45, 'Jane Smith': 52 }, electoralVotes: 6 },
        { state: 'KS', support: { 'John Doe': 41, 'Jane Smith': 56 }, electoralVotes: 6 },
        { state: 'KY', support: { 'John Doe': 36, 'Jane Smith': 62 }, electoralVotes: 8 },
        { state: 'LA', support: { 'John Doe': 39, 'Jane Smith': 59 }, electoralVotes: 8 },
        { state: 'ME', support: { 'John Doe': 53, 'Jane Smith': 43 }, electoralVotes: 4 },
        { state: 'MD', support: { 'John Doe': 65, 'Jane Smith': 32 }, electoralVotes: 10 },
        { state: 'MA', support: { 'John Doe': 65, 'Jane Smith': 32 }, electoralVotes: 11 },
        { state: 'MI', support: { 'John Doe': 50.6, 'Jane Smith': 47.8 }, electoralVotes: 16 },
        { state: 'MN', support: { 'John Doe': 52, 'Jane Smith': 45 }, electoralVotes: 10 },
        { state: 'MS', support: { 'John Doe': 40, 'Jane Smith': 58 }, electoralVotes: 6 },
        { state: 'MO', support: { 'John Doe': 41, 'Jane Smith': 57 }, electoralVotes: 10 },
        { state: 'MT', support: { 'John Doe': 41, 'Jane Smith': 57 }, electoralVotes: 3 },
        { state: 'NE', support: { 'John Doe': 39, 'Jane Smith': 58 }, electoralVotes: 5 },
        { state: 'NV', support: { 'John Doe': 50, 'Jane Smith': 48 }, electoralVotes: 6 },
        { state: 'NH', support: { 'John Doe': 52, 'Jane Smith': 45 }, electoralVotes: 4 },
        { state: 'NJ', support: { 'John Doe': 59, 'Jane Smith': 39 }, electoralVotes: 14 },
        { state: 'NM', support: { 'John Doe': 54, 'Jane Smith': 43 }, electoralVotes: 5 },
        { state: 'NY', support: { 'John Doe': 60, 'Jane Smith': 38 }, electoralVotes: 29 },
        { state: 'NC', support: { 'John Doe': 48, 'Jane Smith': 50 }, electoralVotes: 15 },
        { state: 'ND', support: { 'John Doe': 31, 'Jane Smith': 65 }, electoralVotes: 3 },
        { state: 'OH', support: { 'John Doe': 45, 'Jane Smith': 53 }, electoralVotes: 18 },
        { state: 'OK', support: { 'John Doe': 32, 'Jane Smith': 65 }, electoralVotes: 7 },
        { state: 'OR', support: { 'John Doe': 56, 'Jane Smith': 40 }, electoralVotes: 7 },
        { state: 'PA', support: { 'John Doe': 50.1, 'Jane Smith': 48.8 }, electoralVotes: 20 },
        { state: 'RI', support: { 'John Doe': 59, 'Jane Smith': 38 }, electoralVotes: 4 },
        { state: 'SC', support: { 'John Doe': 43, 'Jane Smith': 55 }, electoralVotes: 9 },
        { state: 'SD', support: { 'John Doe': 35, 'Jane Smith': 61 }, electoralVotes: 3 },
        { state: 'TN', support: { 'John Doe': 37, 'Jane Smith': 60 }, electoralVotes: 11 },
        { state: 'TX', support: { 'John Doe': 46, 'Jane Smith': 52 }, electoralVotes: 38 },
        { state: 'UT', support: { 'John Doe': 37, 'Jane Smith': 58 }, electoralVotes: 6 },
        { state: 'VT', support: { 'John Doe': 66, 'Jane Smith': 30 }, electoralVotes: 3 },
        { state: 'VA', support: { 'John Doe': 54, 'Jane Smith': 44 }, electoralVotes: 13 },
        { state: 'WA', support: { 'John Doe': 58, 'Jane Smith': 38 }, electoralVotes: 12 },
        { state: 'WV', support: { 'John Doe': 29, 'Jane Smith': 68 }, electoralVotes: 5 },
        { state: 'WI', support: { 'John Doe': 49.4, 'Jane Smith': 48.8 }, electoralVotes: 10 },
        { state: 'WY', support: { 'John Doe': 26, 'Jane Smith': 70 }, electoralVotes: 3 },
      ],
      trendData: {
        'John Doe': [
          { date: '2025-06-01', value: 48 },
          { date: '2025-06-03', value: 49 },
          { date: '2025-06-08', value: 49.5 },
          { date: '2025-06-11', value: 51.2 },
        ],
        'Jane Smith': [
          { date: '2025-06-01', value: 50 },
          { date: '2025-06-03', value: 49.5 },
          { date: '2025-06-08', value: 49 },
          { date: '2025-06-11', value: 48.8 },
        ],
      },
    };
  }

  getMockNews() {
    return [
      { id: 1, title: 'Latest Poll Shows Tight Presidential Race', time: '15 min ago', source: 'AP News' },
      { id: 2, title: 'Early Voting Numbers Exceed 2020 Levels', time: '1 hour ago', source: 'Reuters' },
      { id: 3, title: 'Supreme Court Ruling on Election Laws', time: '3 hours ago', source: 'CNN' },
      { id: 4, title: 'Candidate Debate Schedule Released', time: '5 hours ago', source: 'NPR' }
    ];
  }

  getMockCompetitiveRaces() {
    return [
      { name: 'Pennsylvania Senate', state: 'PA', type: 'Senate', margin: '0.8', leader: 'John Doe (D)', trending: 'up' },
      { name: 'Arizona Governor', state: 'AZ', type: 'Governor', margin: '1.1', leader: 'Jane Smith (R)', trending: 'down' },
      { name: 'Georgia Senate', state: 'GA', type: 'Senate', margin: '0.5', leader: 'John Doe (D)', trending: 'up' },
      { name: 'Nevada Senate', state: 'NV', type: 'Senate', margin: '2.2', leader: 'Jane Smith (R)', trending: 'stable' }
    ];
  }

  getMockStats() {
    return {
      voterTurnout: 67.8,
      totalPolls: 1247,
      activeRaces: 435,
      lastUpdated: new Date().toLocaleTimeString()
    };
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.updateCallbacks.clear();
  }
}

export default new LiveDataService();

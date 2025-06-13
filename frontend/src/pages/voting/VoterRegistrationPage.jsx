import React, { useState } from 'react';

const states = ["California", "Texas", "Florida", "New York", "Pennsylvania"];
const counties = {
  California: ["Los Angeles", "San Diego", "Orange"],
  Texas: ["Harris", "Dallas", "Tarrant"],
  Florida: ["Miami-Dade", "Broward", "Palm Beach"],
  "New York": ["Kings", "Queens", "New York"],
  Pennsylvania: ["Philadelphia", "Allegheny", "Montgomery"],
};

const VoterRegistrationPage = () => {
  const [selectedState, setSelectedState] = useState(states[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registrationData = {
      name: formData.get('fullName'),
      dob: formData.get('dob'),
      gender: formData.get('gender'),
      state: formData.get('state'),
      county: formData.get('county'),
      electionType: formData.get('electionType'),
      votingSystem: formData.get('votingSystem'),
      party: formData.get('party'),
      voterSignature: formData.get('voterSignature'),
      agreedToTerms: formData.get('agreedToTerms') === 'on',
    };
    console.log('Voter Registration Submitted:', registrationData);
    alert('Registration successful! Check the browser console for the submitted data object.');
    e.target.reset();
    setSelectedState(states[0]);
  };

  return (
    <div className="p-4 sm:p-8 text-white min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10 border-b-2 border-gray-700 pb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Voter Registration Form</h1>
          <p className="text-gray-400 text-lg mt-2">(Fictional Simulation)</p>
        </header>

        <form onSubmit={handleSubmit} className="p-8 bg-gray-800/50 rounded-2xl shadow-xl space-y-8" style={{border: "1px solid rgba(255, 255, 255, 0.1)"}}>
          
          {/* Personal Info */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">Full Name (or Simulated Name)</label>
              <input type="text" name="fullName" id="fullName" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
                <input type="date" name="dob" id="dob" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select id="gender" name="gender" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Location Info */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">State</label>
              <select id="state" name="state" value={selectedState} onChange={(e) => setSelectedState(e.target.value)} required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500">
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-300 mb-2">County / District</label>
              <select id="county" name="county" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500">
                {counties[selectedState]?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </fieldset>

          {/* Election Info */}
          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="electionType" className="block text-sm font-medium text-gray-300 mb-2">Election Type</label>
                <select id="electionType" name="electionType" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>General</option>
                    <option>Primary</option>
                    <option>Runoff</option>
                </select>
            </div>
            <div>
                <label htmlFor="votingSystem" className="block text-sm font-medium text-gray-300 mb-2">Preferred System</label>
                <select id="votingSystem" name="votingSystem" required className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Ranked Choice</option>
                    <option>Approval</option>
                    <option>Score</option>
                    <option>First Past the Post</option>
                </select>
            </div>
             <div>
                <label htmlFor="party" className="block text-sm font-medium text-gray-300 mb-2">Party Affiliation</label>
                <select id="party" name="party" className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Independent</option>
                    <option>Democrat</option>
                    <option>Republican</option>
                    <option>Green</option>
                    <option>Libertarian</option>
                </select>
            </div>
          </fieldset>

          {/* Security & Submission */}
          <fieldset>
             <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 text-yellow-300 rounded-lg mb-6">
                <strong>Registration Deadline:</strong> October 11, 2024 (Data is pulled dynamically from backend logic)
            </div>
            <div>
              <label htmlFor="voterSignature" className="block text-sm font-medium text-gray-300 mb-2">Voter "Signature" (Type your full name)</label>
              <input type="text" name="voterSignature" id="voterSignature" required className="w-full p-3 font-serif italic bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Your typed signature here..."/>
            </div>
            <div className="mt-6">
                <label htmlFor="agreedToTerms" className="flex items-center">
                    <input type="checkbox" name="agreedToTerms" id="agreedToTerms" required className="h-5 w-5 accent-blue-500 bg-gray-700 border-gray-600 rounded" />
                    <span className="ml-3 text-gray-300">I understand this is a fictional simulation and does not constitute a real voter registration.</span>
                </label>
            </div>
          </fieldset>

          <button type="submit" className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoterRegistrationPage; 
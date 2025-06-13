import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { createBill } from '../../api/legislationApi';

const BillSubmissionCard = ({ onBillSubmitted }) => {
    const { user } = useAuthStore();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [committee, setCommittee] = useState('Finance');
    const [coSponsors, setCoSponsors] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const playGavelSound = () => {
        // In a real implementation, you might have an audio file.
        // new Audio('/sounds/gavel.mp3').play();
        console.log("*Gavel Sound*");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("Authentication error. Please log in.");
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const billData = { title, description: summary, sponsorId: user.id };
            await createBill(billData);
            playGavelSound();
            if (onBillSubmitted) {
                onBillSubmitted();
            }
            // Reset form
            setTitle('');
            setSummary('');
        } catch (err) {
            setError("Failed to submit the bill. The chamber may not be in session.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700 shadow-xl">
            <h2 className="text-3xl text-blue-300 font-bold mb-4">🖋️ Draft Legislation</h2>
            
            {error && <div className="bg-red-900 border border-red-700 text-white p-3 rounded-lg mb-4">{error}</div>}

            <input 
                placeholder="Bill Title (e.g., Infrastructure Modernization Act)" 
                className="w-full mb-4 text-xl rounded-lg bg-zinc-700 p-3 text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea 
                placeholder="Bill Summary — State your legislative intent..." 
                rows={4} 
                className="w-full mb-4 rounded-lg bg-zinc-700 p-3 text-white placeholder-zinc-400 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
            />
          
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-white font-semibold">Select Committee</label>
              <select className="bg-zinc-800 text-white rounded p-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500" value={committee} onChange={(e) => setCommittee(e.target.value)}>
                <option>Finance</option>
                <option>Defense</option>
                <option>Civil Rights</option>
              </select>
            </div>
        
            <div className="flex flex-col gap-2 mb-6">
              <label className="text-white font-semibold">Add Co-Sponsors</label>
              <input 
                type="text" 
                placeholder="Search members..." 
                className="bg-zinc-800 text-white rounded p-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={coSponsors}
                onChange={(e) => setCoSponsors(e.target.value)}
                />
              {/* You'll eventually build a multi-select dropdown here */}
            </div>
        
            <button type="submit" className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Enter Into Record'}
            </button>
        </form>
    );
};

export default BillSubmissionCard; 
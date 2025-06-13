import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { 
    BuildingOffice2Icon, 
    UserGroupIcon, 
    BeakerIcon, 
    PaintBrushIcon, 
    CheckCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import pollingService from '../../services/pollingService';

const LaunchPollingFirmPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firmName: '',
        missionStatement: '',
        methodologyUniqueness: '',
        specialization: 'NATIONAL',
        leadPollster: '',
        teamStyle: 'LEAN',
        analystStyle: 'QUANT_HEAVY',
        pollingMethod: 'ONLINE',
        balancingMethod: 'CENSUS',
        turnoutModel: 'LIKELY_VOTER',
        logoUrl: '',
        colorScheme: 'indigo',
        slogan: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLaunched, setIsLaunched] = useState(false);
    const navigate = useNavigate();

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);
        
        const applicationData = {
            name: formData.firmName,
            description: formData.missionStatement,
            logoUrl: formData.logoUrl,
            // You can extend the backend DTO to accept these other fields
            // For now, we'll just use what the backend accepts
        };

        try {
            await pollingService.applyForPollingFirm(applicationData);
            setIsLaunched(true);
            // Wait for confetti animation to finish before redirecting
            setTimeout(() => {
                navigate('/polling/my-firm');
            }, 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during the launch sequence.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLaunched) {
        return (
            <div className="text-center py-16">
                <Confetti recycle={false} numberOfPieces={400} />
                <CheckCircleIcon className="w-24 h-24 text-green-400 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-white">Application Sent for Review!</h1>
                <p className="text-xl text-text-secondary mt-2">Your influence begins now.</p>
                <p className="text-md text-text-secondary mt-8">You will be redirected shortly...</p>
            </div>
        );
    }

    const steps = [
        { id: 1, name: 'Pitch Your Firm', icon: BuildingOffice2Icon },
        { id: 2, name: 'Build Your Team', icon: UserGroupIcon },
        { id: 3, name: 'Design Methodology', icon: BeakerIcon },
        { id: 4, name: 'Brand & Launch', icon: PaintBrushIcon },
    ];

    const renderProgressBar = () => (
        <nav aria-label="Progress" className="mb-12">
            <ol className="flex items-center">
                {steps.map((s, index) => (
                    <li key={s.id} className={`relative flex-1 ${index < steps.length - 1 ? "pr-8 sm:pr-20" : ""}`}>
                        {s.id < step ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-accent"></div>
                                </div>
                                <button onClick={() => setStep(s.id)} className="relative w-8 h-8 flex items-center justify-center bg-accent rounded-full hover:bg-accent-hover">
                                    <CheckCircleIcon className="w-5 h-5 text-white" />
                                </button>
                            </>
                        ) : s.id === step ? (
                            <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-700"></div>
                                </div>
                                <div className="relative w-8 h-8 flex items-center justify-center bg-background border-2 border-accent rounded-full">
                                    <span className="h-2.5 w-2.5 bg-accent rounded-full"></span>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="h-0.5 w-full bg-gray-700"></div>
                                </div>
                                <div className="group relative w-8 h-8 flex items-center justify-center bg-background border-2 border-gray-600 rounded-full hover:border-gray-400">
                                     <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-400"></span>
                                </div>
                            </>
                        )}
                        <p className="absolute -bottom-8 w-20 text-center text-sm font-medium text-text-secondary">{s.name}</p>
                    </li>
                ))}
            </ol>
        </nav>
    );

    const renderStepContent = () => {
        const inputClass = "block w-full bg-background-dark border border-border rounded-md shadow-sm py-3 px-4 text-text-primary focus:outline-none focus:ring-accent focus:border-accent";
        const labelClass = "block text-lg font-semibold text-text-primary mb-2";

        switch (step) {
            case 1: // Pitch Your Firm
                return (
                    <div className="space-y-8">
                        <div>
                            <label htmlFor="firmName" className={labelClass}>Firm Name</label>
                            <input type="text" name="firmName" value={formData.firmName} onChange={handleChange} className={inputClass} placeholder="e.g., DataForge Polling, Apex Insights" />
                        </div>
                        <div>
                            <label htmlFor="missionStatement" className={labelClass}>Mission Statement</label>
                            <textarea name="missionStatement" value={formData.missionStatement} onChange={handleChange} rows="3" className={inputClass} placeholder="What is your firm's core purpose?"></textarea>
                        </div>
                        <div>
                            <label htmlFor="methodologyUniqueness" className={labelClass}>What makes your methodology unique?</label>
                            <textarea name="methodologyUniqueness" value={formData.methodologyUniqueness} onChange={handleChange} rows="3" className={inputClass} placeholder="e.g., 'We use AI-driven sentiment analysis on social media...'"></textarea>
                        </div>
                        <div>
                            <label htmlFor="specialization" className={labelClass}>Polling Specialization</label>
                            <select name="specialization" value={formData.specialization} onChange={handleChange} className={inputClass}>
                                <option value="NATIONAL">National Elections</option>
                                <option value="STATE">State & Regional Races</option>
                                <option value="YOUTH">Youth & Demographic Polling</option>
                                <option value="ISSUE">Issue-Based & Policy Polling</option>
                            </select>
                        </div>
                    </div>
                );

            case 2: // Build Your Team
                 return (
                    <div className="space-y-8">
                        <div>
                            <label htmlFor="leadPollster" className={labelClass}>Lead Pollster Bio</label>
                            <textarea name="leadPollster" value={formData.leadPollster} onChange={handleChange} rows="3" className={inputClass} placeholder="Introduce your key expert. What's their background?"></textarea>
                        </div>
                        <div>
                            <label htmlFor="teamStyle" className={labelClass}>Research Team Structure</label>
                            <select name="teamStyle" value={formData.teamStyle} onChange={handleChange} className={inputClass}>
                                <option value="LEAN">Lean & Agile (AI-Assisted)</option>
                                <option value="TRADITIONAL">Traditional (Human-led)</option>
                                <option value="HYBRID">Hybrid Model</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="analystStyle" className={labelClass}>Data Analyst Style</label>
                            <select name="analystStyle" value={formData.analystStyle} onChange={handleChange} className={inputClass}>
                                <option value="QUANT_HEAVY">Quant-Heavy Focus</option>
                                <option value="TURNOUT_MODELING">Turnout Modeling Specialists</option>
                                <option value="ISSUE_SEGMENTATION">Issue Segmentation Experts</option>
                            </select>
                        </div>
                    </div>
                );

            case 3: // Design Your Methodology
                return (
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                             <div>
                                <label htmlFor="pollingMethod" className={labelClass}>Primary Polling Method</label>
                                <select name="pollingMethod" value={formData.pollingMethod} onChange={handleChange} className={inputClass}>
                                    <option value="ONLINE">Online Panel</option>
                                    <option value="PHONE">Live Phone Calls</option>
                                    <option value="IVR">Automated (IVR) Calls</option>
                                    <option value="IN_PERSON">In-Person</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="balancingMethod" className={labelClass}>Sample Balancing</label>
                                <select name="balancingMethod" value={formData.balancingMethod} onChange={handleChange} className={inputClass}>
                                    <option value="CENSUS">Census-Weighted (Demographics)</option>
                                    <option value="PID">Party ID Quotas</option>
                                    <option value="EDUCATION">Education & Income Weighting</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="turnoutModel" className={labelClass}>Turnout Modeling</label>
                                <select name="turnoutModel" value={formData.turnoutModel} onChange={handleChange} className={inputClass}>
                                    <option value="LIKELY_VOTER">Likely Voter Screen</option>
                                    <option value="REGISTERED_VOTER">All Registered Voters</option>
                                    <option value="ADULT_POPULATION">All Adult Population</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-background-dark p-6 rounded-lg border border-border">
                             <h3 className="text-xl font-bold text-accent mb-4">Methodology Card Preview</h3>
                             <div className="space-y-3 text-text-secondary">
                                 <p><strong>Method:</strong> {formData.pollingMethod}</p>
                                 <p><strong>Balancing:</strong> {formData.balancingMethod}</p>
                                 <p><strong>Turnout Model:</strong> {formData.turnoutModel}</p>
                             </div>
                             <div className="text-center mt-6 p-4 border-2 border-dashed border-border rounded-lg">
                                 <p className="text-text-secondary text-sm">This card will appear with your published polls.</p>
                             </div>
                        </div>
                    </div>
                );

            case 4: // Brand & Launch
                return (
                     <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                             <div>
                                <label htmlFor="logoUrl" className={labelClass}>Logo URL</label>
                                <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className={inputClass} placeholder="https://example.com/logo.png"/>
                            </div>
                             <div>
                                <label htmlFor="slogan" className={labelClass}>Slogan (Optional)</label>
                                <input type="text" name="slogan" value={formData.slogan} onChange={handleChange} className={inputClass} placeholder="e.g., 'Clarity in the Chaos'"/>
                            </div>
                            <div>
                                <label htmlFor="colorScheme" className={labelClass}>Firm Color Scheme</label>
                                <select name="colorScheme" value={formData.colorScheme} onChange={handleChange} className={inputClass}>
                                    <option value="indigo">Indigo</option>
                                    <option value="sky">Sky Blue</option>
                                    <option value="rose">Rose</option>
                                    <option value="amber">Amber</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-background-dark p-6 rounded-lg border border-border">
                             <h3 className="text-xl font-bold text-text-primary mb-4">Simulated Press Preview</h3>
                             <div className="p-4 rounded-lg bg-card shadow-lg">
                                 <div className="flex items-center">
                                    {formData.logoUrl ? <img src={formData.logoUrl} alt="logo" className="w-12 h-12 rounded-full mr-4"/> : <div className="w-12 h-12 rounded-full mr-4 bg-background flex items-center justify-center text-accent font-bold text-xl">{formData.firmName.charAt(0)}</div>}
                                    <div>
                                         <h4 className={`text-lg font-bold text-${formData.colorScheme}-400`}>{formData.firmName || "Your Firm Name"}</h4>
                                         <p className="text-sm text-text-secondary">{formData.slogan || "Your compelling slogan"}</p>
                                    </div>
                                 </div>
                             </div>
                             <p className="text-sm text-center text-text-secondary mt-4">This is how your firm will appear on the leaderboards.</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-background text-text-primary min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        Launch Your <span className="text-accent">Polling Firm</span>
                    </h1>
                    <p className="mt-4 text-lg text-text-secondary">
                        A guided journey to establish your presence in the world of political analysis.
                    </p>
                </div>

                {renderProgressBar()}

                <div className="mt-16 bg-card p-8 rounded-2xl shadow-2xl border border-border">
                    {renderStepContent()}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <div>
                        {step > 1 && (
                            <button onClick={prevStep} className="flex items-center px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                                Back
                            </button>
                        )}
                    </div>
                    <div>
                        {step < 4 ? (
                             <button onClick={nextStep} className="flex items-center px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity">
                                Next
                                <ArrowRightIcon className="w-4 h-4 ml-2"/>
                            </button>
                        ) : (
                            <button onClick={handleSubmit} disabled={isLoading} className="flex items-center px-6 py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50">
                                {isLoading ? 'Launching...' : 'Launch My Firm 🚀'}
                            </button>
                        )}
                    </div>
                </div>
                 {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                 <div className="text-center mt-12 p-4 border-2 border-dashed border-border rounded-lg">
                    <h4 className="font-semibold text-accent">🏆 Leaderboard Teaser</h4>
                    <p className="text-text-secondary text-sm">You’ll be ranked based on accuracy and neutrality after your first 3 polls.</p>
                </div>
            </div>
        </div>
    );
};

export default LaunchPollingFirmPage;

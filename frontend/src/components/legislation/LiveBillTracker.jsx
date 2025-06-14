import React, { useState, useEffect } from 'react';
import { getSpeeches, getAmendmentsForBill } from '../../api/legislationApi';
import { safeCall, safeCallAsync } from '../../utils/safeCall';
import { ClockIcon, ChatBubbleBottomCenterTextIcon, DocumentPlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const eventIcons = {
    'BILL_INTRODUCED': <ClockIcon className="h-6 w-6 text-blue-500" />,
    'SPEECH': <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-yellow-500" />,
    'AMENDMENT_PROPOSED': <DocumentPlusIcon className="h-6 w-6 text-purple-500" />,
    'STATUS_CHANGE': <CheckCircleIcon className="h-6 w-6 text-green-500" />,
};

const LiveBillTracker = ({ bill }) => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!bill) return;

        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const billCreationEvent = {
                    type: 'BILL_INTRODUCED',
                    date: bill.createdAt,
                    description: `Bill "${bill.title}" was introduced.`
                };

                const [speechResponse, amendmentResponse] = await Promise.all([
                    safeCallAsync(() => getSpeeches(bill.id)),
                    safeCallAsync(() => getAmendmentsForBill(bill.id))
                ]);

                const speechEvents = (speechResponse?.data || []).map(s => ({
                    type: 'SPEECH',
                    date: s.createdAt,
                    description: `A speech was delivered by speaker ${s.speaker?.username || s.speakerId || 'Unknown'}.`
                }));

                const amendmentEvents = (amendmentResponse?.data || []).map(a => ({
                    type: 'AMENDMENT_PROPOSED',
                    date: a.createdAt,
                    description: `An amendment was proposed by sponsor ${a.sponsor?.username || a.sponsorId || 'Unknown'}. Status: ${a.status || 'Unknown'}`
                }));

                const allEvents = [billCreationEvent, ...speechEvents, ...amendmentEvents];
                allEvents.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending

                setEvents(allEvents);
            } catch (err) {
                console.error("Failed to fetch bill events:", err);
                setError("Could not load bill timeline.");
                // Set fallback events with just the bill creation
                const fallbackEvents = [{
                    type: 'BILL_INTRODUCED',
                    date: bill.createdAt,
                    description: `Bill "${bill.title}" was introduced.`
                }];
                setEvents(fallbackEvents);
            } finally {
                setIsLoading(false);
            }
        };

        safeCall(fetchEvents);
    }, [bill]);

    if (isLoading) return <div className="p-4 text-center">Loading Bill History...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Live Bill Tracker</h3>
            <div className="flow-root">
                <ul className="-mb-8">
                    {events.map((event, eventIdx) => (
                        <li key={event.date + event.type + eventIdx}>
                            <div className="relative pb-8">
                                {eventIdx !== events.length - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                                            {eventIcons[event.type] || eventIcons['STATUS_CHANGE']}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-500">{event.description}</p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                            <time dateTime={event.date}>{new Date(event.date).toLocaleDateString()}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LiveBillTracker; 
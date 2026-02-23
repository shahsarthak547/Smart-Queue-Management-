import React, { createContext, useContext, useState, useEffect } from 'react';

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
    const [queueData, setQueueData] = useState(() => {
        const saved = localStorage.getItem('smart_queue_data');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Ensure the new limit of 8 is applied even to existing stored data
            return { ...parsed, swapsTotal: 8 };
        }
        return {
            activeToken: {
                number: 49,
                place: "Global Trust Bank",
                peopleAhead: 7,
                waitTime: "35 mins",
                progress: 85,
                status: "Waiting"
            },
            swapHistory: [
                { id: 1, from: 49, to: 41, time: "Just now", type: "FCFS Jump" }
            ],
            swapsUsed: 2,
            swapsTotal: 8
        };
    });

    useEffect(() => {
        localStorage.setItem('smart_queue_data', JSON.stringify(queueData));
    }, [queueData]);

    const canSwap = queueData.swapsUsed < queueData.swapsTotal;

    const performSwap = (newNumber, ahead) => {
        if (!canSwap) return;

        setQueueData(prev => ({
            ...prev,
            activeToken: {
                ...prev.activeToken,
                number: newNumber,
                peopleAhead: ahead,
                waitTime: `${ahead * 5} mins`,
                progress: Math.min(100, Math.max(0, 100 - (ahead * 10))),
                status: "Waiting"
            },
            swapHistory: [
                { id: Date.now(), from: prev.activeToken.number, to: newNumber, time: "Just now", type: "Manual Swap" },
                ...prev.swapHistory
            ],
            swapsUsed: prev.swapsUsed + 1
        }));
    };

    const snoozeQueue = () => {
        setQueueData(prev => ({
            ...prev,
            activeToken: {
                ...prev.activeToken,
                peopleAhead: prev.activeToken.peopleAhead + 5,
                waitTime: `${(prev.activeToken.peopleAhead + 5) * 5} mins`,
                progress: Math.max(0, prev.activeToken.progress - 20)
            }
        }));
    };

    const markCompleted = () => {
        setQueueData(prev => ({
            ...prev,
            activeToken: {
                ...prev.activeToken,
                status: "Completed",
                peopleAhead: 0,
                progress: 100
            }
        }));
    };

    return (
        <QueueContext.Provider value={{ queueData, performSwap, snoozeQueue, markCompleted, canSwap }}>
            {children}
        </QueueContext.Provider>
    );
};

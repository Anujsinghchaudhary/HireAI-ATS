import { useEffect, useState } from 'react';
import './ScoreGauge.css';

export default function ScoreGauge({ score = 0, size = 140, label = 'Match Score' }) {
    const [animatedScore, setAnimatedScore] = useState(0);
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    const getScoreColor = (s) => {
        if (s >= 80) return '#22c55e';
        if (s >= 60) return '#f59e0b';
        if (s >= 40) return '#f97316';
        return '#ef4444';
    };

    const getScoreLabel = (s) => {
        if (s >= 80) return 'Excellent';
        if (s >= 60) return 'Good';
        if (s >= 40) return 'Fair';
        return 'Low';
    };

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 100);
        return () => clearTimeout(timer);
    }, [score]);

    const color = getScoreColor(score);

    return (
        <div className="score-gauge">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.1)"
                    strokeWidth="10"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{
                        transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.3s ease',
                        filter: `drop-shadow(0 0 6px ${color}40)`
                    }}
                />
                <text
                    x={size / 2}
                    y={size / 2 - 8}
                    textAnchor="middle"
                    className="score-value-text"
                    fill={color}
                >
                    {animatedScore}
                </text>
                <text
                    x={size / 2}
                    y={size / 2 + 14}
                    textAnchor="middle"
                    className="score-label-text"
                >
                    {getScoreLabel(score)}
                </text>
            </svg>
            <span className="score-gauge-label">{label}</span>
        </div>
    );
}

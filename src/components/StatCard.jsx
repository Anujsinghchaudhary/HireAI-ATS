import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, trend, trendValue, color = 'primary' }) {
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral';

    return (
        <div className="stat-card glass-card">
            <div className="stat-card-header">
                <div className={`stat-icon stat-icon-${color}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <div className={`stat-trend ${trendClass}`}>
                        <TrendIcon size={14} />
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

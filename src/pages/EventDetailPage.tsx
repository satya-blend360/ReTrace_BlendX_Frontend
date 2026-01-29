// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Button, Spin, Alert, Tag, Switch } from 'antd';
// import {
//     ArrowLeft,
//     AlertTriangle,
//     CheckCircle,
//     TrendingUp,
//     Lightbulb,
//     Play,
//     RefreshCw,
//     MessageSquare,
// } from 'lucide-react';

// interface SimulationResult {
//     new_safety_stock: number;
//     new_threshold: number;
//     projected_stock_after_fix: number;
//     outcome: string;
// }

// interface EventAnalysis {
//     projected_stock: number;
//     reorder_need_threshold: number;
//     explanation: string;
//     item_id: string;
//     warehouse_id: string;
//     stockout_date: string;
//     snapshot: {
//         stock_on_hand: number;
//         incoming_qty: number;
//         forecast_daily_demand: number;
//         lead_time_days: number;
//         safety_stock: number;
//         stale_fields?: string[];
//     };
//     decision_logic: {
//         explanation: string;
//         projected_stock: number;
//         reorder_threshold: number;
//     };
//     root_cause: {
//         description: string;
//         factors: string[];
//     };
//     fix_simulations: Array<{
//         modification: string;
//         result: string;
//         outcome: string;
//     }>;
//     minimal_fix: string;
//     recommendation: string;
// }

// export default function EventDetailPage() {
//     const { itemId } = useParams<{ itemId: string }>();
//     const navigate = useNavigate();
//     const [analysis, setAnalysis] = useState<EventAnalysis | null>(null);
//     const [simulation, setSimulation] = useState<SimulationResult | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [simulationLoading, setSimulationLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [showNLSummary, setShowNLSummary] = useState(true);
//     const apiBase = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         loadEventAnalysis();
//     }, [itemId]);

//     const loadEventAnalysis = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const accessToken = localStorage.getItem('access_token');
//             const response = await fetch(`${apiBase}/events/analysis/${itemId}`, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to load event analysis');
//             }

//             const data: EventAnalysis = await response.json();
//             setAnalysis(data);
//         } catch (err) {
//             console.error('Error loading event analysis:', err);
//             setError(err instanceof Error ? err.message : 'Failed to load analysis');
//         }
//         setLoading(false);
//     };

//     const runSimulation = async () => {
//         setSimulationLoading(true);
//         try {
//             const accessToken = localStorage.getItem('access_token');
//             const response = await fetch(`${apiBase}/events/${itemId}/simulate`, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to run simulation');
//             }

//             const data: SimulationResult = await response.json();
//             setSimulation(data);
//         } catch (err) {
//             console.error('Error running simulation:', err);
//         }
//         setSimulationLoading(false);
//     };

//     const generateNaturalLanguageSummary = () => {
//         if (!analysis) return '';

//         const itemName = itemId;
//         const threshold = analysis.reorder_need_threshold;
//         const projectedStock = analysis.projected_stock;

//         return `${itemName} stocked out because the forecast underestimated demand and safety stock didn't cover the supplier delay. The projected stock (${projectedStock} units) fell below the reorder threshold (${threshold} units), indicating the system should have triggered a reorder but didn't. A small increase in safety stock would have prevented the failure. Updating safety stock dynamically based on demand volatility and lead time changes would reduce risk of future stockouts.`;
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     if (error || !analysis) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
//                 <div className="max-w-7xl mx-auto">
//                     <Button
//                         icon={<ArrowLeft className="w-4 h-4" />}
//                         onClick={() => navigate('/dashboard')}
//                         className="mb-4"
//                     >
//                         Back to Dashboard
//                     </Button>
//                     <Alert
//                         message="Error"
//                         description={error || 'Event analysis not found'}
//                         type="error"
//                         showIcon
//                     />
//                 </div>
//             </div>
//         );
//     }

//     const shouldHaveTriggered = analysis.explanation === "REORDER SHOULD HAVE TRIGGERED";

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//             <div className="max-w-7xl mx-auto px-6 py-8">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <Button
//                         icon={<ArrowLeft className="w-4 h-4" />}
//                         onClick={() => navigate('/dashboard')}
//                         className="mb-4"
//                     >
//                         Back to Dashboard
//                     </Button>
//                     <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                         Event Analysis: {itemId}
//                     </h1>
//                     <p className="text-gray-600 text-lg">
//                         Stockout Event Analysis
//                     </p>
//                 </div>

//                 {/* Analysis Results */}
//                 <div className="space-y-6">
//                     {/* Decision Analysis Card */}
//                     <Card className="shadow-lg border-0">
//                         <div className="flex items-start gap-4">
//                             <div className={`p-3 rounded-lg ${shouldHaveTriggered ? 'bg-red-100' : 'bg-green-100'}`}>
//                                 {shouldHaveTriggered ? (
//                                     <AlertTriangle className="w-8 h-8 text-red-600" />
//                                 ) : (
//                                     <CheckCircle className="w-8 h-8 text-green-600" />
//                                 )}
//                             </div>
//                             <div className="flex-1">
//                                 <h2 className="text-2xl font-bold text-gray-900 mb-4">Decision Analysis</h2>
//                                 <Alert
//                                     message={analysis.explanation}
//                                     type={shouldHaveTriggered ? 'error' : 'success'}
//                                     showIcon
//                                     className="mb-4"
//                                 />
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Stock Analysis */}
//                     <Card className="shadow-lg border-0">
//                         <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//                             <TrendingUp className="w-6 h-6 text-blue-600" />
//                             Stock vs Threshold Comparison
//                         </h3>
//                         <div className="grid md:grid-cols-2 gap-6">
//                             <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
//                                 <p className="text-sm text-gray-600 mb-2">Projected Stock</p>
//                                 <p className="text-4xl font-bold text-blue-900">{analysis.projected_stock}</p>
//                                 <p className="text-sm text-gray-600 mt-2">units</p>
//                             </div>
//                             <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
//                                 <p className="text-sm text-gray-600 mb-2">Reorder Threshold</p>
//                                 <p className="text-4xl font-bold text-purple-900">{analysis.reorder_need_threshold}</p>
//                                 <p className="text-sm text-gray-600 mt-2">units</p>
//                             </div>
//                         </div>

//                         {/* Visual Comparison */}
//                         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                             <h4 className="font-semibold text-gray-900 mb-3">Decision Logic</h4>
//                             <div className="bg-white p-4 rounded-md border-l-4 border-red-500">
//                                 <p className="text-gray-900 font-medium">
//                                     Projected stock ({analysis.projected_stock})
//                                     {analysis.projected_stock > analysis.reorder_need_threshold ? ' > ' : ' ≤ '}
//                                     reorder threshold ({analysis.reorder_need_threshold})
//                                 </p>
//                                 <p className="text-gray-600 mt-2">
//                                     ➡ {shouldHaveTriggered ? (
//                                         <span className="text-red-700 font-semibold">Reorder should have been triggered but wasn't</span>
//                                     ) : (
//                                         <span className="text-green-700 font-semibold">No reorder needed</span>
//                                     )}
//                                 </p>
//                             </div>
//                         </div>
//                     </Card>

//                     {/* Root Cause Section */}
//                     {shouldHaveTriggered && (
//                         <Card className="shadow-lg border-0 bg-red-50 border border-red-200">
//                             <div className="flex items-start gap-3">
//                                 <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
//                                 <div>
//                                     <h3 className="text-xl font-bold text-gray-900 mb-2">Root Cause Identified</h3>
//                                     <p className="text-gray-900">
//                                         The system failed to trigger a reorder despite the projected stock being below the threshold.
//                                         This indicates a potential issue with:
//                                     </p>
//                                     <ul className="list-disc list-inside mt-3 space-y-1 text-gray-700">
//                                         <li>Forecast accuracy - demand may have been underestimated</li>
//                                         <li>Safety stock levels - may be too low for current demand volatility</li>
//                                         <li>Reorder threshold calculation - needs recalibration</li>
//                                         <li>Data staleness - inventory data may not have been up to date</li>
//                                     </ul>
//                                 </div>
//                             </div>
//                         </Card>
//                     )}

//                     {/* Natural Language Summary */}
//                     {showNLSummary && (
//                         <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
//                             <div className="flex items-start justify-between mb-4">
//                                 <div className="flex items-center gap-3">
//                                     <MessageSquare className="w-6 h-6 text-indigo-600" />
//                                     <h3 className="text-xl font-bold text-gray-900">AI Summary</h3>
//                                 </div>
//                                 <Switch
//                                     checked={showNLSummary}
//                                     onChange={setShowNLSummary}
//                                     checkedChildren="Show"
//                                     unCheckedChildren="Hide"
//                                 />
//                             </div>
//                             <p className="text-gray-900 leading-relaxed italic">
//                                 "{generateNaturalLanguageSummary()}"
//                             </p>
//                         </Card>
//                     )}

//                     {/* Counterfactual Simulation Section */}
//                     <Card className="shadow-lg border-0">
//                         <div className="flex items-center justify-between mb-4">
//                             <div className="flex items-center gap-3">
//                                 <div className="bg-purple-100 p-2 rounded-lg">
//                                     <Play className="w-6 h-6 text-purple-600" />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-xl font-bold text-gray-900">Minimal Fix Simulation</h3>
//                                     <p className="text-sm text-gray-600">Run counterfactual analysis to find minimal fix</p>
//                                 </div>
//                             </div>
//                             <Button
//                                 type="primary"
//                                 icon={simulationLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
//                                 onClick={runSimulation}
//                                 loading={simulationLoading}
//                                 disabled={simulationLoading}
//                                 size="large"
//                                 className="bg-purple-600"
//                             >
//                                 {simulation ? 'Re-run Simulation' : 'Run Simulation'}
//                             </Button>
//                         </div>

//                         {simulation && (
//                             <div className="space-y-4 mt-6">
//                                 <div className="grid md:grid-cols-3 gap-4">
//                                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
//                                         <p className="text-sm text-gray-600 mb-1">New Safety Stock</p>
//                                         <p className="text-3xl font-bold text-blue-900">{simulation.new_safety_stock}</p>
//                                         <p className="text-xs text-gray-600 mt-1">units</p>
//                                     </div>
//                                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
//                                         <p className="text-sm text-gray-600 mb-1">New Threshold</p>
//                                         <p className="text-3xl font-bold text-purple-900">{simulation.new_threshold}</p>
//                                         <p className="text-xs text-gray-600 mt-1">units</p>
//                                     </div>
//                                     <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
//                                         <p className="text-sm text-gray-600 mb-1">Projected Stock After Fix</p>
//                                         <p className="text-3xl font-bold text-green-900">{simulation.projected_stock_after_fix}</p>
//                                         <p className="text-xs text-gray-600 mt-1">units</p>
//                                     </div>
//                                 </div>

//                                 <Alert
//                                     message={simulation.outcome}
//                                     type={simulation.outcome.includes('STILL FAILS') ? 'error' : 'success'}
//                                     showIcon
//                                     icon={
//                                         simulation.outcome.includes('STILL FAILS') ? (
//                                             <AlertTriangle className="w-5 h-5" />
//                                         ) : (
//                                             <CheckCircle className="w-5 h-5" />
//                                         )
//                                     }
//                                     description={
//                                         simulation.outcome.includes('STILL FAILS')
//                                             ? `Even with increased safety stock to ${simulation.new_safety_stock} units, the stockout would still occur. Further adjustments needed.`
//                                             : `This configuration would have prevented the stockout!`
//                                     }
//                                 />

//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <h4 className="font-semibold text-gray-900 mb-2">Simulation Result</h4>
//                                     <div className="text-sm text-gray-700 space-y-1">
//                                         <p>• Safety Stock: <span className="font-medium">{analysis?.projected_stock}</span> → <span className="font-bold text-blue-600">{simulation.new_safety_stock}</span></p>
//                                         <p>• Reorder Threshold: <span className="font-medium">{analysis?.reorder_need_threshold}</span> → <span className="font-bold text-purple-600">{simulation.new_threshold}</span></p>
//                                         <p>• Projected Stock After Fix: <span className="font-bold text-green-600">{simulation.projected_stock_after_fix}</span> units</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {!simulation && !simulationLoading && (
//                             <div className="text-center py-8 text-gray-500">
//                                 <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                                 <p>Click "Run Simulation" to perform counterfactual analysis</p>
//                             </div>
//                         )}
//                     </Card>


//                     {/* Recommendation Section */}
//                     <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
//                         <div className="flex items-start gap-3">
//                             <Lightbulb className="w-6 h-6 text-green-600 mt-1" />
//                             <div>
//                                 <h3 className="text-xl font-bold text-gray-900 mb-3">Recommendations</h3>
//                                 <div className="space-y-2 text-gray-900">
//                                     <p>• <strong>Immediate:</strong> Review and adjust safety stock levels based on recent demand patterns</p>
//                                     <p>• <strong>Short-term:</strong> Recalibrate reorder thresholds using historical stockout data</p>
//                                     <p>• <strong>Long-term:</strong> Implement dynamic threshold adjustment based on forecast freshness and lead time changes</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="mt-6 flex gap-3">
//                             <Button type="primary" size="large" className="bg-blue-600">
//                                 Apply Recommendation
//                             </Button>
//                             <Button size="large" onClick={() => loadEventAnalysis()}>
//                                 Re-analyze
//                             </Button>
//                         </div>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, Alert, Tag, Table, Collapse } from 'antd';
import {
    ArrowLeft,
    AlertTriangle,
    CheckCircle,
    TrendingUp,
    Lightbulb,
    Play,
    RefreshCw,
    Activity,
    Clock,
    Package,
    BarChart3,
    Users,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Area,
    AreaChart,
    ReferenceDot,
} from 'recharts';

const { Panel } = Collapse;

interface SimulationResult {
    new_safety_stock: number;
    new_threshold: number;
    projected_stock_after_fix: number;
    outcome: string;
}

interface EventAnalysis {
    projected_stock: number;
    reorder_need_threshold: number;
    explanation: string;
}

interface TimelineData {
    snapshot_time: string;
    stock_on_hand: number;
    reorder_threshold: number;
    safety_stock: number;
    status: string;
}

interface ForecastData {
    forecast_date: string;
    forecasted: number;
    forecast_confidence: number;
    confidence_level: string;
}

interface SimilarFailure {
    item_id: string;
    stockout_date: string;
    root_cause: string;
    failure_category: string;
}

interface AIAnalysis {
    item_id: string;
    ai_explanation: string;
}

export default function EventDetailPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const navigate = useNavigate();
    
    // Existing state
    const [analysis, setAnalysis] = useState<EventAnalysis | null>(null);
    const [simulation, setSimulation] = useState<SimulationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [simulationLoading, setSimulationLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // New state for additional APIs
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [forecast, setForecast] = useState<ForecastData[]>([]);
    const [similarFailures, setSimilarFailures] = useState<SimilarFailure[]>([]);
    const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null);
    const [aiLoading, setAILoading] = useState(false);
    
    const apiBase = import.meta.env.VITE_API_URL;

    useEffect(() => {
        loadAllData();
    }, [itemId]);

    const loadAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };

            // Parallel API calls
            const [analysisRes, timelineRes, forecastRes, similarRes] = await Promise.all([
                fetch(`${apiBase}/events/analysis/${itemId}`, { headers }),
                fetch(`${apiBase}/events/items/${itemId}/timeline?days=2`, { headers }),
                fetch(`${apiBase}/events/items/${itemId}/forecast-accuracy`, { headers }),
                fetch(`${apiBase}/events/items/${itemId}/similar-failures?limit=5`, { headers }),
            ]);

            if (!analysisRes.ok) throw new Error('Failed to load event analysis');

            const analysisData = await analysisRes.json();
            const timelineData = await timelineRes.json();
            const forecastData = await forecastRes.json();
            const similarData = await similarRes.json();

            setAnalysis(analysisData);
            setTimeline(timelineData);
            setForecast(forecastData);
            setSimilarFailures(similarData);

        } catch (err) {
            console.error('Error loading data:', err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        }
        setLoading(false);
    };

    const runSimulation = async () => {
        setSimulationLoading(true);
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`${apiBase}/events/${itemId}/simulate`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to run simulation');
            const data: SimulationResult = await response.json();
            setSimulation(data);
        } catch (err) {
            console.error('Error running simulation:', err);
        }
        setSimulationLoading(false);
    };

    const loadAIAnalysis = async () => {
        setAILoading(true);
        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await fetch(`${apiBase}/events/${itemId}/ai-analysis`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) throw new Error('Failed to get AI analysis');
            const data: AIAnalysis = await response.json();
            setAIAnalysis(data);
        } catch (err) {
            console.error('Error getting AI analysis:', err);
        }
        setAILoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <Spin size="large" tip="Loading event analysis..." />
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <Button
                        icon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate('/dashboard')}
                        className="mb-4"
                    >
                        Back to Dashboard
                    </Button>
                    <Alert
                        message="Error"
                        description={error || 'Event analysis not found'}
                        type="error"
                        showIcon
                    />
                </div>
            </div>
        );
    }

    const shouldHaveTriggered = analysis.explanation === "REORDER SHOULD HAVE TRIGGERED";

    // Similar failures table columns
    const similarColumns = [
        {
            title: 'Item ID',
            dataIndex: 'item_id',
            key: 'item_id',
            render: (text: string) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Date',
            dataIndex: 'stockout_date',
            key: 'stockout_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Root Cause',
            dataIndex: 'root_cause',
            key: 'root_cause',
            render: (cause: string) => (
                <Tag color="red">{cause?.replace(/_/g, ' ')}</Tag>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'failure_category',
            key: 'failure_category',
            render: (category: string) => (
                <Tag color={category === 'EXECUTION_FAILURE' ? 'orange' : 'red'}>
                    {category === 'EXECUTION_FAILURE' ? 'Execution' : 'Decision'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: SimilarFailure) => (
                <Button
                    type="link"
                    onClick={() => navigate(`/events/${record.item_id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        icon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => navigate('/dashboard')}
                        className="mb-4"
                    >
                        Back to Dashboard
                    </Button>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Event Analysis: {itemId}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Deep-dive root cause analysis and recommendations
                    </p>
                </div>

                {/* Main Analysis Card */}
                <Card className="shadow-lg border-0 mb-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${shouldHaveTriggered ? 'bg-red-100' : 'bg-green-100'}`}>
                            {shouldHaveTriggered ? (
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            ) : (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Decision Analysis</h2>
                            <Alert
                                message={analysis.explanation}
                                type={shouldHaveTriggered ? 'error' : 'success'}
                                showIcon
                                className="mb-4"
                            />
                            
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
                                    <p className="text-sm text-gray-600 mb-2">Projected Stock</p>
                                    <p className="text-4xl font-bold text-blue-900">{analysis.projected_stock}</p>
                                    <p className="text-sm text-gray-600 mt-2">units available</p>
                                </div>
                                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-600">
                                    <p className="text-sm text-gray-600 mb-2">Reorder Threshold</p>
                                    <p className="text-4xl font-bold text-purple-900">{analysis.reorder_need_threshold}</p>
                                    <p className="text-sm text-gray-600 mt-2">units (trigger point)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Inventory Timeline Chart */}
                <Card className="shadow-lg border-0 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-900">Inventory Timeline (Last 30 Days)</h3>
                    </div>
                   <ResponsiveContainer width="100%" height={400}>
  <LineChart data={timeline}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis
      dataKey="snapshot_time"
      tickFormatter={(value) =>
        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }
      tick={{ fontSize: 12 }}
    />

    <YAxis />

    <Tooltip
      contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
      labelFormatter={(value) => new Date(value).toLocaleDateString()}
      formatter={(value, name, props) => {
        if (name === "stock_on_hand") {
          return [`${value}`, `Stock (${props.payload.status})`];
        }
        return [value, name];
      }}
    />

    <Legend />

    {/* Stock on Hand */}
    <Line
      type="monotone"
      dataKey="stock_on_hand"
      stroke="#3b82f6"
      strokeWidth={2}
      name="Stock on Hand"
      dot={({ cx, cy, payload }) => {
        let color = "#3b82f6";
        if (payload.status === "CRITICAL") color = "#ef4444";
        else if (payload.status === "BELOW_THRESHOLD") color = "#f59e0b";

        return <circle cx={cx} cy={cy} r={4} fill={color} />;
      }}
    />

    {/* Reorder Threshold */}
    <Line
      type="monotone"
      dataKey="reorder_threshold"
      stroke="#f59e0b"
      strokeWidth={2}
      strokeDasharray="5 5"
      name="Reorder Threshold"
      dot={false}
    />

    {/* Safety Stock */}
    <Line
      type="monotone"
      dataKey="safety_stock"
      stroke="#ef4444"
      strokeWidth={2}
      strokeDasharray="3 3"
      name="Safety Stock"
      dot={false}
    />

    {/* Stockout marker */}
    {timeline.map(
      (point, idx) =>
        point.stock_on_hand === 0 && (
          <ReferenceDot
            key={idx}
            x={point.snapshot_time}
            y={0}
            r={6}
            fill="#dc2626"
            stroke="none"
            label={{
              value: "Stockout",
              position: "top",
              fill: "#dc2626",
              fontSize: 12
            }}
          />
        )
    )}
  </LineChart>
</ResponsiveContainer>

<div className="mt-4 grid grid-cols-3 gap-4">
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-blue-500 rounded"></div>
    <span className="text-sm text-gray-600">Healthy Stock</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-orange-500 rounded"></div>
    <span className="text-sm text-gray-600">Below Reorder Threshold</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-4 h-4 bg-red-500 rounded"></div>
    <span className="text-sm text-gray-600">Critical / Stockout</span>
  </div>
</div>

                </Card>

                {/* Forecast Accuracy Chart */}
                <Card className="shadow-lg border-0 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold text-gray-900">Demand Forecast Analysis</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={forecast.slice(0, 15)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="forecast_date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
                            <Tooltip
                                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="forecasted"
                                fill="#8b5cf6"
                                name="Forecasted Demand"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="forecast_confidence"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Confidence"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        {['HIGH_CONFIDENCE', 'MEDIUM_CONFIDENCE', 'LOW_CONFIDENCE'].map((level, idx) => {
                            const count = forecast.filter(f => f.confidence_level === level).length;
                            const colors = ['text-green-600', 'text-orange-600', 'text-red-600'];
                            return (
                                <div key={level} className="text-center">
                                    <p className={`text-2xl font-bold ${colors[idx]}`}>{count}</p>
                                    <p className="text-sm text-gray-600">{level.replace('_', ' ')}</p>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* AI Analysis Section */}
                <Card className="shadow-lg border-0 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-indigo-600" />
                            <h3 className="text-xl font-bold text-gray-900">AI-Powered Explanation</h3>
                        </div>
                        <Button
                            type="primary"
                            icon={aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                            onClick={loadAIAnalysis}
                            loading={aiLoading}
                            className="bg-indigo-600"
                        >
                            {aiAnalysis ? 'Regenerate' : 'Generate AI Analysis'}
                        </Button>
                    </div>
                    
                    {aiAnalysis ? (
                        <div className="bg-white p-6 rounded-lg border-l-4 border-indigo-600">
                            <p className="text-gray-900 leading-relaxed italic">
                                "{aiAnalysis.ai_explanation}"
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Click "Generate AI Analysis" to get natural language explanation</p>
                        </div>
                    )}
                </Card>

                {/* Simulation Section */}
                <Card className="shadow-lg border-0 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Play className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Counterfactual Simulation</h3>
                                <p className="text-sm text-gray-600">What-if analysis: minimal fix to prevent stockout</p>
                            </div>
                        </div>
                        <Button
                            type="primary"
                            icon={simulationLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            onClick={runSimulation}
                            loading={simulationLoading}
                            size="large"
                            className="bg-purple-600"
                        >
                            {simulation ? 'Re-run' : 'Run Simulation'}
                        </Button>
                    </div>

                    {simulation && (
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">New Safety Stock</p>
                                    <p className="text-3xl font-bold text-blue-900">{simulation.new_safety_stock}</p>
                                    <p className="text-xs text-gray-600 mt-1">units</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">New Threshold</p>
                                    <p className="text-3xl font-bold text-purple-900">{simulation.new_threshold}</p>
                                    <p className="text-xs text-gray-600 mt-1">units</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Projected Stock</p>
                                    <p className="text-3xl font-bold text-green-900">{simulation.projected_stock_after_fix}</p>
                                    <p className="text-xs text-gray-600 mt-1">after fix</p>
                                </div>
                            </div>

                            <Alert
                                message={simulation.outcome}
                                type={simulation.outcome.includes('STILL FAILS') ? 'error' : 'success'}
                                showIcon
                                icon={simulation.outcome.includes('STILL FAILS') ? <AlertTriangle /> : <CheckCircle />}
                                description={
                                    simulation.outcome.includes('STILL FAILS')
                                        ? `Further adjustments needed beyond safety stock increase to ${simulation.new_safety_stock} units.`
                                        : `This configuration would have prevented the stockout!`
                                }
                            />
                        </div>
                    )}

                    {!simulation && !simulationLoading && (
                        <div className="text-center py-8 text-gray-500">
                            <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Run simulation to see what minimal changes would prevent this stockout</p>
                        </div>
                    )}
                </Card>

                {/* Similar Failures Section */}
                <Card className="shadow-lg border-0 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6 text-orange-600" />
                        <h3 className="text-xl font-bold text-gray-900">Similar Failure Patterns</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Other items with the same root cause - learn from patterns
                    </p>
                    <Table
                        columns={similarColumns}
                        dataSource={similarFailures}
                        rowKey={(record) => `${record.item_id}-${record.stockout_date}`}
                        pagination={false}
                        size="small"
                    />
                </Card>

                {/* Recommendations */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-green-600 mt-1" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Actionable Recommendations</h3>
                            <div className="space-y-2 text-gray-900">
                                <p>• <strong>Immediate:</strong> Increase safety stock to {simulation?.new_safety_stock || 'calculated optimal'} units</p>
                                <p>• <strong>Short-term:</strong> Adjust reorder threshold to {simulation?.new_threshold || 'recommended'} units</p>
                                <p>• <strong>Long-term:</strong> Implement dynamic threshold adjustment based on forecast confidence</p>
                                <p>• <strong>Review:</strong> Check {similarFailures.length} similar failures for systemic issues</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button type="primary" size="large" className="bg-green-600">
                            Apply Recommendations
                        </Button>
                        <Button size="large" onClick={() => loadAllData()}>
                            Refresh Analysis
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
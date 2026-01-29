// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Row, Col, Select, Table, Tag, Input, Button } from 'antd';
// import { Briefcase, MapPin, TrendingUp, XCircle, Eye, Search } from 'lucide-react';

// interface Event {
//   item_id: string;
//   warehouse_id: string;
//   stockout_date: string;
// }

// interface DashboardStats {
//   totalEvents: number;
//   warehouses: Record<string, number>;
//   items: Record<string, number>;
// }

// export default function DashboardPage() {
//   const navigate = useNavigate();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
//   const [stats, setStats] = useState<DashboardStats>({
//     totalEvents: 0,
//     warehouses: {},
//     items: {},
//   });
//   const [loading, setLoading] = useState(true);
//   const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
//   const [itemFilter, setItemFilter] = useState<string>('all');
//   const apiBase = import.meta.env.VITE_API_URL;
//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [events, warehouseFilter, itemFilter]);
//   const loadDashboardData = async () => {
//     setLoading(true);
//     try {
//       const accessToken = localStorage.getItem('access_token');
//       console.log('Access Token:', accessToken);
//       const response = await fetch(`${apiBase}/events/all`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const eventsData: Event[] = await response.json();
//       setEvents(eventsData);

//       const warehouses: Record<string, number> = {};
//       const items: Record<string, number> = {};

//       eventsData.forEach(event => {
//         // Count warehouses
//         warehouses[event.warehouse_id] = (warehouses[event.warehouse_id] || 0) + 1;

//         // Count items
//         items[event.item_id] = (items[event.item_id] || 0) + 1;
//       });

//       setStats({
//         totalEvents: eventsData.length,
//         warehouses,
//         items,
//       });

//     } catch (error) {
//       console.error('Error loading dashboard:', error);
//     }

//     setLoading(false);
//   };

//   const applyFilters = () => {
//     let filtered = [...events];

//     if (warehouseFilter !== 'all') {
//       filtered = filtered.filter(event => event.warehouse_id === warehouseFilter);
//     }

//     if (itemFilter !== 'all') {
//       filtered = filtered.filter(event => event.item_id === itemFilter);
//     }

//     setFilteredEvents(filtered);
//   };





//   const columns = [
//     {
//       title: 'Item ID',
//       dataIndex: 'item_id',
//       key: 'item_id',
//       render: (text: string) => <span className="font-medium text-gray-900">{text}</span>,
//     },
//     {
//       title: 'Warehouse ID',
//       dataIndex: 'warehouse_id',
//       key: 'warehouse_id',
//       render: (text: string) => (
//         <Tag color="blue" className="px-3 py-1">
//           <MapPin className="w-3 h-3 inline mr-1" />
//           {text}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Stockout Date',
//       dataIndex: 'stockout_date',
//       key: 'stockout_date',
//       render: (date: string) => new Date(date).toLocaleDateString(),
//     },
//     {
//       title: 'Actions',
//       key: 'actions',
//       render: (_: any, record: Event) => (
//         <Button
//           type="primary"
//           icon={<Eye className="w-4 h-4" />}
//           onClick={() => navigate(`/events/${record.item_id}`)}
//           className="bg-blue-600"
//         >
//           View Details
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
//           <p className="text-gray-600 text-lg">Stockout Events Analytics & Overview</p>
//         </div>

//         {/* Stats Cards */}
//         <Row gutter={[24, 24]} className="mb-8">
//           <Col xs={24} sm={12} lg={8}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium mb-1">Total Events</p>
//                   <h2 className="text-3xl font-bold text-gray-900">{stats.totalEvents}</h2>
//                 </div>
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <TrendingUp className="w-8 h-8 text-blue-600" />
//                 </div>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={8}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium mb-1">Warehouses</p>
//                   <h2 className="text-3xl font-bold text-gray-900">
//                     {Object.keys(stats.warehouses).length}
//                   </h2>
//                 </div>
//                 <div className="bg-purple-100 p-3 rounded-lg">
//                   <MapPin className="w-8 h-8 text-purple-600" />
//                 </div>
//               </div>
//             </Card>
//           </Col>

//           <Col xs={24} sm={12} lg={8}>
//             <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium mb-1">Unique Items</p>
//                   <h2 className="text-3xl font-bold text-gray-900">
//                     {Object.keys(stats.items).length}
//                   </h2>
//                 </div>
//                 <div className="bg-green-100 p-3 rounded-lg">
//                   <Briefcase className="w-8 h-8 text-green-600" />
//                 </div>
//               </div>
//             </Card>
//           </Col>
//         </Row>

//         {/* Filters */}
//         <Card className="mb-8 shadow-lg border-0">
//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-5 h-5 text-gray-500" />
//               <Select
//                 value={warehouseFilter}
//                 onChange={setWarehouseFilter}
//                 style={{ width: 200 }}
//                 placeholder="Filter by Warehouse"
//               >
//                 <Select.Option value="all">All Warehouses</Select.Option>
//                 {Object.keys(stats.warehouses).map(warehouse => (
//                   <Select.Option key={warehouse} value={warehouse}>
//                     {warehouse} ({stats.warehouses[warehouse]})
//                   </Select.Option>
//                 ))}
//               </Select>
//             </div>

//             <div className="flex items-center gap-2">
//               <Briefcase className="w-5 h-5 text-gray-500" />
//               <Select
//                 value={itemFilter}
//                 onChange={setItemFilter}
//                 style={{ width: 200 }}
//                 placeholder="Filter by Item"
//               >
//                 <Select.Option value="all">All Items</Select.Option>
//                 {Object.keys(stats.items).map(item => (
//                   <Select.Option key={item} value={item}>
//                     {item} ({stats.items[item]})
//                   </Select.Option>
//                 ))}
//               </Select>
//             </div>
//           </div>
//         </Card>

//         {/* Events Table */}
//         <Card className="shadow-lg border-0">
//           <div className="mb-4">
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Stockout Events</h2>
//             <p className="text-gray-600">
//               Showing {filteredEvents.length} of {stats.totalEvents} events
//             </p>
//           </div>
//           <Table
//             columns={columns}
//             dataSource={filteredEvents}
//             rowKey={(record) => `${record.item_id}-${record.warehouse_id}-${record.stockout_date}`}
//             loading={loading}
//             pagination={{
//               pageSize: 10,
//               showSizeChanger: true,
//               showTotal: (total) => `Total ${total} events`,
//             }}
//           />
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Select, Table, Tag, Button, Progress, Spin } from 'antd';
import {
  Briefcase,
  MapPin,
  TrendingUp,
  XCircle,
  Eye,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface Event {
  item_id: string;
  warehouse_id: string;
  stockout_date: string;
  failure_category?: string;
  root_cause?: string;
}

interface DashboardSummary {
  total_stockouts: number;
  execution_failures: number;
  decision_failures: number;
  avg_confidence: number;
  top_root_cause: string;
}

interface RootCause {
  root_cause: string;
  count: number;
  percentage: number;
}

interface TrendData {
  week: string;
  stockout_count: number;
  execution_failures: number;
  decision_failures: number;
}

interface DashboardStats {
  totalEvents: number;
  warehouses: Record<string, number>;
  items: Record<string, number>;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    warehouses: {},
    items: {},
  });

  // New state for enhanced dashboard
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [rootCauses, setRootCauses] = useState<RootCause[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);

  const [loading, setLoading] = useState(true);
  const [warehouseFilter, setWarehouseFilter] = useState<string>('all');
  const [itemFilter, setItemFilter] = useState<string>('all');

  const apiBase = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, warehouseFilter, itemFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');

      // Parallel API calls for better performance
      const [eventsRes, summaryRes, rootCausesRes, trendsRes] = await Promise.all([
        // fetch(`${apiBase}/events/all?limit=1000`, {
        fetch(`${apiBase}/events/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiBase}/events/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiBase}/events/dashboard/root-causes`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
        fetch(`${apiBase}/events/dashboard/trends`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      ]);

      const eventsData: Event[] = await eventsRes.json();
      const summaryData: DashboardSummary = await summaryRes.json();
      const rootCausesData: RootCause[] = await rootCausesRes.json();
      const trendsData: TrendData[] = await trendsRes.json();

      setEvents(eventsData);
      setSummary(summaryData);
      setRootCauses(rootCausesData);
      setTrends(trendsData);

      // Calculate stats
      const warehouses: Record<string, number> = {};
      const items: Record<string, number> = {};

      eventsData.forEach(event => {
        warehouses[event.warehouse_id] = (warehouses[event.warehouse_id] || 0) + 1;
        items[event.item_id] = (items[event.item_id] || 0) + 1;
      });

      setStats({
        totalEvents: eventsData.length,
        warehouses,
        items,
      });

    } catch (error) {
      console.error('Error loading dashboard:', error);
    }

    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...events];

    if (warehouseFilter !== 'all') {
      filtered = filtered.filter(event => event.warehouse_id === warehouseFilter);
    }

    if (itemFilter !== 'all') {
      filtered = filtered.filter(event => event.item_id === itemFilter);
    }

    setFilteredEvents(filtered);
  };

  // Colors for charts
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

  const columns = [
    {
      title: 'Item ID',
      dataIndex: 'item_id',
      key: 'item_id',
      render: (text: string) => <span className="font-medium text-gray-900">{text}</span>,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse_id',
      key: 'warehouse_id',
      render: (text: string) => (
        <Tag color="blue" className="px-3 py-1">
          <MapPin className="w-3 h-3 inline mr-1" />
          {text}
        </Tag>
      ),
    },
    {
      title: 'Failure Type',
      dataIndex: 'failure_category',
      key: 'failure_category',
      render: (category: string) => (
        <Tag color={category === 'EXECUTION_FAILURE' ? 'orange' : 'red'}>
          {category === 'EXECUTION_FAILURE' ? (
            <><Activity className="w-3 h-3 inline mr-1" />Execution</>
          ) : (
            <><AlertTriangle className="w-3 h-3 inline mr-1" />Decision</>
          )}
        </Tag>
      ),
    },
    {
      title: 'Root Cause',
      dataIndex: 'root_cause',
      key: 'root_cause',
      render: (cause: string) => (
        <span className="text-sm text-gray-600">{cause?.replace(/_/g, ' ')}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'stockout_date',
      key: 'stockout_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Event) => (
        <Button
          type="primary"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => navigate(`/events/${record.item_id}`)}
          className="bg-blue-600"
        >
          Analyze
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ReTrace Dashboard</h1>
          <p className="text-gray-600 text-lg">Real-time Stockout Intelligence & Root Cause Analysis</p>
        </div>

        {/* Top Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Total Stockouts</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {summary?.total_stockouts || 0}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Last 90 days</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Execution Failures</p>
                  <h2 className="text-3xl font-bold text-orange-600">
                    {summary?.execution_failures || 0}
                  </h2>
                  <Progress
                    percent={Math.round(((summary?.execution_failures || 0) / (summary?.total_stockouts || 1)) * 100)}
                    strokeColor="#f59e0b"
                    showInfo={false}
                    className="mt-2"
                  />
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Activity className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Decision Failures</p>
                  <h2 className="text-3xl font-bold text-red-600">
                    {summary?.decision_failures || 0}
                  </h2>
                  <Progress
                    percent={Math.round(((summary?.decision_failures || 0) / (summary?.total_stockouts || 1)) * 100)}
                    strokeColor="#ef4444"
                    showInfo={false}
                    className="mt-2"
                  />
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">AI Confidence</p>
                  <h2 className="text-3xl font-bold text-green-600">
                    {Math.round((summary?.avg_confidence || 0) * 100)}%
                  </h2>
                  <Progress
                    percent={Math.round((summary?.avg_confidence || 0) * 100)}
                    strokeColor="#10b981"
                    showInfo={false}
                    className="mt-2"
                  />
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[24, 24]} className="mb-8">
          {/* Root Cause Distribution - Pie Chart */}
          <Col xs={24} lg={12}>
            <Card className="shadow-lg border-0">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Root Cause Distribution</h3>
              <p className="text-sm text-gray-600 mb-4">
                Top Issue: <Tag color="red">{summary?.top_root_cause?.replace(/_/g, ' ')}</Tag>
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={rootCauses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(
                      props: any // PieLabelRenderProps
                    ) => {
                      const { name, value, index } = props;
                      // Calculate percentage from data
                      const total = rootCauses.reduce((sum, entry) => sum + entry.count, 0);
                      const percent = total > 0 ? Math.round((value / total) * 100) : 0;
                      return `${String(name).replace(/_/g, ' ').substring(0, 15)}... (${percent}%)`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="root_cause"
                  >
                    {rootCauses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>

          {/* Trend Chart - Line/Area Chart */}
          <Col xs={24} lg={12}>
            <Card className="shadow-lg border-0">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Stockout Trends</h3>
              <p className="text-sm text-gray-600 mb-4">Weekly breakdown over last 90 days</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="execution_failures"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    name="Execution Failures"
                  />
                  <Area
                    type="monotone"
                    dataKey="decision_failures"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    name="Decision Failures"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Secondary Stats */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Warehouses Affected</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {Object.keys(stats.warehouses).length}
                  </h2>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Unique Items</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {Object.keys(stats.items).length}
                  </h2>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={8}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Trend Direction</p>
                  <h2 className="text-3xl font-bold text-green-600 flex items-center gap-2">
                    <TrendingDown className="w-8 h-8" />
                    {trends.length > 1 && trends[0].stockout_count < trends[trends.length - 1].stockout_count ? 'Improving' : 'Stable'}
                  </h2>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <Select
                value={warehouseFilter}
                onChange={setWarehouseFilter}
                style={{ width: 200 }}
                placeholder="Filter by Warehouse"
              >
                <Select.Option value="all">All Warehouses</Select.Option>
                {Object.keys(stats.warehouses).map(warehouse => (
                  <Select.Option key={warehouse} value={warehouse}>
                    {warehouse} ({stats.warehouses[warehouse]})
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <Select
                value={itemFilter}
                onChange={setItemFilter}
                style={{ width: 200 }}
                placeholder="Filter by Item"
              >
                <Select.Option value="all">All Items</Select.Option>
                {Object.keys(stats.items).map(item => (
                  <Select.Option key={item} value={item}>
                    {item} ({stats.items[item]})
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Button
              type="default"
              onClick={() => {
                setWarehouseFilter('all');
                setItemFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Events Table */}
        <Card className="shadow-lg border-0">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Stockout Events</h2>
            <p className="text-gray-600">
              Showing {filteredEvents.length} of {stats.totalEvents} events
            </p>
          </div>
          <Table
            columns={columns}
            dataSource={filteredEvents}
            rowKey={(record) => `${record.item_id}-${record.warehouse_id}-${record.stockout_date}`}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} events`,
            }}
          />
        </Card>
      </div>
    </div>
  );
}
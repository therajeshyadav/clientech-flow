import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeadsStats } from '../store/slices/leadSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Navbar from '../components/Navbar';
import { TrendingUp, Target, DollarSign, Users, Loader2 } from 'lucide-react';
import { RootState } from '../types';

const Reports = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state: RootState) => state.leads);

  useEffect(() => {
    dispatch(fetchLeadsStats() as any);
  }, [dispatch]);

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

  const pieData = stats.statusDistribution.map((item, index) => ({
    name: item.status,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  const barData = stats.valueDistribution.map((item) => ({
    status: item.status,
    value: item.totalValue
  }));

  const totalLeads = stats.statusDistribution.reduce((sum, item) => sum + item.count, 0);
  const totalValue = stats.valueDistribution.reduce((sum, item) => sum + item.totalValue, 0);
  const convertedLeads = stats.statusDistribution.find(item => item.status === 'Converted')?.count || 0;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Track your lead performance and conversion metrics
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    All leads in system
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Combined lead value
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Converted</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{convertedLeads}</div>
                  <p className="text-xs text-muted-foreground">
                    Successful conversions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Leads to conversions
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart - Lead Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of leads by current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bar Chart - Lead Values by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Lead Values by Status</CardTitle>
                  <CardDescription>
                    Total monetary value of leads by status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                        <Legend />
                        <Bar dataKey="value" fill="#3b82f6" name="Total Value" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown Table */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Detailed Status Breakdown</CardTitle>
                <CardDescription>
                  Complete overview of lead counts and values by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Count</th>
                        <th className="text-left py-3 px-4 font-medium">Total Value</th>
                        <th className="text-left py-3 px-4 font-medium">Average Value</th>
                        <th className="text-left py-3 px-4 font-medium">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.statusDistribution.map((status, index) => {
                        const statusValue = stats.valueDistribution.find(v => v.status === status.status);
                        const avgValue = status.count > 0 ? (statusValue?.totalValue || 0) / status.count : 0;
                        const percentage = totalLeads > 0 ? ((status.count / totalLeads) * 100).toFixed(1) : '0';
                        
                        return (
                          <tr key={status.status} className="border-b border-border">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="font-medium">{status.status}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{status.count}</td>
                            <td className="py-3 px-4">${(statusValue?.totalValue || 0).toLocaleString()}</td>
                            <td className="py-3 px-4">${avgValue.toLocaleString()}</td>
                            <td className="py-3 px-4">{percentage}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {['Total Users', 'Total Products', 'Revenue', 'Active Sessions'].map((stat) => (
          <div key={stat} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">{stat}</h3>
            <p className="text-2xl font-bold mt-2">1,234</p>
          </div>
        ))}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      </div>
    </div>
  );
};

export default Dashboard;
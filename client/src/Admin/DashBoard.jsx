import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light">
        <div className="p-4">
          <h2 className="mb-4">Dashboard</h2>
          <div className="row">
            <div className="col-md-3 mb-4">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <h2>1,234</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Sales</h5>
                  <h2>$45,678</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Products</h5>
                  <h2>456</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Orders</h5>
                  <h2>89</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recent Activities</h5>
                  <div className="list-group">
                    <a href="#" className="list-group-item list-group-item-action">New user registered</a>
                    <a href="#" className="list-group-item list-group-item-action">New order received</a>
                    <a href="#" className="list-group-item list-group-item-action">Product updated</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

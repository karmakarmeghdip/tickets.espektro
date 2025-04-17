"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link"; // Removed unused import
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { QrScanner } from "@/app/components/admin/QrScanner";
import {
  BarChart,
  Users,
  Ticket,
  Banknote,
  Calendar,
  // ListChecks, // Removed unused import
  QrCode,
  Settings,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { events, Event } from "@/lib/data/events"; // Import events and Event type

// Mock data for the dashboard
const dashboardData = {
  totalTickets: 542,
  totalRevenue: 920900,
  studentsAttending: 378,
  alumniAttending: 97,
  visitorsAttending: 67,
  checkIns: 215,
  ticketsSold: {
    dates: ["Apr 10", "Apr 11", "Apr 12", "Apr 13", "Apr 14", "Apr 15", "Apr 16", "Apr 17", "Apr 18"],
    values: [12, 24, 36, 48, 74, 102, 105, 78, 63],
  },
  recentTransactions: [
    { id: "TXN1234567", name: "Arjun Sharma", date: "2025-04-18T09:45:22", amount: 1700, status: "success" },
    { id: "TXN1234566", name: "Priya Patel", date: "2025-04-18T09:23:15", amount: 1700, status: "success" },
    { id: "TXN1234565", name: "Rahul Singh", date: "2025-04-18T08:56:43", amount: 1700, status: "success" },
    { id: "TXN1234564", name: "Neha Gupta", date: "2025-04-18T08:14:05", amount: 1700, status: "success" },
    { id: "TXN1234563", name: "Dev Kumar", date: "2025-04-17T22:34:19", amount: 1700, status: "success" },
  ],
  recentCheckins: [
    { ticketId: "ESP2025-237849", name: "Siddharth Roy", time: "2025-04-18T09:52:11", type: "Student" },
    { ticketId: "ESP2025-237848", name: "Meera Joshi", time: "2025-04-18T09:48:32", type: "Student" },
    { ticketId: "ESP2025-237847", name: "Vikram Malhotra", time: "2025-04-18T09:45:19", type: "Alumni" },
    { ticketId: "ESP2025-237846", name: "Ananya Desai", time: "2025-04-18T09:37:56", type: "Student" },
    { ticketId: "ESP2025-237845", name: "Karan Mehra", time: "2025-04-18T09:23:14", type: "Visitor" },
  ],
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<boolean | null>(null);
  
  // Check if user is logged in as admin on component mount
  useEffect(() => {
    setIsClient(true);
    
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      router.push("/admin/login");
      return;
    }
    
    try {
      const session = JSON.parse(adminSession);
      if (!session.isAdmin || Date.now() > session.expiresAt) {
        localStorage.removeItem("adminSession");
        router.push("/admin/login");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      localStorage.removeItem("adminSession");
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    router.push("/admin/login");
  };

  const handleScan = (data: string | null) => {
    if (data) {
      setScanResult(data);
      // Simulate checking the QR code against a database
      // In a real app, this would make an API call to validate the ticket
      setTimeout(() => {
        // For demo purposes, consider valid if contains "ESP2025"
        const isValid = data.includes("ESP2025");
        setScanSuccess(isValid);
        
        // Stop scanning after a successful scan
        if (isValid) {
          setIsScanning(false);
        }
      }, 1000);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setScanSuccess(null);
    setIsScanning(true);
  };

  if (!isClient) {
    // Return a loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 pt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Left sidebar - Navigation */}
          <div className="md:w-64 mb-8 md:mb-0 md:mr-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "overview"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <BarChart className="h-5 w-5 mr-3" />
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab("check-in")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "check-in"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <QrCode className="h-5 w-5 mr-3" />
                  Check-In
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "attendees"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Attendees
                </button>

                <button
                  onClick={() => setActiveTab("events")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "events"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Events
                </button>

                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "tickets"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  Tickets
                </button>

                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "transactions"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Banknote className="h-5 w-5 mr-3" />
                  Transactions
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === "settings"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>

                <div className="pt-6 border-t dark:border-gray-800 mt-6">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            <div className="space-y-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
                  
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Total Tickets Sold
                        </div>
                        <div className="text-3xl font-bold">{dashboardData.totalTickets}</div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Total Revenue
                        </div>
                        <div className="text-3xl font-bold">₹{dashboardData.totalRevenue.toLocaleString('en-IN')}</div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Check-ins Today
                        </div>
                        <div className="text-3xl font-bold">{dashboardData.checkIns}</div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Attendee Breakdown
                        </div>
                        <div className="pb-2">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span>Students</span>
                            <span className="font-medium">{dashboardData.studentsAttending}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                            <div 
                              className="h-1 bg-blue-500 rounded-full" 
                              style={{ width: `${(dashboardData.studentsAttending / dashboardData.totalTickets) * 100}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span>Alumni</span>
                            <span className="font-medium">{dashboardData.alumniAttending}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-2">
                            <div 
                              className="h-1 bg-purple-500 rounded-full" 
                              style={{ width: `${(dashboardData.alumniAttending / dashboardData.totalTickets) * 100}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span>Visitors</span>
                            <span className="font-medium">{dashboardData.visitorsAttending}</span>
                          </div>
                          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <div 
                              className="h-1 bg-green-500 rounded-full" 
                              style={{ width: `${(dashboardData.visitorsAttending / dashboardData.totalTickets) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent check-ins */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                      <div className="text-lg font-bold">Recent Check-ins</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Latest attendees checked in to the event
                      </div>
                      <div className="space-y-4">
                        {dashboardData.recentCheckins.map((checkin, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{checkin.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {checkin.ticketId} • {checkin.type}
                              </p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(checkin.time).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent transactions */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                      <div className="text-lg font-bold">Recent Transactions</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Latest ticket purchases
                      </div>
                      <div className="space-y-4">
                        {dashboardData.recentTransactions.map((transaction, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{transaction.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {transaction.id}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{transaction.amount}</p>
                              <p className={`text-sm ${
                                transaction.status === "success" 
                                  ? "text-green-600 dark:text-green-400" 
                                  : "text-red-600 dark:text-red-400"
                              }`}>
                                {transaction.status === "success" ? "Successful" : "Failed"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Check-in Tab */}
              {activeTab === "check-in" && (
                <div>
                  <h1 className="text-3xl font-bold mb-8">Ticket Check-In</h1>
                  
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 mb-8">
                    <div className="max-w-md mx-auto">
                      {!isScanning && !scanResult ? (
                        <div className="text-center py-10">
                          <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <QrCode className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <h2 className="text-2xl font-bold mb-4">Ticket Scanner</h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Scan attendee QR codes to verify tickets and check them in to the event
                          </p>
                          <Button
                            onClick={() => setIsScanning(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                          >
                            Start Scanning
                          </Button>
                        </div>
                      ) : scanResult && scanSuccess !== null ? (
                        <div className="text-center py-6">
                          {scanSuccess ? (
                            <div>
                              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <h2 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">
                                Valid Ticket
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Ticket ID: {scanResult}
                              </p>
                              <Button
                                onClick={resetScan}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              >
                                Scan Another
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                              <h2 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">
                                Invalid Ticket
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400 mb-6">
                                The scanned code is not a valid ticket: {scanResult}
                              </p>
                              <Button
                                onClick={resetScan}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              >
                                Try Again
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h2 className="text-xl font-bold mb-4 text-center">Scanning...</h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                            Position the QR code within the scanner
                          </p>
                          <div className="mb-6 relative border-4 border-blue-500 rounded-lg overflow-hidden">
                            <QrScanner
                              onScan={handleScan}
                              onError={(err) => console.error(err)}
                              constraints={{
                                video: { facingMode: "environment" }
                              }}
                              className="w-full"
                              style={{ height: "300px" }}
                            />
                            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border-2 border-white/70 rounded-lg"></div>
                            </div>
                          </div>
                          <div className="text-center">
                            <Button
                              onClick={() => setIsScanning(false)}
                              variant="outline"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Check-ins</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b dark:border-gray-800">
                            <th className="py-3 text-left">Ticket ID</th>
                            <th className="py-3 text-left">Name</th>
                            <th className="py-3 text-left">Type</th>
                            <th className="py-3 text-left">Check-in Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recentCheckins.map((checkin, index) => (
                            <tr key={index} className="border-b dark:border-gray-800">
                              <td className="py-3">{checkin.ticketId}</td>
                              <td className="py-3">{checkin.name}</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  checkin.type === "Student"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                    : checkin.type === "Alumni"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                }`}>
                                  {checkin.type}
                                </span>
                              </td>
                              <td className="py-3">
                                {new Date(checkin.time).toLocaleString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Event Management</h1>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Add New Event
                    </Button>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-slate-800 text-left">
                            <th className="px-6 py-4 whitespace-nowrap">Event Name</th>
                            <th className="px-6 py-4 whitespace-nowrap">Date & Time</th>
                            <th className="px-6 py-4 whitespace-nowrap">Location</th>
                            <th className="px-6 py-4 whitespace-nowrap">Status</th>
                            <th className="px-6 py-4 whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-800">
                          {events.map((event: Event) => { // Add type annotation for event
                            const startDate = new Date(event.startDate);
                            const endDate = new Date(event.endDate);
                            const isOngoing = startDate <= new Date() && endDate >= new Date();
                            const isPast = endDate < new Date();
                            
                            let status = "Upcoming";
                            let statusClass = "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
                            
                            if (isOngoing) {
                              status = "Ongoing";
                              statusClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
                            } else if (isPast) {
                              status = "Completed";
                              statusClass = "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
                            }
                            
                            return (
                              <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{event.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {startDate.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}, {startDate.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>
                                    {status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">Edit</Button>
                                    <Button size="sm" variant="outline" className="text-blue-600 dark:text-blue-400">
                                      View
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Other tabs - simplified placeholders */}
              {(activeTab === "attendees" || 
                activeTab === "tickets" || 
                activeTab === "transactions" || 
                activeTab === "settings") && (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-10 text-center">
                  <h1 className="text-3xl font-bold mb-4">
                    {activeTab === "attendees" && "Attendee Management"}
                    {activeTab === "tickets" && "Ticket Management"}
                    {activeTab === "transactions" && "Transaction History"}
                    {activeTab === "settings" && "Admin Settings"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    This section is still under development. Check back later for updates!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Return to Overview
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
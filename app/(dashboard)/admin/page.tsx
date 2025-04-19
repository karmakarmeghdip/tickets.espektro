"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Link from "next/link"; // Removed unused import
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronUp,
  ChevronDown
} from "lucide-react";

import Events from "@/app/components/admin/Events";
import RoleManagement from "@/app/components/admin/RoleManagement";
import Dashboard from "@/app/components/admin/Dashboard";
import React from "react";

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
  departmentData: {
    labels: ["CSE", "IT", "ECE", "ME", "EE"],
    values: [150, 120, 100, 90, 82],
  },
  yearData: {
    labels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    values: [130, 140, 150, 122],
  },
  // Add this new data structure for nested department-year breakdown
  departmentYearData: {
    "1st Year": {
      "CSE": 45,
      "IT": 16,
      "ECE": 32,
      "ME": 25,
      "EE": 12
    },
    "2nd Year": {
      "CSE": 38,
      "IT": 23,
      "ECE": 35,
      "ME": 28,
      "EE": 16
    },
    "3rd Year": {
      "CSE": 42,
      "IT": 26,
      "ECE": 34,
      "ME": 27,
      "EE": 21
    },
    "4th Year": {
      "CSE": 25,
      "IT": 25,
      "ECE": 19,
      "ME": 20,
      "EE": 33
    }
  }
};

export default function AdminDashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<boolean | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { id: "overview", icon: <BarChart className="h-5 w-5" />, label: "Overview" },
    { id: "check-in", icon: <QrCode className="h-5 w-5" />, label: "Check-In" },
    { id: "attendees", icon: <Users className="h-5 w-5" />, label: "Attendees" },
    { id: "events", icon: <Calendar className="h-5 w-5" />, label: "Events" },
    { id: "tickets", icon: <Ticket className="h-5 w-5" />, label: "Tickets" },
    { id: "transactions", icon: <Banknote className="h-5 w-5" />, label: "Transactions" },
    { id: "role-management", icon: <Settings className="h-5 w-5" />, label: "Role Management" },
  ];

  // Check if user is logged in as admin on component mount
  useEffect(() => {
    setIsClient(true);

    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      // router.push("/admin/login");
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

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
          {/* <div className="md:w-64 mb-8 md:mb-0 md:mr-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "overview"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <BarChart className="h-5 w-5 mr-3" />
                  Overview
                </button>

                <button
                  onClick={() => setActiveTab("check-in")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "check-in"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <QrCode className="h-5 w-5 mr-3" />
                  Check-In
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "attendees"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <Users className="h-5 w-5 mr-3" />
                  Attendees
                </button>

                <button
                  onClick={() => setActiveTab("events")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "events"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Events
                </button>

                <button
                  onClick={() => setActiveTab("tickets")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "tickets"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <Ticket className="h-5 w-5 mr-3" />
                  Tickets
                </button>

                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "transactions"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <Banknote className="h-5 w-5 mr-3" />
                  Transactions
                </button>

                <button
                  onClick={() => setActiveTab("role-management")}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "role-management"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Role Management
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
          </div> */}

          {/* ////////////////////////////////////////////////////////////////////////////// */}

          {/* Desktop Sidebar */}
          <div className="hidden md:block md:w-64 mb-8 md:mb-0 md:mr-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                  >
                    {React.cloneElement(item.icon, { className: "h-5 w-5 mr-3" })}
                    {item.label}
                  </button>
                ))}

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

          {/* Mobile Fixed Bottom Bar - Only "Menu" button is visible when closed */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
            {/* Menu button - always visible */}
            <button
              onClick={toggleDrawer}
              className="w-full bg-white dark:bg-slate-900 shadow-lg border-t border-gray-200 dark:border-gray-800 py-3 px-4 flex items-center justify-center"
            >
              <span className="mr-2 font-medium">Menu</span>
              {isDrawerOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>

            {/* Drawer menu that slides up */}
            <AnimatePresence>
              {isDrawerOpen && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="absolute bottom-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 shadow-lg rounded-t-lg overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-3 gap-3">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsDrawerOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${activeTab === item.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
                          }`}
                      >
                        {item.icon}
                        <span className="text-xs mt-2 text-center">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Overlay to close the drawer when clicking outside */}
          {isDrawerOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
              onClick={() => setIsDrawerOpen(false)}
            />
          )}

          {/* Main content area */}
          <div className="flex-1">
            <div className="space-y-8">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <Dashboard />
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
                                <span className={`px-2 py-1 rounded-full text-xs ${checkin.type === "Student"
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
                <Events />
              )}

              {/* Other tabs - simplified placeholders */}
              {(activeTab === "attendees" ||
                activeTab === "tickets" ||
                activeTab === "transactions") && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-10 text-center">
                    <h1 className="text-3xl font-bold mb-4">
                      {activeTab === "attendees" && "Attendee Management"}
                      {activeTab === "tickets" && "Ticket Management"}
                      {activeTab === "transactions" && "Transaction History"}
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
              {/* role-management Tab */}
              {activeTab === "role-management" && (
                <RoleManagement />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
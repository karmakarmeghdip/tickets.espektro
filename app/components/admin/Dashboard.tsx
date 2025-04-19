"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";

// Mock data for the dashboard - moved from page.tsx to Dashboard component
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

const Dashboard = () => {
    const [chartView, setChartView] = useState("detailed");

    return (
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
                                    <p className={`text-sm ${transaction.status === "success"
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

            {/* Customizable Department and Year Charts */}
            <div className="mt-8">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-bold">Attendee Distribution</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Breakdown of attendees by department and year
                            </p>
                        </div>
                        <Select
                            defaultValue="detailed"
                            onValueChange={(value: string) => setChartView(value)}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select view" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="department">By Department</SelectItem>
                                <SelectItem value="year">By Year</SelectItem>
                                <SelectItem value="detailed">Detailed Breakdown</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Department View */}
                    {chartView === "department" && (
                        <div className="space-y-3">
                            {/* Existing department view code */}
                            {dashboardData.departmentData.labels.map((dept, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span>{dept}</span>
                                        <span className="font-medium">{dashboardData.departmentData.values[index]}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                                            style={{
                                                width: `${(dashboardData.departmentData.values[index] / Math.max(...dashboardData.departmentData.values)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Year View */}
                    {chartView === "year" && (
                        <div className="space-y-3">
                            {/* Existing year view code */}
                            {dashboardData.yearData.labels.map((year, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span>{year}</span>
                                        <span className="font-medium">{dashboardData.yearData.values[index]}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <div
                                            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                                            style={{
                                                width: `${(dashboardData.yearData.values[index] / Math.max(...dashboardData.yearData.values)) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Detailed Breakdown - Departments within each Year */}
                    {chartView === "detailed" && (
                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(dashboardData.departmentYearData).map((year) => {
                                // Get all department values for this year
                                const deptValues = Object.values(dashboardData.departmentYearData[year as keyof typeof dashboardData.departmentYearData]) as number[];
                                const maxValue = Math.max(...deptValues);
                                const totalForYear = deptValues.reduce((sum, val) => sum + val, 0);

                                return (
                                    <div key={year} className="pb-6 border-b dark:border-gray-800 last:border-b-0 last:pb-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-md font-medium">{year}</h3>
                                            <span className="font-medium text-sm">{totalForYear} students</span>
                                        </div>

                                        <div className="space-y-2">
                                            {Object.entries(dashboardData.departmentYearData[year as keyof typeof dashboardData.departmentYearData]).map(([dept, count]) => (
                                                <div key={`${year}-${dept}`} className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-2">
                                                    <div className="flex justify-between items-center text-xs mb-1">
                                                        <span className="font-medium">{dept}</span>
                                                        <span>{count}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                        <div
                                                            className={`h-1.5 rounded-full ${dept === "CSE" ? "bg-blue-500" :
                                                                dept === "ECE" ? "bg-purple-500" :
                                                                    dept === "ME" ? "bg-green-500" :
                                                                        dept === "IT" ? "bg-amber-500" :
                                                                            "bg-red-500"
                                                                }`}
                                                            style={{
                                                                width: `${(count as number / maxValue) * 100}%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
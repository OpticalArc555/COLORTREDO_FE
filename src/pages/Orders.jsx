import React, { useEffect, useState } from "react";
import BottomNavBar from "../Components/Navbar/BottomNavBar";
import { BASE_URL } from "../../constant";
import axios from "axios";

const Orders = () => {
    const [allResults, setAllResults] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiveOrders, setIsLiveOrders] = useState(true);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("referenceId");
        setLoggedInUserId(userId);
    }, []);

    useEffect(() => {
        if (loggedInUserId) {
            if (isLiveOrders) {
                fetchLiveOrders();
            } else {
                fetchPastOrders()
            }
        }
    }, [isLiveOrders, loggedInUserId]);

    const fetchLiveOrders = async () => {
        try {
            setLoading(true);
            const liveOrdersUrl = `${BASE_URL}userGame/getOrderByUserRefIdRunning?referanceId=${loggedInUserId}`;
            const response = await axios.get(liveOrdersUrl);
            setAllResults(response.data.object);
            setError(null);
        } catch (error) {
            console.error("Error fetching live orders:", error);
            setAllResults([]);
            setError("Pending Order Not Found");
        } finally {
            setLoading(false);
        }
    };

    const fetchPastOrders = async () => {
        try {
            setLoading(true);
            const pastOrdersUrl = `${BASE_URL}userGame/getOrderByUserRefIdDone?referanceId=${loggedInUserId}`;
             console.log(pastOrdersUrl, 'DEBUG@313 :::::::::::;; pastOrdersUrl')
            const response = await axios.get(pastOrdersUrl);
            setAllResults(response.data.object);
            setError(null);
        } catch (error) {
            console.error("Error fetching past orders:", error);
            setAllResults([]);
            setError("Failed to fetch past orders.");
        } finally {
            setLoading(false);
        }
    };




    const getTrueNumberWord = (item) => {
        const numberWords = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const trueNumber = numberWords.find(word => item[word] === true);
        const numberMap = {
            "zero":0 , 
            "one": 1,
            "two": 2,
            "three": 3,
            "four": 4,
            "five": 5,
            "six": 6,
            "seven": 7,
            "eight": 8,
            "nine": 9
        };
        const findNumberFromWord = (word) => {
            const foundNumber = Object.entries(numberMap)
                .find(([key]) => key === word);

            return foundNumber ? foundNumber[1] : "N";
        };
        return findNumberFromWord(trueNumber);
    };
    const getWinStatus = (item) => {
        //  console.log(item , "DEBUG@313")
        const getTrueNumberWords = getTrueNumberWord(item)
        const colorWords = ["red", "yellow", "black"];
        const trueColor = colorWords.find(word => item[word] === true);
        let colorCode
        if (trueColor === "yellow") {
            colorCode = 102
        }
        if (trueColor === "red") {
            colorCode = 101
        }
        if (trueColor === "black") {
            colorCode = 103
        }
        const bettedEle = [colorCode, getTrueNumberWords]
        let latestStatus;
        if (isLiveOrders) {
            latestStatus = "Pending"
        } else {
            latestStatus = bettedEle.includes(item['wonNumber']) ? "Win" : "Loss";
        }
        return latestStatus

    }

    const getColorBadgeClass = (order) => {
        if (order.red) return "bg-red-600";
        if (order.yellow) return "bg-yellow-700";
        if (order.black) return "bg-black text-white";
        return "bg-gray-300";
    };

    return (
        <div className="p-2 sm:p-4 bg-white min-h-screen font-serif">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-indigo-800 mb-4 sm:mb-6 text-center">
                    {isLiveOrders ? "Pending Orders" : "Complete Orders"}
                </h1>

                <div className="flex justify-center mb-3 sm:mb-4">
                    <button
                        className={`px-2 py-1 sm:px-4 sm:py-2 font-medium rounded-l ${isLiveOrders ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setIsLiveOrders(true)}
                    >
                        Pending Orders
                    </button>
                    <button
                        className={`px-2 py-1 sm:px-4 sm:py-2 font-medium rounded-r ${!isLiveOrders ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
                            }`}
                        onClick={() => setIsLiveOrders(false)}
                    >
                        Complete Orders
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-24">
                        <p className="text-indigo-500 text-lg font-medium">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-24">
                        <p className="text-red-500 text-lg font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-xs sm:text-sm">
                            <thead className="bg-gray-100 text-indigo-700">
                                <tr>
                                    <th className="px-2 sm:px-3 py-2 text-center font-semibold border-b border-gray-200">Period</th>
                                    <th className="px-2 sm:px-3 py-2 text-center font-semibold border-b border-gray-200">Amount</th>
                                    <th className="px-2 sm:px-3 py-2 text-center font-semibold border-b border-gray-200">Status</th>
                                    <th className="px-2 sm:px-3 py-2 text-center font-semibold border-b border-gray-200">Numbers</th>
                                    <th className="px-2 sm:px-3 py-2 text-center font-semibold border-b border-gray-200">Color</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allResults.slice(0).reverse().map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-indigo-50 transition-colors`}
                                    >
                                        <td className="px-2 sm:px-3 py-2 border-b border-gray-200 text-center text-gray-800">
                                            {order.period}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 border-b border-gray-200 text-center text-gray-800">
                                            {order.amount}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 border-b border-gray-200 text-center text-gray-800 font-semibold">
                                            {getWinStatus(order)}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 border-b border-gray-200 text-center text-gray-800">
                                            {getTrueNumberWord(order)}
                                        </td>
                                        <td className="px-2 sm:px-3 py-2 border-b border-gray-200 text-center">
                                            <span
                                                className={`inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getColorBadgeClass(order)}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <BottomNavBar />
            </div>
        </div>
    );
};

export default Orders;

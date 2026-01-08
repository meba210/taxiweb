import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiRefreshCw,
  FiArrowLeft,
  FiUser,
  FiPhone,
  //FiCar,
  FiCheckCircle,
} from 'react-icons/fi';
import { FaFingerprint, FaIdCardAlt, FaCarSide } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

type taxi = {
  id: number;
  DriversName: string;
  LicenceNo: string;
  PlateNo: string;
  PhoneNo: string;
};

const TaxiDetailPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taxi, setTaxi] = useState<taxi | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchTaxiDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/taxis/taxisDetail`
      );

      setTaxi(response.data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load taxi details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchTaxiDetails();
  }, [id]);

  const handleRefresh = () => {
    fetchTaxiDetails();
  };

  const handleBack = () => {
    navigate('/available-taxi');
  };

  if (error || !taxi) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-red-500">!</span>
        </div>
        <p className="text-center text-red-500 text-lg mb-6">
          {error || 'No driver data available'}
        </p>
        <button
          onClick={fetchTaxiDetails}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const tableData = [
    {
      label: 'Driver ID',
      value: taxi.id,
      icon: <FaFingerprint className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Driver Name',
      value: taxi.DriversName,
      icon: <FiUser className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Phone Number',
      value: taxi.PhoneNo,
      icon: <FiPhone className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'License Number',
      value: taxi.LicenceNo,
      icon: <FaIdCardAlt className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Plate Number',
      value: taxi.PlateNo,
      icon: <FaCarSide className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Driver Details
              </h1>
              <p className="text-gray-600 mt-1">
                Complete driver information and records
              </p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title="Refresh"
          >
            <FiRefreshCw className="w-5 h-5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center">
              <FiUser className="w-12 h-12 md:w-16 md:h-16 text-blue-500" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {taxi.DriversName}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mb-4">
                <FaFingerprint className="w-4 h-4" />
                <span>Driver ID: {taxi.id}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                  <FiCheckCircle className="w-4 h-4" />
                  Active Status
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Available for trips
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Driver Information
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              All driver details in a structured format
            </p>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 w-20">
                    Icon
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 min-w-[180px]">
                    Field
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bgColor}`}
                      >
                        <div className={item.color}>{item.icon}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {item.label}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Unique identifier
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">
                        {item.value}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center"></div>
              <div>
                <h4 className="font-semibold text-gray-800">Vehicle Info</h4>
                <p className="text-sm text-gray-600">Taxi specifications</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Vehicle Type</span>
                <span className="font-medium">Sedan Taxi</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Color</span>
                <span className="font-medium">White</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Year</span>
                <span className="font-medium">2022</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <MdEmail className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Contact</h4>
                <p className="text-sm text-gray-600">Communication details</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{taxi.PhoneNo}</span>
              </div>
              <div className="flex items-center gap-3 py-2">
                <MdEmail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">driver{taxi.id}@taxi.com</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Current Status</h4>
                <p className="text-sm text-gray-600">Driver availability</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Availability</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">Last updated: Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Driver information is updated in real-time. Last refreshed: Just now
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaxiDetailPage;

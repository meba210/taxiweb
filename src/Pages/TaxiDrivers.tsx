import {
  Input,
  Table,
  Tag,
  Card,
  Space,
  Tooltip,
  Badge,
  Switch,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CiSearch } from 'react-icons/ci';
import { TbSteeringWheel, TbPhoneCall } from 'react-icons/tb';
import type { ColumnsType } from 'antd/es/table';

type Taxi = {
  id: number;
  DriversName: string;
  LicenceNo: string;
  PlateNo: string;
  PhoneNo: string;
  status: 'verified' | 'unverified';
};

export default function TaxiDrivers() {
  const [taxis, setTaxis] = useState<Taxi[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTaxis = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/taxis/allTaxis');
      const formatted: Taxi[] = res.data.map((t: any) => ({
        ...t,
        status: t.status || 'unverified',
      }));
      setTaxis(formatted);
    } catch (error) {
      console.error('Failed to load taxis', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxis();
  }, []);

  const handleStatusChange = async (
    id: number,
    newStatus: 'verified' | 'unverified'
  ) => {
    try {
      await axios.put(`http://localhost:5000/taxis/${id}/status`, {
        status: newStatus,
      });

      setTaxis((prev) =>
        prev.map((T) => (T.id === id ? { ...T, status: newStatus } : T))
      );

      message.success(
        `Station ${newStatus === 'verified' ? 'verify' : 'revoke'} successfully`
      );
    } catch (err) {
      console.error(err);
      message.error('Failed to update station status');
    }
  };

  const handlePhoneClick = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');

    if (cleanNumber.length >= 10) {
      window.location.href = `tel:${cleanNumber}`;
    } else {
      message.warning('Invalid phone number format');
    }
  };

  const filteredTaxis = taxis.filter((t) =>
    `${t.DriversName} ${t.LicenceNo} ${t.PlateNo} ${t.PhoneNo} ${t.status}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const getResponsiveColumns = (): ColumnsType<Taxi> => {
    const isMobile = window.innerWidth < 768;

    const baseColumns: ColumnsType<Taxi> = [
      {
        title: 'DRIVER NAME',
        dataIndex: 'DriversName',
        key: 'DriversName',
        render: (text) => (
          <div className="flex items-center gap-2 font-medium">
            <TbSteeringWheel className="text-lg" />
            <span className="truncate max-w-[150px]">{text}</span>
          </div>
        ),
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      {
        title: 'LICENCE NO',
        dataIndex: 'LicenceNo',
        key: 'LicenceNo',
        render: (text) => (
          <span className="font-mono truncate max-w-[120px]">{text}</span>
        ),
        responsive: ['md', 'lg', 'xl'],
      },
      {
        title: 'PLATE NO',
        dataIndex: 'PlateNo',
        key: 'PlateNo',
        render: (text) => (
          <span className="font-mono bg-gray-50 px-2 py-1 rounded truncate max-w-[100px]">
            {text}
          </span>
        ),
        responsive: ['md', 'lg', 'xl'],
      },
      {
        title: 'PHONE',
        dataIndex: 'PhoneNo',
        key: 'PhoneNo',
        render: (text: string) => (
          <Tooltip title="Click to call">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePhoneClick(text);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <TbPhoneCall className="text-lg" />
              <span className="truncate max-w-[120px]">{text}</span>
            </button>
          </Tooltip>
        ),
        responsive: ['sm', 'md', 'lg', 'xl'],
      },
      {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        render: (status: Taxi['status']) => (
          <Tag
            color={status === 'verified' ? 'green' : 'gray'}
            className="whitespace-nowrap"
          >
            {status.toUpperCase()}
          </Tag>
        ),
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
      {
        title: 'ACTIONS',
        key: 'actions',
        render: (_: any, record: Taxi) => (
          <Space
            size="small"
            className="flex justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip
              title={
                record.status === 'verified'
                  ? 'Click to revoke'
                  : 'Click to verify'
              }
            >
              <Switch
                checked={record.status === 'verified'}
                onChange={(checked) => {
                  const newStatus = checked ? 'verified' : 'unverified';
                  handleStatusChange(record.id, newStatus);
                }}
                size="small"
                checkedChildren="V"
                unCheckedChildren="U"
                style={{
                  backgroundColor:
                    record.status === 'verified' ? '#52c41a' : '#d9d9d9',
                }}
              />
            </Tooltip>
          </Space>
        ),
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
      },
    ];

    if (isMobile) {
      return baseColumns
        .filter(
          (col) =>
            col.key === 'DriversName' ||
            col.key === 'status' ||
            col.key === 'actions'
        )
        .map((col) => {
          if (col.key === 'DriversName') {
            return {
              ...col,
              render: (text, record) => (
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <TbSteeringWheel className="text-lg" />
                    <span className="truncate max-w-[120px]">{text}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {record.PlateNo} •
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhoneClick(record.PhoneNo);
                      }}
                      className="ml-1 flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <TbPhoneCall className="text-sm" />
                      {record.PhoneNo}
                    </button>
                  </div>
                </div>
              ),
            };
          }
          return col;
        });
    }

    return baseColumns;
  };

  const verifiedCount = taxis.filter((t) => t.status === 'verified').length;
  const unverifiedCount = taxis.filter((t) => t.status === 'unverified').length;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* SEARCH */}
        <Card
          className="mb-3 sm:mb-4 shadow-sm"
          bodyStyle={{ padding: '12px 16px' }}
        >
          <Input
            placeholder="Search driver, licence, plate, phone or status"
            prefix={<CiSearch />}
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="w-full"
          />
        </Card>

        {/* STATS */}
        <Card
          className="mb-3 sm:mb-4 shadow-sm"
          bodyStyle={{ padding: '12px 16px' }}
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Badge count={taxis.length} showZero color="blue" />
              <span className="text-xs sm:text-sm">Total Taxis</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Badge count={verifiedCount} showZero color="green" />
              <span className="text-xs sm:text-sm">Verified</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Badge count={unverifiedCount} showZero color="gray" />
              <span className="text-xs sm:text-sm">Unverified</span>
            </div>
          </div>
        </Card>

        {/* TABLE */}
        <div className="overflow-hidden">
          <Table
            rowKey="id"
            loading={loading}
            columns={getResponsiveColumns()}
            dataSource={filteredTaxis}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              size: 'default',
              showTotal: (total) => `Total ${total} taxis`,
              className: 'px-2 sm:px-4',
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: true }}
            size="middle"
            className="shadow-sm"
            rowClassName="hover:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
}

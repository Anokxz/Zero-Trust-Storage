import React, { useEffect, useState } from 'react';
import { FileText, Download, Upload } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

const Dashboard: React.FC = () => {
  const [totalFiles, setTotalFiles] = useState(0);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [totalStorageBytes, setTotalStorageBytes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/files/?owner_id=1`);
        const data = await response.json();

        setTotalFiles(data.length);

        // Calculate total storage size
        const totalBytes = data.reduce((sum: number, file: any) => sum + parseInt(file.size), 0);
        setTotalStorageBytes(totalBytes);

        const sorted = data
          .sort((a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime())
          .slice(0, 3);

        setRecentFiles(sorted);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchData();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = {
    totalFiles,
    totalDownloads: 12,
    storageUsed: formatBytes(totalStorageBytes)
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <div className="w-full max-w-sm">
            <StatCard title="Total Files" value={stats.totalFiles} icon={<FileText className="h-6 w-6 text-gray-400" />} />
          </div>
          <div className="w-full max-w-sm">
            <StatCard title="Total Downloads" value={stats.totalDownloads} icon={<Download className="h-6 w-6 text-gray-400" />} />
          </div>
          <div className="w-full max-w-sm">
            <StatCard title="Storage Used" value={stats.storageUsed} icon={<Upload className="h-6 w-6 text-gray-400" />} />
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Files</h2>
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentFiles.map((file: any) => (
                  <tr key={file.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{file.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatBytes(parseInt(file.size))}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(file.created).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }: { title: string; value: any; icon: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd className="text-lg font-semibold text-gray-900 dark:text-white">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;

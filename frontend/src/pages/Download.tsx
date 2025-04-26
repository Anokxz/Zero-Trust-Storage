import React, { useState, useEffect } from 'react';
import { Search, Download, Share2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/files';

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DownloadPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const userid = localStorage.getItem('user_id');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!userid && !authToken) {
      toast.error('User not logged in');
      return;
    }

    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/?owner_id=${userid}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        
        // const filtered = data.filter((file: any) => file.owner === userid);
        const sorted = data.sort(
          (a: any, b: any) => new Date(b.created).getTime() - new Date(a.created).getTime()
        );
        console.log(sorted);

        setFiles(sorted);
      } catch (error) {
        console.error('Error fetching files:', error);   
        toast.error('Failed to load files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userid, authToken]);

  const handleDownload = async (fileId: string, fileName: string) => {
    const userid = localStorage.getItem('user_id');
    try {
      const response = await fetch(`${API_BASE_URL}/download/${fileId}/?owner_id=${userid}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleShare = async (fileId: string, user_id: number) => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        toast.error('User not authenticated');
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/share/?file_id=${fileId}&target_user_id=${user_id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to share file');
      }
  
      toast.success('File shared successfully!');
    } catch (error: any) {
      console.error('Error sharing file:', error);
      toast.error(error.message || 'An unexpected error occurred');
    }
  };

  const handleDelete = async (fileId: string) => {
    const userid = localStorage.getItem('user_id');
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${fileId}/?owner_id=${userid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Delete failed');
      setFiles(files.filter((file) => file.id !== fileId));
      toast.success('File deleted!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Download Files</h1>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading files...</td>
                </tr>
              ) : filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id}>
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
  <div className="flex flex-col">
    <span className="text-base font-semibold">{file.name}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400">Owner: {file.owner}</span>
  </div>
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatFileSize(Number(file.size))}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDateTime(file.created)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => handleDownload(file.id, file.name)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          const input = prompt('Enter the target user ID to share with:');
                          const userId = input ? parseInt(input, 10) : null;

                          if (userId && !isNaN(userId)) {
                            handleShare(file.id, userId);
                          } else {
                            toast.error('Invalid user ID');
                          }
                        }}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(file.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No files found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;

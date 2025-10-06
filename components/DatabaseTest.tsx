import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GradientButton } from './ui/gradient-button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function DatabaseTest() {
  const [testResults, setTestResults] = useState<{
    connection: 'idle' | 'testing' | 'success' | 'error';
    users: 'idle' | 'testing' | 'success' | 'error';
    opportunities: 'idle' | 'testing' | 'success' | 'error';
    applications: 'idle' | 'testing' | 'success' | 'error';
  }>({
    connection: 'idle',
    users: 'idle',
    opportunities: 'idle',
    applications: 'idle'
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const runTest = async (testName: keyof typeof testResults) => {
    setTestResults(prev => ({ ...prev, [testName]: 'testing' }));
    setErrorMessages([]);

    try {
      switch (testName) {
        case 'connection':
          // Test basic connection
          const { data, error } = await supabase.from('users').select('count').limit(1);
          if (error) throw error;
          break;

        case 'users':
          // Test users table
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, email, name, role')
            .limit(5);
          if (usersError) throw usersError;
          console.log('Users test result:', usersData);
          break;

        case 'opportunities':
          // Test opportunities table
          const { data: oppData, error: oppError } = await supabase
            .from('opportunities')
            .select('id, title, status, created_by_id')
            .limit(5);
          if (oppError) throw oppError;
          console.log('Opportunities test result:', oppData);
          break;

        case 'applications':
          // Test applications table
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('id, status, created_at')
            .limit(5);
          if (appError) throw appError;
          console.log('Applications test result:', appData);
          break;
      }

      setTestResults(prev => ({ ...prev, [testName]: 'success' }));
    } catch (error: any) {
      console.error(`${testName} test error:`, error);
      setTestResults(prev => ({ ...prev, [testName]: 'error' }));
      setErrorMessages(prev => [...prev, `${testName}: ${error.message}`]);
    }
  };

  const runAllTests = async () => {
    await runTest('connection');
    await runTest('users');
    await runTest('opportunities');
    await runTest('applications');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'testing': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default: return <div className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'testing': return 'Testing...';
      default: return 'Not Tested';
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Database Connection Test</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Basic Connection</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.connection)}
            <span className="text-sm">{getStatusText(testResults.connection)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Users Table</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.users)}
            <span className="text-sm">{getStatusText(testResults.users)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Opportunities Table</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.opportunities)}
            <span className="text-sm">{getStatusText(testResults.opportunities)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Applications Table</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults.applications)}
            <span className="text-sm">{getStatusText(testResults.applications)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <GradientButton onClick={runAllTests} className="flex-1">
          Run All Tests
        </GradientButton>
        <GradientButton 
          variant="outline" 
          onClick={() => runTest('connection')}
        >
          Test Connection
        </GradientButton>
      </div>

      {errorMessages.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Errors Found:</h3>
          <ul className="space-y-1">
            {errorMessages.map((error, index) => (
              <li key={index} className="text-sm text-red-700">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-sm text-gray-600 mt-4">
        <p>• Run this test after applying the database schema fixes</p>
        <p>• Check the browser console for detailed results</p>
        <p>• All tests should show "Success" for the system to work properly</p>
      </div>
    </div>
  );
}

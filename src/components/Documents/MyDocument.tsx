  // pages/employee-report.tsx
  "use client"
  import { useEffect, useState } from 'react';

  interface Employee {
    id: number;
    name: string;
    position: string;
    department: string;
  }

  const EmployeeReport = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await fetch('http://localhost:8085/api/employees');
          const data = await response.json();
          setEmployees(data);
        } catch (error) {
          console.error('Error fetching employee data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchEmployees();
    }, []);

    if (loading) return <p className="p-4">Loading...</p>;

    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Employee Report</h1>
        <button
          onClick={() => window.print()}
          className="mb-4 py-2 px-4 bg-blue-500 text-white rounded"
        >
          Print Report
        </button>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Department</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b">{employee.id}</td>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.position}</td>
                <td className="py-2 px-4 border-b">{employee.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <style jsx global>{`
          @media print {
            body {
              font-size: 12pt;
            }
            .no-print {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  };

  export default EmployeeReport;

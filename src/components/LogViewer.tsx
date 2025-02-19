interface Props {
    logs: string[];
  }
  
  export default function LogViewer({ logs }: Props) {
    return (
      <div className="bg-gray-800 text-white p-4 rounded">
        <h3 className="text-xl mb-2">Logs</h3>
        <div className="overflow-y-auto h-48">
          {logs.map((log, index) => (
            <div key={index} className="text-sm">
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }
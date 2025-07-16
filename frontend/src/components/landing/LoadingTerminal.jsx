const LoadingTerminal = ({ logs }) => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-gray-800 text-2xl font-mono space-y-1 min-w-[500px] text-left">
      {logs.map((log, idx) => (
        <div key={idx}>{log}</div>
      ))}
    </div>
  </div>
)

export default LoadingTerminal 
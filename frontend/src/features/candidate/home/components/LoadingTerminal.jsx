const LoadingTerminal = ({ logs }) => (
  <div className="flex items-center justify-center min-h-screen px-4 bg-white">
    <div className="text-gray-800 text-lg sm:text-xl md:text-2xl font-mono space-y-1 w-full max-w-[500px] sm:min-w-[500px] text-left">
      {logs.map((log, idx) => (
        <div key={idx} className="break-words">{log}</div>
      ))}
    </div>
  </div>
)

export default LoadingTerminal
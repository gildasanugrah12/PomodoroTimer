import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Coffee, Brain } from 'lucide-react';

type TimerMode = 'focus' | 'break' | 'longBreak';

interface TimerSettings {
  focus: number;
  break: number;
  longBreak: number;
}

function App() {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [settings, setSettings] = useState<TimerSettings>({
    focus: 25,
    break: 5,
    longBreak: 15,
  });

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio notification
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzPLaizsIHGm98OihUhELTKXh8bllHAU2jdXzzn0vBSd6yO/glEILEl+16+ytWBQLSKHe8sFuJAUuhM/z3I4+CRxqvvHroVMSC02m4PO8aB8GM4/T8tGAMQYjd8jv4JVEDBJhtuvwrVkUDEmi3vLEcSYGLoTP8t2RQAocbMDy7qNWEwxPpuH0wWsiBjaP1PLSgjIHI3fI7+CWRQwSYrbs8K5aFAxLo97yxnMoBi+Ez/PflUQMHG7C8vCmWRUNUKjh9MNtJAc4kdXy1IU1ByR5yPDhmEcOE2O48PKwXRYNTqPe88p3KwcwhNDz4JlIDh1wyPPyqV4XDlKq4/TGcSYIOJLX8tiIOQkkesrw5JtJDxVlu/P0s2EYDlGl3/POey4HMobQ8+GbSg8ecsnz9K1gGBBUq+T1yHUpCTqT2PTaizwKJXzM8Oaeb + ...');
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotification();
    
    if (mode === 'focus') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      if (newSessions % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('break');
      }
    } else {
      switchMode('focus');
    }
  };

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    
    switch (newMode) {
      case 'focus':
        setTimeLeft(settings.focus * 60);
        break;
      case 'break':
        setTimeLeft(settings.break * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    switch (mode) {
      case 'focus':
        setTimeLeft(settings.focus * 60);
        break;
      case 'break':
        setTimeLeft(settings.break * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
    }
  };

  const updateSettings = (newSettings: TimerSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    resetTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = mode === 'focus' 
      ? settings.focus * 60 
      : mode === 'break' 
      ? settings.break * 60 
      : settings.longBreak * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return 'from-rose-500 to-orange-500';
      case 'break':
        return 'from-emerald-500 to-teal-500';
      case 'longBreak':
        return 'from-blue-500 to-indigo-500';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'focus':
        return <Brain className="w-8 h-8" />;
      case 'break':
      case 'longBreak':
        return <Coffee className="w-8 h-8" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getModeColor()} transition-all duration-1000 flex items-center justify-center p-4`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pengaturan Timer</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fokus (menit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.focus}
                    onChange={(e) => setSettings({ ...settings, focus: parseInt(e.target.value) || 25 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Istirahat Pendek (menit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.break}
                    onChange={(e) => setSettings({ ...settings, break: parseInt(e.target.value) || 5 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Istirahat Panjang (menit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreak}
                    onChange={(e) => setSettings({ ...settings, longBreak: parseInt(e.target.value) || 15 })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => updateSettings(settings)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                {getModeIcon()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {mode === 'focus' ? 'Waktu Fokus' : mode === 'break' ? 'Istirahat Pendek' : 'Istirahat Panjang'}
                </h1>
                <p className="text-white/70 text-sm">Sesi #{sessionsCompleted + 1}</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-colors"
            >
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => switchMode('focus')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'focus' 
                  ? 'bg-white text-rose-500 shadow-lg' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Fokus
            </button>
            <button
              onClick={() => switchMode('break')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'break' 
                  ? 'bg-white text-emerald-500 shadow-lg' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Istirahat
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                mode === 'longBreak' 
                  ? 'bg-white text-blue-500 shadow-lg' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Istirahat Panjang
            </button>
          </div>

          {/* Timer Display */}
          <div className="relative mb-8">
            {/* Progress Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="white"
                strokeWidth="8"
                fill="none"
                opacity="0.2"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl font-bold text-white mb-2 tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-white/70 text-sm font-medium">
                  {isRunning ? 'Timer Berjalan...' : 'Siap untuk Mulai'}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={toggleTimer}
              className="bg-white hover:shadow-2xl text-gray-800 p-6 rounded-2xl transition-all hover:scale-105 active:scale-95"
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
            <button
              onClick={resetTimer}
              className="bg-white/20 hover:bg-white/30 text-white p-6 rounded-2xl transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-8 h-8" />
            </button>
          </div>

          {/* Session Counter */}
          <div className="mt-8 text-center">
            <div className="flex justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i < sessionsCompleted % 4 ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/70 text-sm mt-3">
              {sessionsCompleted} sesi selesai hari ini
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-2">💡 Tips Produktif</h3>
          <p className="text-white/80 text-sm">
            {mode === 'focus' 
              ? 'Fokus pada satu tugas. Matikan notifikasi dan hindari distraksi.'
              : 'Beristirahatlah dengan baik. Jauhi layar dan regangkan tubuh Anda.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

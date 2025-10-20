import { useState, useEffect } from 'react';

const TerminalWindows = () => {
  const [animatedText, setAnimatedText] = useState('');
  
  const hackingCode = `> Initializing bug scanner...
> Connecting to target system...
> [OK] Connection established
> Running vulnerability checks...
> [FOUND] SQL Injection - /api/users
> [FOUND] XSS Vulnerability - /search
> [FOUND] CSRF Token Missing - /admin
> Extracting data...
> [SUCCESS] 127 vulnerabilities detected
> Generating report...`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= hackingCode.length) {
        setAnimatedText(hackingCode.slice(0, index));
        index++;
      } else {
        setTimeout(() => {
          index = 0;
          setAnimatedText('');
        }, 2000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Static Terminal - Background */}
      <div className="absolute top-14 left-[-3vw] w-[43vw] transform -rotate-3 opacity-90">
        <div className="bg-card/40 backdrop-blur-sm border border-[#00d492]/30 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Header */}
          <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 border-b border-[#00d492]/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-[#00d492]/70"></div>
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-2">terminal_static.sh</span>
          </div>
          {/* Terminal Content */}
          <div className="p-4 font-mono text-sm text-foreground/60 h-75 overflow-hidden">
            <div className="space-y-1">
              <div className="text-foreground/80">$ ls -la /var/log</div>
              <div className="text-foreground/80">drwxr-xr-x 12 root root 4096 Oct 19 13:14 .</div>
              <div className="text-foreground/70">drwxr-xr-x 18 root root 4096 Oct 15 09:22 ..</div>
              <div className="text-foreground/70">-rw-r--r-- 1 root root 2048 Oct 19 13:14 access.log</div>
              <div className="text-foreground/70">-rw-r--r-- 1 root root 8192 Oct 19 13:14 error.log</div>
              <div className="text-foreground/70">-rw-r--r-- 1 root root 1024 Oct 19 13:14 debug.log</div>
              <div className="text-muted-foreground mt-4">$ cat system_status.txt</div>
              <div className="text-foreground/70">System operational</div>
              <div className="text-foreground/70">CPU: 24%</div>
              <div className="text-foreground/70">Memory: 62%</div>
              <div className="text-foreground/70">Network: Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Terminal - Foreground */}
      <div className="relative z-10 ml-auto w-[40vw] left-[3vw] transform rotate-1">
        <div className="bg-card/80 backdrop-blur-md border-2 border-[#00d492]/50 rounded-lg overflow-hidden shadow-2xl" style={{ boxShadow: 'var(--glow-cyan)' }}>
          {/* Terminal Header */}
          <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-[#00d492]/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="text-xs text-[#00d492] font-mono ml-2">bug_scanner_v2.sh</span>
          </div>
          {/* Terminal Content with Animation */}
          <div className="p-4 font-mono text-sm h-75 overflow-hidden">
            <div className="space-y-1">
              {animatedText.split('\n').map((line, i) => (
                <div 
                  key={i} 
                  className={`
                    ${line.includes('[FOUND]') ? 'text-red-500' : ''}
                    ${line.includes('[OK]') || line.includes('[SUCCESS]') ? 'text-green-500' : ''}
                    ${line.includes('>') && !line.includes('[') ? 'text-[#00d492]' : ''}
                    ${!line.includes('[') && !line.includes('>') ? 'text-foreground' : ''}
                  `}
                >
                  {line}
                </div>
              ))}
              <span className="inline-block w-2 h-4 bg-[#00d492] animate-pulse ml-1"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalWindows;

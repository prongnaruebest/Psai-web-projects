import re

with open('build_prompt_hub.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Change website title
content = re.sub(r'<title>.*?</title>', '<title>NEXUS PROMPT HUB — Futuristic AI & Web Engineering</title>', content)
content = re.sub(r'PROMPT HUB <span class="text-cyan-400 font-extrabold">MAX</span>', 'NEXUS <span class="text-cyan-400 font-extrabold">HUB</span>', content)

# Replace the empty div that used to have emoji with an SVG logo
svg_logo = '''
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
  <polyline points="2 17 12 22 22 17"></polyline>
  <polyline points="2 12 12 17 22 12"></polyline>
</svg>
'''
content = re.sub(r'<div class="w-10 h-10 rounded-xl bg-gradient-to-tr[^>]+>\s*</div>', f'<div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">{svg_logo}</div>', content)

head_injection = '''
  <style>
    /* Custom Cursor / Trailing Effects */
    .mouse-trail {
      position: fixed;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(6, 182, 212, 0.8);
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.8), 0 0 20px rgba(168, 85, 247, 0.6);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      animation: fadeOut 0.8s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
    }
    
    .click-ripple {
      position: fixed;
      border-radius: 50%;
      border: 2px solid rgba(6, 182, 212, 0.8);
      box-shadow: 0 0 20px rgba(6, 182, 212, 1), inset 0 0 20px rgba(168, 85, 247, 0.8);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%) scale(0);
      animation: ripple 0.6s ease-out forwards;
    }

    @keyframes fadeOut {
      0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.1); }
    }
    
    @keyframes ripple {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
        border-width: 4px;
      }
      100% {
        transform: translate(-50%, -50%) scale(3);
        opacity: 0;
        border-width: 0px;
      }
    }
    
    /* Global glow effects for links/buttons */
    button, a {
      transition: all 0.3s ease;
    }
    button:hover, a:hover {
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
      text-shadow: 0 0 5px rgba(255,255,255,0.5);
    }
  </style>
'''
content = content.replace('</head>', head_injection + '</head>')

body_injection = '''
  <script>
    // Mouse trailing effect
    document.addEventListener('mousemove', function(e) {
      if (Math.random() > 0.4) return; // limit frequency
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      document.body.appendChild(trail);
      
      setTimeout(() => {
        trail.remove();
      }, 800);
    });

    // Mouse click effect
    document.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      // Randomize color slightly
      const isPurple = Math.random() > 0.5;
      ripple.style.borderColor = isPurple ? 'rgba(168, 85, 247, 0.8)' : 'rgba(6, 182, 212, 0.8)';
      ripple.style.width = '50px';
      ripple.style.height = '50px';
      
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  </script>
'''
content = content.replace('</body>', body_injection + '</body>')

with open('build_prompt_hub.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully')

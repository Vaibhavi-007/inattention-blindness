// Visual Scenes for Inattention / Change Blindness Experiment
// Each scenario contains:
// - id, name, category, difficulty
// - description: What changes
// - targetBox: { x, y, w, h } in 800x500 coordinate space
// - renderA(): returns SVG string of original scene
// - renderB(): returns SVG string of modified scene (single change)

const SCENES = [
  {
    id: 'city-street',
    name: 'Downtown Intersection',
    category: 'Urban Environment',
    difficulty: 'Moderate',
    changeDescription: 'Red fire hydrant on the right sidewalk disappeared',
    targetBox: { x: 670, y: 345, w: 55, h: 75 },
    renderA: function() {
      return `
        <svg viewBox="0 0 800 500" class="scene-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Sky -->
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#70a1ff"/>
              <stop offset="100%" stop-color="#dfe4ea"/>
            </linearGradient>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#57606f"/>
              <stop offset="100%" stop-color="#2f3542"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#skyGrad)"/>
          
          <!-- Distant Skyline -->
          <rect x="30" y="160" width="80" height="180" fill="#a4b0be"/>
          <rect x="130" y="120" width="100" height="220" fill="#747d8c"/>
          <rect x="250" y="180" width="70" height="160" fill="#a4b0be"/>
          <rect x="340" y="90" width="120" height="250" fill="#57606f"/>
          <rect x="480" y="150" width="90" height="190" fill="#747d8c"/>
          <rect x="590" y="110" width="110" height="230" fill="#a4b0be"/>
          <rect x="720" y="170" width="70" height="170" fill="#747d8c"/>
          
          <!-- Windows in buildings -->
          <g fill="#f1f2f6" opacity="0.8">
            <rect x="145" y="140" width="15" height="20" rx="2"/>
            <rect x="170" y="140" width="15" height="20" rx="2"/>
            <rect x="195" y="140" width="15" height="20" rx="2"/>
            <rect x="145" y="180" width="15" height="20" rx="2"/>
            <rect x="170" y="180" width="15" height="20" rx="2"/>
            <rect x="195" y="180" width="15" height="20" rx="2"/>
            
            <rect x="360" y="120" width="20" height="25" rx="2"/>
            <rect x="395" y="120" width="20" height="25" rx="2"/>
            <rect x="430" y="120" width="20" height="25" rx="2"/>
            <rect x="360" y="165" width="20" height="25" rx="2"/>
            <rect x="395" y="165" width="20" height="25" rx="2"/>
            <rect x="430" y="165" width="20" height="25" rx="2"/>
            <rect x="360" y="210" width="20" height="25" rx="2"/>
            <rect x="395" y="210" width="20" height="25" rx="2"/>
            <rect x="430" y="210" width="20" height="25" rx="2"/>
          </g>

          <!-- Clouds & Birds -->
          <ellipse cx="200" cy="60" rx="55" ry="18" fill="#ffffff" opacity="0.9"/>
          <ellipse cx="230" cy="50" rx="40" ry="22" fill="#ffffff" opacity="0.9"/>
          <ellipse cx="600" cy="50" rx="70" ry="20" fill="#ffffff" opacity="0.8"/>
          
          <!-- Road & Sidewalk -->
          <polygon points="0,320 800,320 800,500 0,500" fill="url(#roadGrad)"/>
          <polygon points="0,320 800,320 800,350 0,350" fill="#ced6e0"/>
          <line x1="0" y1="350" x2="800" y2="350" stroke="#747d8c" stroke-width="2"/>

          <!-- Crosswalk Stripes -->
          <g fill="#ffffff" opacity="0.9">
            <polygon points="50,370 120,370 110,490 30,490"/>
            <polygon points="140,370 210,370 200,490 120,490"/>
            <polygon points="230,370 300,370 290,490 210,490"/>
          </g>

          <!-- Road Lane Markings -->
          <line x1="350" y1="410" x2="430" y2="410" stroke="#ffa502" stroke-width="6" stroke-dasharray="25,20"/>
          <line x1="480" y1="410" x2="780" y2="410" stroke="#ffa502" stroke-width="6" stroke-dasharray="35,25"/>

          <!-- Yellow Taxi Cab on Road -->
          <g transform="translate(360, 340)">
            <rect x="20" y="30" width="140" height="40" rx="8" fill="#eccc68"/>
            <path d="M 45 30 L 65 5 L 125 5 L 145 30 Z" fill="#eccc68"/>
            <!-- Windows -->
            <path d="M 52 28 L 68 10 L 92 10 L 92 28 Z" fill="#2f3542"/>
            <path d="M 98 28 L 98 10 L 122 10 L 138 28 Z" fill="#2f3542"/>
            <!-- Taxi Sign -->
            <rect x="85" y="-2" width="25" height="8" rx="2" fill="#ffa502"/>
            <!-- Wheels -->
            <circle cx="50" cy="70" r="14" fill="#2f3542"/>
            <circle cx="50" cy="70" r="6" fill="#ced6e0"/>
            <circle cx="130" cy="70" r="14" fill="#2f3542"/>
            <circle cx="130" cy="70" r="6" fill="#ced6e0"/>
            <!-- Headlights -->
            <rect x="15" y="42" width="8" height="12" rx="3" fill="#ff4757"/>
            <rect x="157" y="42" width="6" height="12" rx="2" fill="#fff200"/>
          </g>

          <!-- Street Lamp Left -->
          <path d="M 50 330 L 50 200 Q 50 180 70 180 L 80 180" stroke="#2f3542" stroke-width="6" fill="none"/>
          <polygon points="75,180 85,180 80,195" fill="#f1f2f6"/>
          <circle cx="80" cy="195" r="7" fill="#fff200" opacity="0.6"/>

          <!-- Traffic Light on Post -->
          <rect x="290" y="220" width="22" height="60" rx="5" fill="#2f3542"/>
          <rect x="298" y="280" width="6" height="60" fill="#57606f"/>
          <circle cx="301" cy="232" r="6" fill="#ff4757"/> <!-- Red Light -->
          <circle cx="301" cy="250" r="6" fill="#57606f"/>
          <circle cx="301" cy="268" r="6" fill="#57606f"/>

          <!-- Sidewalk Trash Can -->
          <rect x="620" y="325" width="24" height="38" rx="4" fill="#57606f"/>
          <line x1="620" y1="335" x2="644" y2="335" stroke="#2f3542" stroke-width="2"/>

          <!-- TARGET ELEMENT: Red Fire Hydrant on Right Sidewalk -->
          <g id="target-hydrant">
            <rect x="682" y="360" width="26" height="42" rx="5" fill="#ff4757"/>
            <ellipse cx="695" cy="360" rx="13" ry="6" fill="#ff6b81"/>
            <rect x="677" y="372" width="6" height="8" rx="2" fill="#ff4757"/>
            <rect x="707" y="372" width="6" height="8" rx="2" fill="#ff4757"/>
            <rect x="680" y="398" width="30" height="6" rx="2" fill="#c0392b"/>
            <circle cx="695" cy="354" r="4" fill="#ced6e0"/>
          </g>
        </svg>
      `;
    },
    renderB: function() {
      // Scene B: The red fire hydrant at the sidewalk disappears completely!
      const original = this.renderA();
      return original.replace(/<g id="target-hydrant">[\s\S]*?<\/g>/, '<!-- hydrant removed -->');
    }
  },
  {
    id: 'office-desk',
    name: 'Executive Workspace',
    category: 'Indoor Workplace',
    difficulty: 'Moderate',
    changeDescription: 'Steaming ceramic coffee mug on the desk disappeared',
    targetBox: { x: 595, y: 285, w: 65, h: 75 },
    renderA: function() {
      return `
        <svg viewBox="0 0 800 500" class="scene-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Room Background Wall -->
          <rect width="800" height="350" fill="#f1f2f6"/>
          
          <!-- Modern Wall Art -->
          <rect x="80" y="60" width="130" height="140" fill="#ffffff" stroke="#ced6e0" stroke-width="6"/>
          <circle cx="145" cy="120" r="35" fill="#2ed573"/>
          <polygon points="110,160 145,100 180,160" fill="#3742fa" opacity="0.7"/>

          <!-- Wall Clock showing 10:10 -->
          <circle cx="400" cy="110" r="45" fill="#ffffff" stroke="#2f3542" stroke-width="6"/>
          <circle cx="400" cy="110" r="3" fill="#ff4757"/>
          <line x1="400" y1="110" x2="380" y2="85" stroke="#2f3542" stroke-width="4" stroke-linecap="round"/>
          <line x1="400" y1="110" x2="425" y2="90" stroke="#2f3542" stroke-width="3" stroke-linecap="round"/>

          <!-- Large Wooden Desk Surface -->
          <polygon points="0,320 800,320 800,500 0,500" fill="#d29b62"/>
          <rect x="0" y="320" width="800" height="20" fill="#b97736"/>

          <!-- Modern Laptop -->
          <g transform="translate(270, 230)">
            <!-- Screen -->
            <rect x="40" y="20" width="180" height="110" rx="8" fill="#2f3542"/>
            <rect x="46" y="26" width="168" height="98" fill="#1e272e"/>
            <!-- Code Lines on Screen -->
            <line x1="55" y1="40" x2="100" y2="40" stroke="#00d2d3" stroke-width="4"/>
            <line x1="55" y1="52" x2="130" y2="52" stroke="#ff9f43" stroke-width="4"/>
            <line x1="65" y1="64" x2="150" y2="64" stroke="#10ac84" stroke-width="3"/>
            <line x1="65" y1="74" x2="120" y2="74" stroke="#ee5253" stroke-width="3"/>
            <line x1="55" y1="86" x2="90" y2="86" stroke="#54a0ff" stroke-width="4"/>
            <line x1="55" y1="98" x2="140" y2="98" stroke="#feca57" stroke-width="3"/>
            <!-- Base / Keyboard -->
            <polygon points="20,130 240,130 260,150 0,150" fill="#747d8c"/>
            <rect x="90" y="132" width="80" height="12" fill="#57606f"/>
          </g>

          <!-- Potted Plant on Left Desk -->
          <g transform="translate(100, 250)">
            <polygon points="20,60 50,60 45,95 25,95" fill="#e17055"/>
            <ellipse cx="35" cy="55" rx="20" ry="25" fill="#2ed573"/>
            <ellipse cx="20" cy="40" rx="16" ry="20" fill="#26de81"/>
            <ellipse cx="48" cy="40" rx="16" ry="20" fill="#26de81"/>
          </g>

          <!-- Notebook & Pen -->
          <rect x="200" y="380" width="60" height="75" rx="3" fill="#ffeaa7" transform="rotate(-10, 200, 380)"/>
          <line x1="265" y1="375" x2="275" y2="435" stroke="#0984e3" stroke-width="4" stroke-linecap="round"/>

          <!-- Desk Lamp on Right -->
          <g transform="translate(680, 210)">
            <ellipse cx="40" cy="150" rx="30" ry="10" fill="#2d3436"/>
            <path d="M 40 150 L 30 70 L 10 30" stroke="#636e72" stroke-width="6" fill="none"/>
            <polygon points="-5,15 25,15 40,40 -20,40" fill="#e17055"/>
          </g>

          <!-- TARGET ELEMENT: Steaming Ceramic Coffee Mug -->
          <g id="target-mug">
            <rect x="605" y="305" width="34" height="42" rx="4" fill="#0984e3"/>
            <ellipse cx="622" cy="305" rx="17" ry="5" fill="#74b9ff"/>
            <ellipse cx="622" cy="307" rx="14" ry="3" fill="#574b90"/>
            <!-- Mug Handle -->
            <path d="M 639 313 Q 652 324 639 335" stroke="#0984e3" stroke-width="4" fill="none"/>
            <!-- Steam -->
            <path d="M 618 295 Q 614 285 620 275" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
            <path d="M 626 298 Q 630 288 625 278" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
          </g>
        </svg>
      `;
    },
    renderB: function() {
      // Scene B: Coffee mug on desk disappears!
      const original = this.renderA();
      return original.replace(/<g id="target-mug">[\s\S]*?<\/g>/, '<!-- mug removed -->');
    }
  },
  {
    id: 'airplane-tarmac',
    name: 'Airport Runway & Jet',
    category: 'Aviation',
    difficulty: 'Challenging',
    changeDescription: 'Large jet engine under the aircraft wing disappeared',
    targetBox: { x: 260, y: 260, w: 90, h: 70 },
    renderA: function() {
      return `
        <svg viewBox="0 0 800 500" class="scene-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Sky with Sunset Hues -->
          <defs>
            <linearGradient id="tarmacSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4a69bd"/>
              <stop offset="60%" stop-color="#82ccdd"/>
              <stop offset="100%" stop-color="#f8c291"/>
            </linearGradient>
          </defs>
          <rect width="800" height="280" fill="url(#tarmacSky)"/>

          <!-- Distant Runway Surface -->
          <polygon points="0,260 800,260 800,500 0,500" fill="#3d3d3d"/>
          <!-- Runway Concrete Seams -->
          <line x1="0" y1="360" x2="800" y2="360" stroke="#535c68" stroke-width="2"/>
          <line x1="0" y1="440" x2="800" y2="440" stroke="#535c68" stroke-width="2"/>
          
          <!-- Yellow Taxiway Line -->
          <path d="M 0 460 Q 300 460 500 380 L 800 380" stroke="#f6b93b" stroke-width="6" fill="none"/>

          <!-- Distant Air Traffic Control Tower -->
          <g transform="translate(680, 110)">
            <rect x="25" y="50" width="16" height="100" fill="#dcdde1"/>
            <polygon points="15,40 51,40 45,50 21,50" fill="#2f3542"/>
            <rect x="18" y="25" width="30" height="15" rx="3" fill="#718093"/>
            <!-- Beacon light -->
            <circle cx="33" cy="20" r="4" fill="#e55039"/>
          </g>

          <!-- Passenger Jetliner -->
          <g id="airplane">
            <!-- Fuselage -->
            <ellipse cx="440" cy="220" rx="260" ry="45" fill="#f5f6fa"/>
            <!-- Nose Cone -->
            <path d="M 700 220 Q 720 225 690 238 Z" fill="#2f3640"/>
            <!-- Windows Row -->
            <g fill="#2f3640">
              <circle cx="280" cy="215" r="3"/><circle cx="300" cy="215" r="3"/><circle cx="320" cy="215" r="3"/>
              <circle cx="340" cy="215" r="3"/><circle cx="360" cy="215" r="3"/><circle cx="380" cy="215" r="3"/>
              <circle cx="400" cy="215" r="3"/><circle cx="420" cy="215" r="3"/><circle cx="440" cy="215" r="3"/>
              <circle cx="460" cy="215" r="3"/><circle cx="480" cy="215" r="3"/><circle cx="500" cy="215" r="3"/>
              <circle cx="520" cy="215" r="3"/><circle cx="540" cy="215" r="3"/><circle cx="560" cy="215" r="3"/>
            </g>
            <!-- Tail Fin -->
            <polygon points="180,210 240,210 210,100 160,100" fill="#e55039"/>
            
            <!-- Left Wing -->
            <polygon points="320,230 450,230 360,290 240,290" fill="#dcdde1"/>

            <!-- TARGET ELEMENT: Jet Engine suspended below wing -->
            <g id="target-engine">
              <ellipse cx="300" cy="290" rx="42" ry="24" fill="#718093"/>
              <ellipse cx="265" cy="290" rx="14" ry="20" fill="#2f3640"/>
              <ellipse cx="265" cy="290" rx="8" ry="12" fill="#57606f"/>
              <!-- Engine Pylon -->
              <rect x="295" y="270" width="10" height="20" fill="#57606f"/>
            </g>

            <!-- Landing Gear Wheels -->
            <g transform="translate(420, 260)">
              <rect x="0" y="0" width="8" height="50" fill="#718093"/>
              <circle cx="-5" cy="52" r="10" fill="#1e272e"/>
              <circle cx="13" cy="52" r="10" fill="#1e272e"/>
            </g>
          </g>

          <!-- Luggage Towing Cart on Tarmac -->
          <g transform="translate(560, 340)">
            <rect x="0" y="10" width="45" height="25" rx="4" fill="#f6b93b"/>
            <rect x="30" y="0" width="15" height="15" fill="#f6b93b"/>
            <circle cx="12" cy="38" r="8" fill="#2f3640"/>
            <circle cx="38" cy="38" r="8" fill="#2f3640"/>
            <!-- Luggage cart hitch & trailer -->
            <line x1="45" y1="25" x2="65" y2="25" stroke="#2f3640" stroke-width="4"/>
            <rect x="65" y="12" width="50" height="20" fill="#4a69bd"/>
            <circle cx="75" cy="36" r="6" fill="#2f3640"/>
            <circle cx="105" cy="36" r="6" fill="#2f3640"/>
          </g>
        </svg>
      `;
    },
    renderB: function() {
      // Scene B: Aircraft jet engine vanishes!
      const original = this.renderA();
      return original.replace(/<g id="target-engine">[\s\S]*?<\/g>/, '<!-- engine removed -->');
    }
  },
  {
    id: 'cozy-living-room',
    name: 'Cozy Living Room',
    category: 'Interior Scene',
    difficulty: 'Moderate',
    changeDescription: 'Large round wall clock above the sofa disappeared',
    targetBox: { x: 360, y: 40, w: 80, h: 80 },
    renderA: function() {
      return `
        <svg viewBox="0 0 800 500" class="scene-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Wallpaper -->
          <rect width="800" height="380" fill="#e9ecef"/>
          <!-- Hardwood Floor -->
          <rect y="380" width="800" height="120" fill="#8d6e63"/>
          <line x1="0" y1="420" x2="800" y2="420" stroke="#795548" stroke-width="2"/>
          <line x1="0" y1="460" x2="800" y2="460" stroke="#795548" stroke-width="2"/>

          <!-- Persian Area Rug -->
          <ellipse cx="400" cy="440" rx="220" ry="45" fill="#b71540"/>
          <ellipse cx="400" cy="440" rx="190" ry="35" fill="#f8c291" stroke="#fad390" stroke-width="4"/>

          <!-- Large Comfortable Blue Sofa -->
          <g transform="translate(200, 230)">
            <!-- Sofa Backrest -->
            <rect x="40" y="0" width="320" height="120" rx="15" fill="#1e3799"/>
            <!-- Armrests -->
            <rect x="20" y="40" width="40" height="90" rx="12" fill="#0c2461"/>
            <rect x="340" y="40" width="40" height="90" rx="12" fill="#0c2461"/>
            <!-- Cushions -->
            <rect x="60" y="80" width="135" height="50" rx="8" fill="#4a69bd"/>
            <rect x="205" y="80" width="135" height="50" rx="8" fill="#4a69bd"/>
            <!-- Throw Pillow Yellow -->
            <rect x="65" y="60" width="45" height="45" rx="6" fill="#f6b93b" transform="rotate(-15, 65, 60)"/>
            <!-- Throw Pillow Coral -->
            <rect x="285" y="60" width="45" height="45" rx="6" fill="#e55039" transform="rotate(15, 285, 60)"/>
          </g>

          <!-- TARGET ELEMENT: Large Decorative Wall Clock -->
          <g id="target-wall-clock">
            <circle cx="400" cy="80" r="36" fill="#f5f6fa" stroke="#2f3542" stroke-width="6"/>
            <circle cx="400" cy="80" r="3" fill="#e55039"/>
            <!-- Hour & Minute hands -->
            <line x1="400" y1="80" x2="400" y2="55" stroke="#2f3542" stroke-width="4" stroke-linecap="round"/>
            <line x1="400" y1="80" x2="420" y2="80" stroke="#2f3542" stroke-width="3" stroke-linecap="round"/>
            <!-- Hour ticks -->
            <circle cx="400" cy="50" r="2" fill="#2f3542"/>
            <circle cx="430" cy="80" r="2" fill="#2f3542"/>
            <circle cx="400" cy="110" r="2" fill="#2f3542"/>
            <circle cx="370" cy="80" r="2" fill="#2f3542"/>
          </g>

          <!-- Tall Bookshelf on Left -->
          <g transform="translate(40, 100)">
            <rect x="0" y="0" width="90" height="280" fill="#5c4033"/>
            <!-- Shelves -->
            <line x1="0" y1="70" x2="90" y2="70" stroke="#3e2723" stroke-width="6"/>
            <line x1="0" y1="140" x2="90" y2="140" stroke="#3e2723" stroke-width="6"/>
            <line x1="0" y1="210" x2="90" y2="210" stroke="#3e2723" stroke-width="6"/>
            <!-- Books Shelf 1 -->
            <rect x="10" y="20" width="12" height="48" fill="#e55039"/>
            <rect x="24" y="15" width="15" height="53" fill="#4a69bd"/>
            <rect x="41" y="25" width="10" height="43" fill="#78e08f"/>
            <rect x="53" y="18" width="14" height="50" fill="#f6b93b"/>
            <!-- Books Shelf 2 -->
            <rect x="15" y="90" width="16" height="48" fill="#6a89cc"/>
            <rect x="33" y="85" width="18" height="53" fill="#b71540"/>
            <rect x="53" y="95" width="22" height="43" fill="#38ada9"/>
          </g>

          <!-- Floor Lamp on Right -->
          <g transform="translate(680, 160)">
            <ellipse cx="30" cy="240" rx="35" ry="10" fill="#2f3542"/>
            <line x1="30" y1="240" x2="30" y2="40" stroke="#2f3542" stroke-width="5"/>
            <polygon points="5,40 55,40 45,0 15,0" fill="#fad390"/>
          </g>

          <!-- Sleeping Cat on Rug -->
          <g transform="translate(370, 420)">
            <ellipse cx="25" cy="20" rx="22" ry="14" fill="#e67e22"/>
            <circle cx="42" cy="14" r="10" fill="#e67e22"/>
            <polygon points="40,6 45,1 48,8" fill="#d35400"/>
            <polygon points="45,6 50,1 53,8" fill="#d35400"/>
            <!-- Curled Tail -->
            <path d="M 6 22 Q -4 14 0 6" stroke="#e67e22" stroke-width="4" fill="none"/>
          </g>
        </svg>
      `;
    },
    renderB: function() {
      // Scene B: The wall clock vanishes!
      const original = this.renderA();
      return original.replace(/<g id="target-wall-clock">[\s\S]*?<\/g>/, '<!-- wall clock removed -->');
    }
  },
  {
    id: 'park-picnic',
    name: 'Sunny Park Picnic',
    category: 'Nature & Outdoors',
    difficulty: 'Easy',
    changeDescription: 'Red kite flying high in the blue sky disappeared',
    targetBox: { x: 550, y: 35, w: 90, h: 90 },
    renderA: function() {
      return `
        <svg viewBox="0 0 800 500" class="scene-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Sky -->
          <rect width="800" height="300" fill="#81ecec"/>
          <!-- Sun -->
          <circle cx="100" cy="80" r="45" fill="#f9ca24"/>

          <!-- Distant Hills -->
          <ellipse cx="200" cy="300" rx="260" ry="80" fill="#badc58"/>
          <ellipse cx="600" cy="300" rx="300" ry="90" fill="#6ab04c"/>

          <!-- Foreground Park Grass -->
          <rect y="290" width="800" height="210" fill="#44bd32"/>

          <!-- Large Shady Oak Tree Left -->
          <g transform="translate(40, 110)">
            <!-- Trunk -->
            <polygon points="60,250 85,250 80,120 55,120" fill="#795548"/>
            <!-- Canopy -->
            <circle cx="70" cy="80" r="70" fill="#2ed573"/>
            <circle cx="30" cy="90" r="50" fill="#26de81"/>
            <circle cx="110" cy="90" r="50" fill="#10ac84"/>
            <circle cx="70" cy="30" r="45" fill="#2ed573"/>
          </g>

          <!-- Checkered Picnic Blanket -->
          <polygon points="320,380 540,380 590,460 270,460" fill="#ff7675"/>
          <!-- Grid lines for checkered cloth -->
          <line x1="375" y1="380" x2="350" y2="460" stroke="#ffffff" stroke-width="6"/>
          <line x1="430" y1="380" x2="430" y2="460" stroke="#ffffff" stroke-width="6"/>
          <line x1="485" y1="380" x2="510" y2="460" stroke="#ffffff" stroke-width="6"/>
          <line x1="295" y1="420" x2="565" y2="420" stroke="#ffffff" stroke-width="6"/>

          <!-- Woven Picnic Basket -->
          <rect x="360" y="390" width="60" height="40" rx="5" fill="#e58e26"/>
          <line x1="360" y1="405" x2="420" y2="405" stroke="#b71540" stroke-width="4"/>
          <!-- Basket Handle -->
          <path d="M 375 390 Q 390 365 405 390" stroke="#b71540" stroke-width="4" fill="none"/>

          <!-- Park Bench in Background -->
          <g transform="translate(620, 275)">
            <rect x="0" y="10" width="90" height="8" rx="2" fill="#8d6e63"/>
            <rect x="0" y="22" width="90" height="8" rx="2" fill="#8d6e63"/>
            <line x1="10" y1="25" x2="10" y2="50" stroke="#2f3542" stroke-width="4"/>
            <line x1="80" y1="25" x2="80" y2="50" stroke="#2f3542" stroke-width="4"/>
          </g>

          <!-- TARGET ELEMENT: Flying Diamond Kite in the Sky -->
          <g id="target-kite">
            <polygon points="590,40 615,65 590,90 565,65" fill="#ff3838"/>
            <line x1="590" y1="40" x2="590" y2="90" stroke="#ffffff" stroke-width="2"/>
            <line x1="565" y1="65" x2="615" y2="65" stroke="#ffffff" stroke-width="2"/>
            <!-- Kite Tail & Bows -->
            <path d="M 590 90 Q 610 110 595 125" stroke="#f6b93b" stroke-width="2" fill="none"/>
            <circle cx="603" cy="102" r="3" fill="#38ada9"/>
            <circle cx="598" cy="116" r="3" fill="#e55039"/>
          </g>

          <!-- Pond with Duck on Left -->
          <ellipse cx="200" cy="460" rx="60" ry="25" fill="#00d2d3"/>
          <ellipse cx="195" cy="455" rx="10" ry="6" fill="#f6b93b"/>
          <circle cx="203" cy="452" r="4" fill="#f6b93b"/>
        </svg>
      `;
    },
    renderB: function() {
      // Scene B: Kite disappears from the sky!
      const original = this.renderA();
      return original.replace(/<g id="target-kite">[\s\S]*?<\/g>/, '<!-- kite removed -->');
    }
  },
  {
    id: 'science-lab',
    name: 'Chemistry Laboratory',
    category: 'Scientific Research',
    difficulty: 'Challenging',
    changeDescription: 'Erlenmeyer chemical flask on the counter disappeared',
    targetBox: { x: 385, y: 285, w: 70, h: 85 },
    renderA: function() {
      return `
        <svg viewBox="0 0 800 500" class="scene-svg" xmlns="http://www.w3.org/2000/svg">
          <!-- Tiled Wall -->
          <rect width="800" height="340" fill="#f1f2f6"/>
          <!-- Tile Grid Pattern -->
          <line x1="0" y1="60" x2="800" y2="60" stroke="#dfe4ea" stroke-width="1"/>
          <line x1="0" y1="120" x2="800" y2="120" stroke="#dfe4ea" stroke-width="1"/>
          <line x1="0" y1="180" x2="800" y2="180" stroke="#dfe4ea" stroke-width="1"/>
          <line x1="0" y1="240" x2="800" y2="240" stroke="#dfe4ea" stroke-width="1"/>

          <!-- Periodic Table Chart on Wall -->
          <rect x="60" y="50" width="180" height="110" fill="#ffffff" stroke="#747d8c" stroke-width="4"/>
          <rect x="70" y="60" width="20" height="20" fill="#ff7675"/>
          <rect x="95" y="60" width="20" height="20" fill="#74b9ff"/>
          <rect x="120" y="60" width="20" height="20" fill="#55efc4"/>
          <rect x="145" y="60" width="20" height="20" fill="#ffeaa7"/>
          <rect x="170" y="60" width="20" height="20" fill="#a29bfe"/>
          <rect x="195" y="60" width="20" height="20" fill="#fd79a8"/>
          <!-- Text placeholder -->
          <rect x="70" y="85" width="160" height="10" fill="#b2bec3"/>
          <rect x="70" y="100" width="160" height="10" fill="#b2bec3"/>

          <!-- Whiteboard with Chemical Formula -->
          <rect x="520" y="50" width="220" height="120" fill="#ffffff" stroke="#2d3436" stroke-width="5"/>
          <!-- Hexagon Molecule Drawing -->
          <polygon points="630,90 655,75 680,90 680,120 655,135 630,120" stroke="#0984e3" stroke-width="3" fill="none"/>
          <circle cx="680" cy="90" r="4" fill="#d63031"/>
          <line x1="680" y1="90" x2="705" y2="75" stroke="#0984e3" stroke-width="3"/>

          <!-- Lab Granite Countertop -->
          <polygon points="0,320 800,320 800,500 0,500" fill="#2d3436"/>
          <rect x="0" y="320" width="800" height="15" fill="#636e72"/>

          <!-- Microscope on Left -->
          <g transform="translate(180, 220)">
            <!-- Base -->
            <ellipse cx="40" cy="130" rx="35" ry="12" fill="#747d8c"/>
            <!-- Arm -->
            <path d="M 55 130 Q 75 70 50 40 L 30 50" stroke="#747d8c" stroke-width="12" fill="none"/>
            <!-- Eyepiece Tube -->
            <line x1="25" y1="20" x2="45" y2="60" stroke="#2d3436" stroke-width="10"/>
            <!-- Objective Lens -->
            <rect x="20" y="70" width="10" height="18" fill="#2d3436"/>
            <!-- Stage -->
            <rect x="10" y="90" width="40" height="6" fill="#2d3436"/>
          </g>

          <!-- TARGET ELEMENT: Erlenmeyer Flask with Green Liquid -->
          <g id="target-flask">
            <polygon points="415,295 425,295 435,355 405,355" fill="#55efc4" opacity="0.85"/>
            <polygon points="415,285 425,285 442,360 398,360" stroke="#ffffff" stroke-width="3" fill="none"/>
            <rect x="413" y="282" width="14" height="5" rx="2" fill="#dfe6e9"/>
            <!-- Bubbles inside -->
            <circle cx="415" cy="330" r="3" fill="#ffffff" opacity="0.8"/>
            <circle cx="425" cy="345" r="4" fill="#ffffff" opacity="0.8"/>
            <circle cx="420" cy="315" r="2" fill="#ffffff" opacity="0.8"/>
          </g>

          <!-- Test Tube Rack on Right -->
          <g transform="translate(520, 270)">
            <rect x="0" y="60" width="110" height="30" fill="#b2bec3"/>
            <!-- Test Tubes -->
            <rect x="15" y="20" width="12" height="65" rx="6" fill="#ff7675" stroke="#ffffff" stroke-width="2"/>
            <rect x="35" y="30" width="12" height="55" rx="6" fill="#74b9ff" stroke="#ffffff" stroke-width="2"/>
            <rect x="55" y="15" width="12" height="70" rx="6" fill="#ffeaa7" stroke="#ffffff" stroke-width="2"/>
            <rect x="75" y="25" width="12" height="60" rx="6" fill="#a29bfe" stroke="#ffffff" stroke-width="2"/>
          </g>
        </svg>
      `;
    },
    renderB: function() {
      // Scene B: Erlenmeyer flask vanishes!
      const original = this.renderA();
      return original.replace(/<g id="target-flask">[\s\S]*?<\/g>/, '<!-- flask removed -->');
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SCENES;
}

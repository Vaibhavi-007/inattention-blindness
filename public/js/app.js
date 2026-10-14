// Inattention & Change Blindness Cognitive Experiment Engine
// Author: Prototype for Rishab Bajaj

(function() {
  // State Object
  const state = {
    username: 'Rishab Bajaj',
    paradigm: 'single-flicker', // 'single-flicker' | 'continuous-flicker'
    stimulusDuration: 2500,     // ms for Image A
    blankDuration: 350,         // ms for Black Screen
    flickerCycleDuration: 600,  // ms per image in continuous flicker
    flickerBlankDuration: 150,  // ms blank in continuous flicker
    currentTrialIndex: 0,
    trials: [],                 // results of each trial
    activeScene: null,
    phase: 'idle',              // 'idle' | 'countdown' | 'imageA' | 'blank' | 'imageB' | 'feedback' | 'completed'
    startTime: 0,
    timerInterval: null,
    flickerTimeout: null,
    flickerState: 'A',          // 'A' | 'blank' | 'B'
    tolerancePadding: 24,       // pixel tolerance around target box
    sessionsHistory: []
  };

  // DOM Elements
  const el = {
    // Views
    viewSetup: document.getElementById('view-setup'),
    viewExperiment: document.getElementById('view-experiment'),
    viewResults: document.getElementById('view-results'),
    
    // Header & Badges
    badgeUsername: document.getElementById('badge-username'),
    btnNavHistory: document.getElementById('btn-nav-history'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    btnFullscreen: document.getElementById('btn-fullscreen'),
    
    // Setup inputs
    inputUsername: document.getElementById('input-username'),
    selectParadigm: document.getElementById('select-paradigm'),
    inputStimulusTime: document.getElementById('input-stimulus-time'),
    inputBlankTime: document.getElementById('input-blank-time'),
    btnStart: document.getElementById('btn-start-experiment'),
    
    // Experiment Stage
    stagePill: document.getElementById('stage-pill'),
    trialIndicator: document.getElementById('trial-indicator'),
    rtTicker: document.getElementById('rt-ticker'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    arenaCard: document.getElementById('arena-card'),
    arenaContent: document.getElementById('arena-content'),
    arenaOverlay: document.getElementById('arena-overlay'),
    promptIdle: document.getElementById('prompt-idle'),
    feedbackBanner: document.getElementById('feedback-banner'),
    feedbackText: document.getElementById('feedback-text'),
    btnNextTrial: document.getElementById('btn-next-trial'),
    
    // Results elements
    resParticipant: document.getElementById('res-participant'),
    resAccuracy: document.getElementById('res-accuracy'),
    resAvgRt: document.getElementById('res-avg-rt'),
    resTotalHits: document.getElementById('res-total-hits'),
    resTotalMisses: document.getElementById('res-total-misses'),
    insightTitle: document.getElementById('insight-title'),
    insightText: document.getElementById('insight-text'),
    trialsTableBody: document.getElementById('trials-table-body'),
    btnRestart: document.getElementById('btn-restart'),
    btnDownloadCsv: document.getElementById('btn-download-csv'),
    
    // History Modal
    historyModal: document.getElementById('history-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    historyListBody: document.getElementById('history-list-body'),
    btnClearHistory: document.getElementById('btn-clear-history')
  };

  // Initialize
  function init() {
    el.inputUsername.value = state.username;
    el.badgeUsername.textContent = state.username;
    attachEventListeners();
    fetchHistory();
  }

  function attachEventListeners() {
    el.inputUsername.addEventListener('input', (e) => {
      state.username = e.target.value.trim() || 'Rishab Bajaj';
      el.badgeUsername.textContent = state.username;
    });

    el.btnStart.addEventListener('click', startExperiment);
    el.btnNextTrial.addEventListener('click', proceedToNextTrial);
    el.btnRestart.addEventListener('click', restartExperiment);

    if (el.btnFullscreen) {
      el.btnFullscreen.addEventListener('click', toggleFullscreen);
    }

    document.addEventListener('fullscreenchange', () => {
      if (el.btnFullscreen) {
        if (document.fullscreenElement) {
          el.btnFullscreen.textContent = '⛷ Exit Fullscreen';
        } else {
          el.btnFullscreen.textContent = '⛶ Fullscreen';
        }
      }
    });

    el.btnSoundToggle.addEventListener('click', () => {
      window.soundFx.enabled = !window.soundFx.enabled;
      el.btnSoundToggle.textContent = window.soundFx.enabled ? '🔊 Sound On' : '🔇 Muted';
    });

    // Arena click handler for detecting target
    el.arenaCard.addEventListener('click', handleArenaClick);

    // History Modal handlers
    el.btnNavHistory.addEventListener('click', openHistoryModal);
    el.btnCloseModal.addEventListener('click', closeHistoryModal);
    el.historyModal.addEventListener('click', (e) => {
      if (e.target === el.historyModal) closeHistoryModal();
    });
    el.btnClearHistory.addEventListener('click', clearHistory);
    el.btnDownloadCsv.addEventListener('click', downloadCsv);

    // Universal Space & Enter Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      const isInputFocused = (document.activeElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName));

      // F key toggles fullscreen (when not typing)
      if ((e.key === 'f' || e.key === 'F') && !isInputFocused) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Space key actions
      if (e.code === 'Space') {
        // 1. Advance trial if feedback active
        if (state.phase === 'feedback' && el.btnNextTrial.style.display !== 'none') {
          e.preventDefault();
          proceedToNextTrial();
          return;
        }
        // 2. Start experiment if on setup screen and not typing
        if (el.viewSetup.classList.contains('active') && !isInputFocused) {
          e.preventDefault();
          startExperiment();
          return;
        }
        // 3. Restart if on results screen
        if (el.viewResults.classList.contains('active') && !isInputFocused) {
          e.preventDefault();
          restartExperiment();
          return;
        }
      }

      // Enter key actions
      if (e.key === 'Enter') {
        if (el.viewSetup.classList.contains('active')) {
          e.preventDefault();
          startExperiment();
          return;
        }
        if (state.phase === 'feedback' && el.btnNextTrial.style.display !== 'none') {
          e.preventDefault();
          proceedToNextTrial();
          return;
        }
        if (el.viewResults.classList.contains('active')) {
          e.preventDefault();
          restartExperiment();
          return;
        }
      }
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request denied:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // Switch View
  function showView(viewName) {
    el.viewSetup.classList.remove('active');
    el.viewExperiment.classList.remove('active');
    el.viewResults.classList.remove('active');

    if (viewName === 'setup') el.viewSetup.classList.add('active');
    if (viewName === 'experiment') el.viewExperiment.classList.add('active');
    if (viewName === 'results') el.viewResults.classList.add('active');
  }

  // Start Experiment
  function startExperiment() {
    state.username = el.inputUsername.value.trim() || 'Rishab Bajaj';
    state.paradigm = el.selectParadigm.value;
    state.stimulusDuration = parseInt(el.inputStimulusTime.value, 10) || 2500;
    state.blankDuration = parseInt(el.inputBlankTime.value, 10) || 350;
    
    state.currentTrialIndex = 0;
    state.trials = [];

    showView('experiment');
    runTrial(0);
  }

  // Run a specific trial
  function runTrial(index) {
    if (index >= SCENES.length) {
      finishExperiment();
      return;
    }

    state.currentTrialIndex = index;
    state.activeScene = SCENES[index];
    state.phase = 'countdown';

    // Clear feedback and ripples, restore idle dock
    clearArenaOverlays();
    if (el.promptIdle) el.promptIdle.style.display = 'flex';
    el.feedbackBanner.style.display = 'none';
    el.btnNextTrial.style.display = 'none';

    el.trialIndicator.textContent = `Trial ${index + 1} of ${SCENES.length}: ${state.activeScene.name}`;
    setStagePill('countdown', 'Preparing...');
    el.rtTicker.textContent = '0.000s';
    el.progressBarFill.style.width = '0%';

    // Step 1: 3-2-1 Brief Countdown
    let count = 2;
    el.arenaCard.classList.remove('blank-screen');
    el.arenaContent.innerHTML = '';
    el.arenaOverlay.style.display = 'block';
    el.arenaOverlay.textContent = `Trial ${index + 1} starting in ${count}...`;

    const countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        el.arenaOverlay.textContent = `Trial ${index + 1} starting in ${count}...`;
        window.soundFx.playTick();
      } else {
        clearInterval(countdownTimer);
        el.arenaOverlay.style.display = 'none';
        if (state.paradigm === 'single-flicker') {
          runSingleFlickerProtocol();
        } else {
          runContinuousFlickerProtocol();
        }
      }
    }, 700);
  }

  // Single-Flicker Protocol:
  // Phase 1: Show Scene A for stimulusDuration ms
  // Phase 2: Show Black Screen for blankDuration ms
  // Phase 3: Show Scene B and wait for click
  function runSingleFlickerProtocol() {
    state.phase = 'imageA';
    setStagePill('preview', 'Phase 1: Study Initial Image');
    
    el.arenaCard.classList.remove('blank-screen');
    el.arenaContent.innerHTML = state.activeScene.renderA();

    // Animate progress bar for Phase 1
    const startTime = Date.now();
    const duration = state.stimulusDuration;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      el.progressBarFill.style.width = `${pct}%`;

      if (elapsed >= duration) {
        clearInterval(progressInterval);
        triggerBlankScreen();
      }
    }, 20);
  }

  function triggerBlankScreen() {
    state.phase = 'blank';
    setStagePill('blank', 'Phase 2: Blank Screen (Flicker Mask)');
    window.soundFx.playTick();

    el.arenaCard.classList.add('blank-screen');
    el.arenaContent.innerHTML = '';
    el.progressBarFill.style.width = '100%';

    setTimeout(() => {
      triggerModifiedImage();
    }, state.blankDuration);
  }

  function triggerModifiedImage() {
    state.phase = 'imageB';
    setStagePill('active', 'Phase 3: Spot The Change & Click!');
    el.progressBarFill.style.width = '0%';

    el.arenaCard.classList.remove('blank-screen');
    el.arenaContent.innerHTML = state.activeScene.renderB();

    // Start high-precision reaction timer
    state.startTime = performance.now();
    startLiveTicker();
  }

  // Continuous Flicker Protocol (Rensink Paradigm):
  function runContinuousFlickerProtocol() {
    state.phase = 'imageB';
    setStagePill('active', 'Continuous Flicker: Spot The Change & Click!');
    state.flickerState = 'A';
    state.startTime = performance.now();
    startLiveTicker();

    function cycle() {
      if (state.phase !== 'imageB') return;

      if (state.flickerState === 'A') {
        el.arenaCard.classList.remove('blank-screen');
        el.arenaContent.innerHTML = state.activeScene.renderA();
        state.flickerTimeout = setTimeout(() => {
          state.flickerState = 'blank1';
          cycle();
        }, state.flickerCycleDuration);
      } else if (state.flickerState === 'blank1') {
        el.arenaCard.classList.add('blank-screen');
        el.arenaContent.innerHTML = '';
        state.flickerTimeout = setTimeout(() => {
          state.flickerState = 'B';
          cycle();
        }, state.flickerBlankDuration);
      } else if (state.flickerState === 'B') {
        el.arenaCard.classList.remove('blank-screen');
        el.arenaContent.innerHTML = state.activeScene.renderB();
        state.flickerTimeout = setTimeout(() => {
          state.flickerState = 'blank2';
          cycle();
        }, state.flickerCycleDuration);
      } else if (state.flickerState === 'blank2') {
        el.arenaCard.classList.add('blank-screen');
        el.arenaContent.innerHTML = '';
        state.flickerTimeout = setTimeout(() => {
          state.flickerState = 'A';
          cycle();
        }, state.flickerBlankDuration);
      }
    }

    cycle();
  }

  // Live millisecond reaction timer
  function startLiveTicker() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      const now = performance.now();
      const diffSec = ((now - state.startTime) / 1000).toFixed(3);
      el.rtTicker.textContent = `${diffSec}s`;
    }, 20);
  }

  function stopLiveTicker() {
    clearInterval(state.timerInterval);
    clearTimeout(state.flickerTimeout);
  }

  // Click detection on the Arena
  function handleArenaClick(e) {
    if (state.phase !== 'imageB') {
      return;
    }

    stopLiveTicker();
    state.phase = 'feedback';

    const reactionTime = Math.round(performance.now() - state.startTime);
    const rect = el.arenaCard.getBoundingClientRect();

    // Calculate click coordinates in 800x500 normalized SVG space
    const clickX = ((e.clientX - rect.left) / rect.width) * 800;
    const clickY = ((e.clientY - rect.top) / rect.height) * 500;

    const target = state.activeScene.targetBox;
    const pad = state.tolerancePadding;

    // Check hit test
    const isHit = (
      clickX >= (target.x - pad) &&
      clickX <= (target.x + target.w + pad) &&
      clickY >= (target.y - pad) &&
      clickY <= (target.y + target.h + pad)
    );

    // Freeze on Image B
    el.arenaCard.classList.remove('blank-screen');
    el.arenaContent.innerHTML = state.activeScene.renderB();

    // Render Click Ripple at user's click position
    renderClickRipple(e.clientX - rect.left, e.clientY - rect.top, isHit);

    // Reveal the true target bounding box with amber dashed highlight
    renderTargetBoxReveal(target, rect.width / 800, rect.height / 500);

    // Play Audio Feedback
    if (isHit) {
      window.soundFx.playHit();
    } else {
      window.soundFx.playMiss();
    }

    // Record trial record
    const trialRecord = {
      scenario: state.activeScene.name,
      targetName: state.activeScene.changeDescription,
      correct: isHit,
      reactionTime: reactionTime,
      clickPos: { x: Math.round(clickX), y: Math.round(clickY) },
      targetCenter: { x: Math.round(target.x + target.w / 2), y: Math.round(target.y + target.h / 2) }
    };
    state.trials.push(trialRecord);

    // Show feedback banner in dock
    showTrialFeedback(isHit, reactionTime);
  }

  function renderClickRipple(pxX, pxY, isHit) {
    const ripple = document.createElement('div');
    ripple.className = `click-ripple ${isHit ? 'hit' : 'miss'}`;
    ripple.style.left = `${pxX}px`;
    ripple.style.top = `${pxY}px`;
    el.arenaCard.appendChild(ripple);
  }

  function renderTargetBoxReveal(box, scaleX, scaleY) {
    const reveal = document.createElement('div');
    reveal.className = 'target-reveal-box';
    reveal.style.left = `${box.x * scaleX}px`;
    reveal.style.top = `${box.y * scaleY}px`;
    reveal.style.width = `${box.w * scaleX}px`;
    reveal.style.height = `${box.h * scaleY}px`;
    el.arenaCard.appendChild(reveal);
  }

  function clearArenaOverlays() {
    const ripples = el.arenaCard.querySelectorAll('.click-ripple, .target-reveal-box');
    ripples.forEach(node => node.remove());
  }

  function showTrialFeedback(isHit, rt) {
    if (el.promptIdle) el.promptIdle.style.display = 'none';
    el.feedbackBanner.style.display = 'flex';
    el.btnNextTrial.style.display = 'inline-flex';

    if (isHit) {
      el.feedbackBanner.className = 'dock-feedback hit';
      el.feedbackText.innerHTML = `✓ <strong>Spot On! Correct Change Detected.</strong> RT: <span class="font-mono">${(rt / 1000).toFixed(3)}s</span>. (${state.activeScene.changeDescription})`;
    } else {
      el.feedbackBanner.className = 'dock-feedback miss';
      el.feedbackText.innerHTML = `✕ <strong>Inattention Blindness Effect! Missed Change.</strong> Target highlighted (${state.activeScene.changeDescription}).`;
    }

    const isLast = (state.currentTrialIndex + 1 >= SCENES.length);
    el.btnNextTrial.innerHTML = isLast 
      ? `View Results <span class="kbd-pill">Space ↵</span>` 
      : `Next Trial <span class="kbd-pill">Space ↵</span>`;
  }

  function proceedToNextTrial() {
    runTrial(state.currentTrialIndex + 1);
  }

  // Completed Experiment
  function finishExperiment() {
    state.phase = 'completed';
    showView('results');

    const total = state.trials.length;
    const hits = state.trials.filter(t => t.correct).length;
    const misses = total - hits;
    const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0;
    
    // Average RT only for correct detections or all trials
    const hitTrials = state.trials.filter(t => t.correct);
    const avgRt = hitTrials.length > 0 
      ? Math.round(hitTrials.reduce((sum, t) => sum + t.reactionTime, 0) / hitTrials.length)
      : Math.round(state.trials.reduce((sum, t) => sum + t.reactionTime, 0) / total);

    // Populate Results Screen
    el.resParticipant.textContent = state.username;
    el.resAccuracy.textContent = `${accuracy}%`;
    el.resAvgRt.textContent = `${(avgRt / 1000).toFixed(2)}s`;
    el.resTotalHits.textContent = `${hits} / ${total}`;
    el.resTotalMisses.textContent = `${misses}`;

    // Cognitive Insight Diagnosis
    generateCognitiveInsight(accuracy, avgRt, misses);

    // Build breakdown table
    buildBreakdownTable();

    // Save session to backend
    saveSessionRecord({
      username: state.username,
      paradigm: state.paradigm,
      stimulusDuration: state.stimulusDuration,
      blankDuration: state.blankDuration,
      accuracy: accuracy,
      avgReactionTime: avgRt,
      totalTrials: total,
      hits: hits,
      misses: misses,
      trials: state.trials
    });
  }

  function generateCognitiveInsight(accuracy, avgRt, misses) {
    if (accuracy >= 80) {
      el.insightTitle.innerHTML = '🎯 Exceptional Visual Attentiveness';
      el.insightText.textContent = `${state.username} demonstrated high resistance to inattention and change blindness, identifying ${accuracy}% of changes with an average reaction time of ${(avgRt / 1000).toFixed(2)} seconds. The transient disruption was effectively countered by focused focal attention.`;
    } else if (accuracy >= 50) {
      el.insightTitle.innerHTML = '⚖️ Classic Inattention Blindness Observed';
      el.insightText.textContent = `A standard cognitive response: ${state.username} experienced change blindness on ${misses} trial(s). The brief blank screen masked the optical motion transients, requiring sequential top-down visual search rather than automatic pre-attentive detection.`;
    } else {
      el.insightTitle.innerHTML = '👁️ Strong Inattention Blindness Effect';
      el.insightText.textContent = `High susceptibility to the flicker mask paradigm. The visual system failed to detect ${misses} changes due to attentional capture elsewhere in the visual field. This is a classic hallmark of Rensink & Simons inattention blindness experiments.`;
    }
  }

  function buildBreakdownTable() {
    el.trialsTableBody.innerHTML = '';
    state.trials.forEach((t, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="font-mono" style="color:#64748b;">#${i + 1}</span></td>
        <td><strong>${escapeHtml(t.scenario)}</strong></td>
        <td><span style="color:#94a3b8;">${escapeHtml(t.targetName)}</span></td>
        <td>
          <span class="badge ${t.correct ? 'badge-hit' : 'badge-miss'}">
            ${t.correct ? '✓ Hit' : '✕ Miss'}
          </span>
        </td>
        <td class="font-mono">${(t.reactionTime / 1000).toFixed(3)}s</td>
      `;
      el.trialsTableBody.appendChild(tr);
    });
  }

  function restartExperiment() {
    showView('setup');
  }

  // Stage Pill styling helper
  function setStagePill(type, text) {
    el.stagePill.className = `phase-pill ${type}`;
    el.stagePill.innerHTML = `● ${text}`;
  }

  // API Persistence
  async function saveSessionRecord(payload) {
    try {
      const resp = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        fetchHistory();
      }
    } catch (e) {
      console.warn('Could not save session to server:', e);
    }
  }

  async function fetchHistory() {
    try {
      const resp = await fetch('/api/sessions');
      if (resp.ok) {
        state.sessionsHistory = await resp.json();
      }
    } catch (e) {
      console.warn('Error fetching history:', e);
    }
  }

  function openHistoryModal() {
    el.historyModal.classList.add('active');
    renderHistoryTable();
  }

  function closeHistoryModal() {
    el.historyModal.classList.remove('active');
  }

  function renderHistoryTable() {
    el.historyListBody.innerHTML = '';
    if (!state.sessionsHistory || state.sessionsHistory.length === 0) {
      el.historyListBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#64748b; padding:1.5rem;">No test sessions recorded yet. Complete a trial to see results here!</td></tr>';
      return;
    }

    state.sessionsHistory.forEach(s => {
      const dateStr = s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color:#f8fafc;">${escapeHtml(s.username || 'Subject')}</strong></td>
        <td><span style="font-size:0.75rem; color:#94a3b8;">${dateStr}</span></td>
        <td><span class="badge badge-hit">${s.accuracy ?? 0}%</span></td>
        <td class="font-mono">${((s.avgReactionTime || 0) / 1000).toFixed(2)}s</td>
        <td>${s.hits ?? 0}/${s.totalTrials ?? 0}</td>
        <td><span style="text-transform:capitalize; font-size:0.8rem; color:#94a3b8;">${s.paradigm || 'single'}</span></td>
      `;
      el.historyListBody.appendChild(tr);
    });
  }

  async function clearHistory() {
    if (!confirm('Are you sure you want to clear all participant session records?')) return;
    try {
      await fetch('/api/sessions', { method: 'DELETE' });
      state.sessionsHistory = [];
      renderHistoryTable();
    } catch (e) {
      alert('Error clearing records');
    }
  }

  function downloadCsv() {
    window.location.href = '/api/export/csv';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  // Run initial setup on page load
  document.addEventListener('DOMContentLoaded', init);
})();

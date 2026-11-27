// ============================================================================
// js/combat/combat_audio.js - 四层声学叠层战斗音效合成器 (Web Audio API)
// 机械伺服层 + 修真道音层 + 赛博电磁脉冲层 + 物理 Sub-Bass 重击层
// ============================================================================

(function () {
  let ctx = null;
  let muted = false;

  function ensureCtx() {
    if (muted) return null;
    if (!ctx) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return null;
      ctx = new AudioCtor();
    }
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function tone(c, type, f0, f1, dur, vol, delay = 0) {
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(20, f0), t);
    if (f1 && f1 !== f0) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    }
    g.gain.setValueAtTime(Math.max(0.0001, vol), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  function noiseBurst(c, dur, cutoff, vol, delay = 0) {
    const t = c.currentTime + delay;
    const sampleCount = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, sampleCount, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < sampleCount; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleCount * 0.45));
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, t);
    filter.Q.setValueAtTime(1.2, t);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(c.destination);
    src.start(t);
  }

  function play(event) {
    const c = ensureCtx();
    if (!c) return;
    try {
      switch (event) {
        case 'metal_light':
          tone(c, 'triangle', 1280, 420, 0.11, 0.14);
          tone(c, 'sine', 2400, 1100, 0.09, 0.08);
          noiseBurst(c, 0.06, 2200, 0.08);
          break;
        case 'metal_charge':
          tone(c, 'sawtooth', 520, 1760, 0.18, 0.18);
          tone(c, 'triangle', 1320, 2640, 0.34, 0.16, 0.03);
          tone(c, 'sine', 110, 52, 0.25, 0.22);
          break;
        case 'water_light':
          noiseBurst(c, 0.18, 950, 0.16);
          tone(c, 'sine', 480, 240, 0.18, 0.14);
          break;
        case 'water_charge':
          noiseBurst(c, 0.38, 720, 0.24);
          tone(c, 'sine', 320, 110, 0.35, 0.22);
          tone(c, 'triangle', 660, 330, 0.28, 0.12);
          break;
        case 'fire_light':
          tone(c, 'sawtooth', 260, 75, 0.18, 0.19);
          noiseBurst(c, 0.16, 600, 0.18);
          break;
        case 'fire_charge':
          tone(c, 'sawtooth', 180, 42, 0.45, 0.32);
          noiseBurst(c, 0.42, 420, 0.26);
          tone(c, 'sine', 90, 35, 0.48, 0.28);
          break;
        case 'switch_element':
          tone(c, 'sine', 740, 1110, 0.08, 0.11);
          tone(c, 'triangle', 320, 480, 0.06, 0.07, 0.02);
          break;
        case 'guard_up':
          tone(c, 'triangle', 260, 420, 0.09, 0.12);
          break;
        case 'parry_clang':
          // 青铜古钟震荡 + 高频剑鸣 + Sub-bass
          tone(c, 'sine', 980, 960, 0.45, 0.28);
          tone(c, 'triangle', 1960, 1420, 0.35, 0.20);
          tone(c, 'sawtooth', 140, 55, 0.22, 0.26);
          break;
        case 'hit_flesh':
          tone(c, 'triangle', 220, 80, 0.07, 0.15);
          noiseBurst(c, 0.05, 1600, 0.08);
          break;
        case 'hit_shield':
          tone(c, 'sine', 1450, 780, 0.08, 0.14);
          break;
        case 'shield_break':
          noiseBurst(c, 0.28, 2800, 0.24);
          tone(c, 'sawtooth', 620, 95, 0.32, 0.24);
          tone(c, 'sine', 120, 40, 0.36, 0.25);
          break;
        case 'core_grab_pull':
          tone(c, 'sawtooth', 240, 760, 0.45, 0.16);
          tone(c, 'sine', 520, 920, 0.45, 0.12);
          break;
        case 'core_grab_shatter':
          tone(c, 'sine', 130, 38, 0.42, 0.35);
          tone(c, 'triangle', 1240, 2680, 0.22, 0.18);
          noiseBurst(c, 0.24, 1800, 0.22);
          break;
        case 'dash':
          noiseBurst(c, 0.15, 1400, 0.15);
          tone(c, 'sine', 540, 180, 0.14, 0.12);
          break;
        case 'talisman':
          tone(c, 'sine', 1100, 1650, 0.14, 0.14);
          tone(c, 'triangle', 550, 825, 0.20, 0.10, 0.05);
          break;
        case 'mudra_beat_1':
          // 清脆木鱼/灵铃结印首拍
          tone(c, 'sine', 587, 880, 0.09, 0.14);
          tone(c, 'triangle', 1174, 880, 0.07, 0.06);
          break;
        case 'mudra_beat_2':
          // 升调交错灵丝共鸣拍
          tone(c, 'sine', 740, 1108, 0.10, 0.15);
          tone(c, 'triangle', 1480, 1760, 0.08, 0.07);
          break;
        case 'mudra_beat_3':
          // 结印敕令成印高鸣
          tone(c, 'sine', 880, 1760, 0.16, 0.17);
          tone(c, 'triangle', 440, 880, 0.18, 0.10);
          noiseBurst(c, 0.08, 2400, 0.07);
          break;
        case 'sword_whoosh_back':
          // 背后双肩飞剑擦肩破空呼啸
          tone(c, 'triangle', 1650, 520, 0.12, 0.14);
          tone(c, 'sine', 2400, 960, 0.09, 0.08);
          noiseBurst(c, 0.09, 2600, 0.11);
          break;
        case 'sword_sheath_back':
          // 飞剑归入背后剑匣清鸣
          tone(c, 'sine', 1320, 1760, 0.07, 0.06);
          break;
        case 'thunder_skill':
          // 九霄震雷破盾印：电弧炸裂 + 深沉雷鸣
          tone(c, 'sawtooth', 180, 36, 0.48, 0.30);
          tone(c, 'square', 980, 260, 0.22, 0.16);
          noiseBurst(c, 0.32, 1800, 0.24);
          break;
        case 'wanhun_domain':
          tone(c, 'sawtooth', 180, 90, 0.55, 0.22);
          tone(c, 'sine', 420, 630, 0.50, 0.14, 0.05);
          break;
        case 'pill':
          tone(c, 'sine', 660, 1320, 0.20, 0.15);
          tone(c, 'sine', 880, 1760, 0.22, 0.10, 0.06);
          break;
        case 'enemy_alert_qi':
          tone(c, 'triangle', 480, 720, 0.12, 0.11);
          break;
        case 'enemy_alert_found':
          tone(c, 'sawtooth', 240, 520, 0.24, 0.14);
          break;
        case 'enemy_alert_jindan':
          tone(c, 'sawtooth', 160, 320, 0.42, 0.20);
          tone(c, 'sine', 80, 45, 0.45, 0.24);
          break;
        case 'enemy_aoe_warn':
          tone(c, 'sine', 680, 980, 0.25, 0.12);
          break;
        case 'enemy_aoe_boom':
          tone(c, 'sawtooth', 160, 42, 0.35, 0.26);
          noiseBurst(c, 0.28, 520, 0.22);
          break;
        case 'offscreen_warn':
          tone(c, 'triangle', 1500, 1900, 0.11, 0.13);
          break;
        case 'turret_fire':
          tone(c, 'triangle', 920, 380, 0.10, 0.10);
          break;
        case 'corpse_box':
          tone(c, 'sine', 420, 840, 0.14, 0.15);
          tone(c, 'triangle', 620, 930, 0.12, 0.10, 0.06);
          break;
        case 'player_hit':
          tone(c, 'sawtooth', 140, 55, 0.16, 0.24);
          noiseBurst(c, 0.12, 500, 0.18);
          break;
        case 'player_down':
          tone(c, 'sawtooth', 260, 45, 0.75, 0.28);
          break;
      }
    } catch (e) {
      // ignore audio context errors
    }
  }

  window.CombatAudio = {
    play,
    setMuted: (m) => { muted = !!m; },
    isMuted: () => muted
  };
})();

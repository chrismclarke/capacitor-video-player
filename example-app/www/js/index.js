const { CapacitorVideoPlayer } = Capacitor.Plugins;

document.addEventListener('DOMContentLoaded', () => {
  const videoUrlInput = document.getElementById('videoUrl');
  const subtitleUrlInput = document.getElementById('subtitleUrl');
  const statusText = document.getElementById('status-text');
  const currentTimeText = document.getElementById('current-time');

  let playerId = null;

  const updateStatus = (text) => {
    statusText.textContent = text;
    console.log(`Status: ${text}`);
  };

  const updateTime = (time) => {
    currentTimeText.textContent = time;
  };

  // Listen for player events
  CapacitorVideoPlayer.addListener('playerReady', (res) => {
    playerId = res.playerId;
    updateStatus(`Player ${playerId} is ready`);
  });

  CapacitorVideoPlayer.addListener('playerPlay', (res) => {
    updateStatus(`Player ${res.playerId} is playing`);
  });

  CapacitorVideoPlayer.addListener('playerPause', (res) => {
    updateStatus(`Player ${res.playerId} is paused`);
  });

  CapacitorVideoPlayer.addListener('playerEnded', (res) => {
    updateStatus(`Player ${res.playerId} has ended`);
    playerId = null;
  });

  CapacitorVideoPlayer.addListener('playerExit', (res) => {
    updateStatus('Player has been dismissed');
    playerId = null;
  });

  // Button handlers
  document.getElementById('play').addEventListener('click', async () => {
    const videoUrl = videoUrlInput.value;
    const subtitleUrl = subtitleUrlInput.value;
    if (!videoUrl) {
      alert('Please enter a video URL');
      return;
    }
    updateStatus('Initializing player...');
    try {
      const res = await CapacitorVideoPlayer.initPlayer({
        mode: 'fullscreen',
        url: videoUrl,
        subtitle: subtitleUrl,
        playerId: 'test-player',
        componentTag: 'div'
      });
      updateStatus(`Player initialized. Player ID: ${res.playerId}`);
      playerId = res.playerId;
    } catch (err) {
      updateStatus(`Error: ${err.message}`);
    }
  });

  document.getElementById('pause').addEventListener('click', async () => {
    if (!playerId) return;
    await CapacitorVideoPlayer.pause({ playerId });
  });

  document.getElementById('stop').addEventListener('click', async () => {
    if (!playerId) return;
    await CapacitorVideoPlayer.stop({ playerId });
    playerId = null;
  });

  document.getElementById('getVolume').addEventListener('click', async () => {
    if (!playerId) return;
    const res = await CapacitorVideoPlayer.getVolume({ playerId });
    alert(`Current Volume: ${res.volume}`);
  });

  document.getElementById('setVolume').addEventListener('click', async () => {
    if (!playerId) return;
    await CapacitorVideoPlayer.setVolume({ playerId, volume: 0.5 });
  });

  document.getElementById('getMuted').addEventListener('click', async () => {
    if (!playerId) return;
    const res = await CapacitorVideoPlayer.getMuted({ playerId });
    alert(`Is Muted: ${res.muted}`);
  });

  document.getElementById('setMuted').addEventListener('click', async () => {
    if (!playerId) return;
    const isMuted = (await CapacitorVideoPlayer.getMuted({ playerId })).muted;
    await CapacitorVideoPlayer.setMuted({ playerId, muted: !isMuted });
  });

  // Update current time periodically
  setInterval(async () => {
    if (playerId && (await CapacitorVideoPlayer.isPlaying({ playerId })).isPlaying) {
      const res = await CapacitorVideoPlayer.getCurrentTime({ playerId });
      updateTime(res.currentTime);
    }
  }, 1000);
});
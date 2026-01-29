// src/utils/notificationSound.ts

export const playNotificationSound = (isFraud: boolean = false) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  if (isFraud) {
    // Som de alerta para fraude (mais grave e urgente)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(330, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.2)
    oscillator.type = 'square'
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.4)
  } else {
    // Som suave para transação normal
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1)
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.2)
  }
}
/**
 * Device Simulator — generates realistic telemetry changes over time
 * and simulates device state changes when commands are issued.
 */

import { useDeviceStore } from '../store/deviceStore';
import { useNotificationStore } from '../store/notificationStore';

let simulatorInterval: ReturnType<typeof setInterval> | null = null;
let anomalyInterval: ReturnType<typeof setInterval> | null = null;

export function startDeviceSimulator() {
  if (simulatorInterval) return; // already running

  // Drift device values slightly every 5 seconds
  simulatorInterval = setInterval(() => {
    const { devices, updateDevice } = useDeviceStore.getState();

    devices.forEach(device => {
      if (device.status !== 'online') return;

      switch (device.type) {
        case 'sensor':
          if (device.value.co2 !== undefined) {
            updateDevice(device.id, {
              co2: Math.max(400, Math.min(2000, (device.value.co2 ?? 800) + (Math.random() - 0.5) * 20)),
              humidity: Math.max(30, Math.min(90, (device.value.humidity ?? 60) + (Math.random() - 0.5) * 2)),
            });
          }
          break;
        case 'energy':
          if (device.value.on !== false) {
            updateDevice(device.id, {
              kwh: Math.max(0, (device.value.kwh ?? 0) + Math.random() * 0.01),
            });
          }
          break;
        case 'ac':
          if (device.value.on) {
            // Temperature drifts slightly around setpoint
            const setpoint = device.value.temperature ?? 24;
            updateDevice(device.id, {
              temperature: setpoint + (Math.random() - 0.5) * 0.4,
            });
          }
          break;
      }
    });
  }, 5000);

  // Periodic anomaly injection for demo purposes
  anomalyInterval = setInterval(() => {
    const { devices } = useDeviceStore.getState();
    const warningDevices = devices.filter(d => d.status === 'warning');

    if (warningDevices.length > 0 && Math.random() > 0.7) {
      const device = warningDevices[Math.floor(Math.random() * warningDevices.length)];
      useNotificationStore.getState().addNotification({
        type: 'maintenance',
        title: 'Device Anomaly Detected',
        message: `${device.name} has reported an unusual reading. AI predicts possible failure within ${device.predictedFailureDays ?? 7} days.`,
        userId: 'u3', // operator
        actionLabel: 'View Device',
        actionRoute: '/operator/devices',
      });
    }
  }, 45000);
}

export function stopDeviceSimulator() {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
  }
  if (anomalyInterval) {
    clearInterval(anomalyInterval);
    anomalyInterval = null;
  }
}

/** Execute a scene — apply all actions to devices */
export function executeScene(
  actions: { deviceId: string; action: Record<string, unknown> }[]
) {
  const { updateDevice } = useDeviceStore.getState();
  actions.forEach(({ deviceId, action }) => {
    updateDevice(deviceId, action as Parameters<typeof updateDevice>[1]);
  });
}

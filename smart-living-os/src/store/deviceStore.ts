import { create } from 'zustand';
import type { Device, DeviceValue } from '../types';
import { MOCK_DEVICES } from '../data/mockData';

interface DeviceStore {
  devices: Device[];
  updateDevice: (id: string, value: Partial<DeviceValue>) => void;
  setDeviceStatus: (id: string, status: Device['status']) => void;
  getDevicesByUnit: (unitId: string) => Device[];
  getDevicesByBuilding: (buildingId: string) => Device[];
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: JSON.parse(JSON.stringify(MOCK_DEVICES)), // deep clone

  updateDevice: (id, value) => {
    set(state => ({
      devices: state.devices.map(d =>
        d.id === id ? { ...d, value: { ...d.value, ...value } } : d
      ),
    }));
  },

  setDeviceStatus: (id, status) => {
    set(state => ({
      devices: state.devices.map(d =>
        d.id === id ? { ...d, status } : d
      ),
    }));
  },

  getDevicesByUnit: (unitId) => get().devices.filter(d => d.unitId === unitId),
  getDevicesByBuilding: (buildingId) => get().devices.filter(d => d.buildingId === buildingId),
}));

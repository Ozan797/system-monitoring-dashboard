import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, FormControlLabel, Switch, TextField, Button, DialogActions } from '@mui/material';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  onSave: (newSettings: DashboardSettings) => void;
}

export interface DashboardSettings {
  showCpuUsage: boolean;
  showMemoryUsage: boolean;
  showDiskActivity: boolean;
  showNetworkDownload: boolean;
  showNetworkUpload: boolean;
  refreshRate: number; // in milliseconds
}

const DashboardSettings: React.FC<SettingsProps> = ({ open, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<DashboardSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = (key: keyof DashboardSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings({ ...localSettings, [key]: event.target.checked });
  };

  const handleRefreshRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings({ ...localSettings, refreshRate: Number(event.target.value) });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Dashboard Settings</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Switch checked={localSettings.showCpuUsage} onChange={handleToggle('showCpuUsage')} />}
          label="Show CPU Usage"
        />
        <FormControlLabel
          control={<Switch checked={localSettings.showMemoryUsage} onChange={handleToggle('showMemoryUsage')} />}
          label="Show Memory Usage"
        />
        <FormControlLabel
          control={<Switch checked={localSettings.showDiskActivity} onChange={handleToggle('showDiskActivity')} />}
          label="Show Disk Activity"
        />
        <FormControlLabel
          control={<Switch checked={localSettings.showNetworkDownload} onChange={handleToggle('showNetworkDownload')} />}
          label="Show Network Download"
        />
        <FormControlLabel
          control={<Switch checked={localSettings.showNetworkUpload} onChange={handleToggle('showNetworkUpload')} />}
          label="Show Network Upload"
        />
        <TextField
          label="Refresh Rate (ms)"
          type="number"
          value={localSettings.refreshRate}
          onChange={handleRefreshRateChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DashboardSettings;

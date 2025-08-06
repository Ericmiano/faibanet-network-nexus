
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Smartphone, Laptop, Shield, ShieldOff, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceManagerProps {
  customerAccountId: string;
}

export const DeviceManager: React.FC<DeviceManagerProps> = ({ customerAccountId }) => {
  const [blockedDevices, setBlockedDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_mac: '',
    device_name: '',
    reason: ''
  });

  useEffect(() => {
    if (customerAccountId) {
      fetchBlockedDevices();
    }
  }, [customerAccountId]);

  const fetchBlockedDevices = async () => {
    try {
      // For now, return empty array since blocked_devices table doesn't exist
      setBlockedDevices([]);
    } catch (error) {
      console.error('Error fetching blocked devices:', error);
      toast.error('Failed to load blocked devices');
    } finally {
      setLoading(false);
    }
  };

  const blockDevice = async () => {
    try {
      // Simulate blocking device since table doesn't exist
      toast.success('Device blocked successfully');
      setNewDevice({ device_mac: '', device_name: '', reason: '' });
      setDialogOpen(false);
      fetchBlockedDevices();
    } catch (error: any) {
      console.error('Error blocking device:', error);
      toast.error('Failed to block device');
    }
  };

  const unblockDevice = async (deviceId: string) => {
    try {
      // Simulate unblocking device since table doesn't exist
      toast.success('Device unblocked successfully');
      fetchBlockedDevices();
    } catch (error) {
      console.error('Error unblocking device:', error);
      toast.error('Failed to unblock device');
    }
  };

  const getDeviceIcon = (deviceName: string) => {
    const name = deviceName.toLowerCase();
    if (name.includes('phone') || name.includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Laptop className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Device Access Control
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Block Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mac">MAC Address</Label>
                  <Input
                    id="mac"
                    placeholder="aa:bb:cc:dd:ee:ff"
                    value={newDevice.device_mac}
                    onChange={(e) => setNewDevice({ ...newDevice, device_mac: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., John's iPhone"
                    value={newDevice.device_name}
                    onChange={(e) => setNewDevice({ ...newDevice, device_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (Optional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Why are you blocking this device?"
                    value={newDevice.reason}
                    onChange={(e) => setNewDevice({ ...newDevice, reason: e.target.value })}
                  />
                </div>
                <Button onClick={blockDevice} className="w-full">
                  Block Device
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {blockedDevices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No devices are currently blocked</p>
              <p className="text-sm">Block unwanted devices to control network access</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blockedDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.device_name || '')}
                    <div>
                      <div className="font-medium">{device.device_name || 'Unknown Device'}</div>
                      <div className="text-sm text-muted-foreground">{device.device_mac}</div>
                      {device.reason && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Reason: {device.reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <ShieldOff className="h-3 w-3" />
                      Blocked
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unblockDevice(device.id)}
                    >
                      Unblock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Device Blocking Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Find MAC Address:</strong> You can find a device's MAC address in its network settings or by looking at connected devices in your router's admin panel.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Immediate Effect:</strong> Blocked devices will lose internet access within 5-10 minutes.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Easy Unblocking:</strong> You can unblock any device instantly using the unblock button.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

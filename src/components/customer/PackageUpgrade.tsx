import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wifi, Zap, Crown, Check, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { formatKES } from '@/lib/currency';

interface PackageUpgradeProps {
  customerAccountId: string;
  currentPackage: any;
  onPackageChange: () => void;
}

export const PackageUpgrade: React.FC<PackageUpgradeProps> = ({ 
  customerAccountId, 
  currentPackage, 
  onPackageChange 
}) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchServiceRequests();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          current_package:packages!service_requests_current_package_id_fkey(*),
          requested_package:packages!service_requests_requested_package_id_fkey(*)
        `)
        .eq('customer_account_id', customerAccountId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching service requests:', error);
    }
  };

  const requestPackageChange = async () => {
    try {
      const requestType = selectedPackage.price > (currentPackage?.packages?.price || 0) 
        ? 'package_upgrade' 
        : 'package_downgrade';

      const { error } = await supabase
        .from('service_requests')
        .insert({
          customer_account_id: customerAccountId,
          request_type: requestType,
          current_package_id: currentPackage?.package_id,
          requested_package_id: selectedPackage.id,
          reason: reason
        });

      if (error) throw error;

      toast.success('Package change request submitted successfully');
      setDialogOpen(false);
      setSelectedPackage(null);
      setReason('');
      fetchServiceRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit package change request');
    }
  };

  const getPackageIcon = (packageName: string) => {
    const name = packageName.toLowerCase();
    if (name.includes('enterprise') || name.includes('business')) {
      return <Crown className="h-5 w-5" />;
    } else if (name.includes('premium') || name.includes('pro')) {
      return <Zap className="h-5 w-5" />;
    }
    return <Wifi className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Package */}
      {currentPackage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getPackageIcon(currentPackage.packages.name)}
              Current Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div>
                <h3 className="text-lg font-semibold">{currentPackage.packages.name}</h3>
                <p className="text-muted-foreground">{currentPackage.packages.speed}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {currentPackage.packages.features?.map((feature: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatKES(currentPackage.packages.price)}
                </div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Available Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => {
              const isCurrentPackage = pkg.id === currentPackage?.package_id;
              
              return (
                <div
                  key={pkg.id}
                  className={`p-4 border rounded-lg ${
                    isCurrentPackage ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {getPackageIcon(pkg.name)}
                    <h3 className="font-semibold">{pkg.name}</h3>
                    {isCurrentPackage && (
                      <Badge className="bg-primary text-primary-foreground">
                        <Check className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-2xl font-bold">
                      {formatKES(pkg.price)}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{pkg.speed}</div>
                    
                    <div className="space-y-1">
                      {pkg.features?.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {!isCurrentPackage && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          variant={pkg.price > (currentPackage?.packages?.price || 0) ? "default" : "outline"}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          {pkg.price > (currentPackage?.packages?.price || 0) ? 'Upgrade' : 'Downgrade'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Request Package {pkg.price > (currentPackage?.packages?.price || 0) ? 'Upgrade' : 'Downgrade'}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Current Package</Label>
                              <div className="p-3 border rounded mt-1">
                                <div className="font-medium">{currentPackage?.packages?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatKES(currentPackage?.packages?.price)}/month
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">New Package</Label>
                              <div className="p-3 border rounded mt-1">
                                <div className="font-medium">{pkg.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatKES(pkg.price)}/month
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="reason">Reason (Optional)</Label>
                            <Textarea
                              id="reason"
                              placeholder="Why do you want to change your package?"
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                            />
                          </div>
                          
                          <Button onClick={requestPackageChange} className="w-full">
                            Submit Request
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Service Requests */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {request.request_type.replace('_', ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {request.current_package?.name} → {request.requested_package?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(request.status)} text-white`}>
                    {request.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

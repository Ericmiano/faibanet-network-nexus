import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Wifi } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatKES } from "@/lib/currency";

export const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [newPackage, setNewPackage] = useState({
    name: "",
    speed: "",
    price: "",
    features: ""
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          customer_packages (
            id,
            customers (id)
          )
        `);

      if (error) throw error;

      // Process packages to count customers
      const processedPackages = data?.map(pkg => ({
        ...pkg,
        customers: pkg.customer_packages?.length || 0,
        price: Number(pkg.price)
      })) || [];

      setPackages(processedPackages);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = async () => {
    try {
      const { error } = await supabase
        .from('packages')
        .insert([{
          name: newPackage.name,
          speed: newPackage.speed,
          price: parseFloat(newPackage.price),
          features: newPackage.features.split('\n').filter(f => f.trim()),
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package added successfully",
      });

      setNewPackage({ name: "", speed: "", price: "", features: "" });
      setIsAddDialogOpen(false);
      fetchPackages(); // Refresh the list
    } catch (error) {
      console.error('Error adding package:', error);
      toast({
        title: "Error",
        description: "Failed to add package",
        variant: "destructive",
      });
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package deleted successfully",
      });

      fetchPackages(); // Refresh the list
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Package Management</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Package</DialogTitle>
              <DialogDescription>
                Create a new internet package for customers.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="package-name" className="text-right">Name</Label>
                <Input
                  id="package-name"
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Premium Home"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="package-speed" className="text-right">Speed</Label>
                <Input
                  id="package-speed"
                  value={newPackage.speed}
                  onChange={(e) => setNewPackage({ ...newPackage, speed: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., 10 Mbps"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="package-price" className="text-right">Price</Label>
                <Input
                  id="package-price"
                  type="number"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                  className="col-span-3"
                  placeholder="Monthly price in USD"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="package-features" className="text-right">Features</Label>
                <Textarea
                  id="package-features"
                  value={newPackage.features}
                  onChange={(e) => setNewPackage({ ...newPackage, features: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter each feature on a new line"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPackage}>Add Package</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Package Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                <p className="text-2xl font-bold">{packages.length}</p>
              </div>
              <Wifi className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{packages.reduce((sum, pkg) => sum + pkg.customers, 0)}</p>
              </div>
              <div className="text-green-600 text-sm">Live data</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Package Price</p>
                <p className="text-2xl font-bold">
                  {packages.length > 0 ? formatKES(Math.round(packages.reduce((sum, pkg) => sum + pkg.price, 0) / packages.length)) : formatKES(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Potential</p>
                <p className="text-2xl font-bold">
                  {formatKES(packages.reduce((sum, pkg) => sum + (pkg.price * pkg.customers), 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePackage(pkg.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  {pkg.speed}
                </Badge>
                <Badge variant={pkg.status === "active" ? "default" : "secondary"}>
                  {pkg.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{formatKES(pkg.price)}</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              
              <div className="space-y-2">
                {pkg.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subscribers:</span>
                  <span className="font-medium">{pkg.customers}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Monthly Revenue:</span>
                  <span className="font-medium text-green-600">
                    {formatKES(pkg.price * pkg.customers)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">No packages found. Create your first package to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

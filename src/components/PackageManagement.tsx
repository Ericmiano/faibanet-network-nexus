
import { useState } from "react";
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

// Mock data for packages
const mockPackages = [
  {
    id: 1,
    name: "Basic Home",
    speed: "5 Mbps",
    price: 150,
    features: ["5 Mbps Download", "1 Mbps Upload", "Unlimited Data", "24/7 Support"],
    customers: 120,
    status: "active"
  },
  {
    id: 2,
    name: "Standard Home",
    speed: "10 Mbps",
    price: 250,
    features: ["10 Mbps Download", "2 Mbps Upload", "Unlimited Data", "24/7 Support", "Free Router"],
    customers: 85,
    status: "active"
  },
  {
    id: 3,
    name: "Premium Home",
    speed: "20 Mbps",
    price: 400,
    features: ["20 Mbps Download", "5 Mbps Upload", "Unlimited Data", "24/7 Support", "Free Router", "Priority Support"],
    customers: 45,
    status: "active"
  },
  {
    id: 4,
    name: "Business Elite",
    speed: "50 Mbps",
    price: 800,
    features: ["50 Mbps Download", "10 Mbps Upload", "Unlimited Data", "24/7 Support", "Free Router", "Dedicated Line", "SLA Guarantee"],
    customers: 25,
    status: "active"
  }
];

export const PackageManagement = () => {
  const [packages, setPackages] = useState(mockPackages);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const [newPackage, setNewPackage] = useState({
    name: "",
    speed: "",
    price: "",
    features: ""
  });

  const handleAddPackage = () => {
    const packageData = {
      id: packages.length + 1,
      name: newPackage.name,
      speed: newPackage.speed,
      price: parseInt(newPackage.price),
      features: newPackage.features.split('\n').filter(f => f.trim()),
      customers: 0,
      status: "active"
    };
    
    setPackages([...packages, packageData]);
    setNewPackage({ name: "", speed: "", price: "", features: "" });
    setIsAddDialogOpen(false);
  };

  const handleDeletePackage = (id: number) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

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
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
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
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold">{packages.reduce((sum, pkg) => sum + pkg.customers, 0)}</p>
              </div>
              <div className="text-green-600 text-sm">+12% this month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Package Price</p>
                <p className="text-2xl font-bold">${Math.round(packages.reduce((sum, pkg) => sum + pkg.price, 0) / packages.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Potential</p>
                <p className="text-2xl font-bold">${packages.reduce((sum, pkg) => sum + (pkg.price * pkg.customers), 0).toLocaleString()}</p>
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
                  <Button variant="ghost" size="sm" onClick={() => setEditingPackage(pkg)}>
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
                <div className="text-3xl font-bold text-blue-600">${pkg.price}</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
              
              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subscribers:</span>
                  <span className="font-medium">{pkg.customers}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Monthly Revenue:</span>
                  <span className="font-medium text-green-600">
                    ${(pkg.price * pkg.customers).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

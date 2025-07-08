
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for support tickets
const mockTickets = [
  {
    id: 1,
    customer: "John Doe",
    phone: "+254712345678",
    issue: "Internet Connection Down",
    description: "Customer reports no internet connectivity since morning. Router lights show normal status.",
    priority: "high",
    status: "open",
    assignedTo: "Tech Team A",
    createdDate: "2024-06-15",
    updatedDate: "2024-06-15"
  },
  {
    id: 2,
    customer: "Sarah Wilson",
    phone: "+254723456789",
    issue: "Slow Internet Speed",
    description: "Customer experiencing slower than expected speeds. Subscribed to 20 Mbps package but getting 5 Mbps.",
    priority: "medium",
    status: "in-progress",
    assignedTo: "Tech Team B",
    createdDate: "2024-06-14",
    updatedDate: "2024-06-15"
  },
  {
    id: 3,
    customer: "Mike Johnson",
    phone: "+254734567890",
    issue: "Payment Not Reflected",
    description: "Customer made payment via M-Pesa but account still shows unpaid status.",
    priority: "medium",
    status: "resolved",
    assignedTo: "Support Team",
    createdDate: "2024-06-13",
    updatedDate: "2024-06-14"
  },
  {
    id: 4,
    customer: "Emma Davis",
    phone: "+254745678901",
    issue: "Router Replacement",
    description: "Customer's router is malfunctioning and needs replacement. Device is over 3 years old.",
    priority: "low",
    status: "open",
    assignedTo: "Hardware Team",
    createdDate: "2024-06-12",
    updatedDate: "2024-06-12"
  }
];

export const SupportTickets = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newTicket, setNewTicket] = useState({
    customer: "",
    phone: "",
    issue: "",
    description: "",
    priority: "medium"
  });

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.phone.includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddTicket = () => {
    const ticket = {
      id: tickets.length + 1,
      ...newTicket,
      status: "open",
      assignedTo: "Unassigned",
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    };
    
    setTickets([...tickets, ticket]);
    setNewTicket({ customer: "", phone: "", issue: "", description: "", priority: "medium" });
    setIsAddDialogOpen(false);
  };

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: newStatus, updatedDate: new Date().toISOString().split('T')[0] }
        : ticket
    ));
  };

  const openTickets = tickets.filter(t => t.status === "open").length;
  const inProgressTickets = tickets.filter(t => t.status === "in-progress").length;
  const resolvedTickets = tickets.filter(t => t.status === "resolved").length;
  const highPriorityTickets = tickets.filter(t => t.priority === "high").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Log a new customer support issue.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customer" className="text-right">Customer</Label>
                <Input
                  id="customer"
                  value={newTicket.customer}
                  onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={newTicket.phone}
                  onChange={(e) => setNewTicket({ ...newTicket, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issue" className="text-right">Issue</Label>
                <Input
                  id="issue"
                  value={newTicket.issue}
                  onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
                  className="col-span-3"
                  placeholder="Brief issue title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Detailed description of the issue"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                <Select onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddTicket}>Create Ticket</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-red-600">{openTickets}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">{inProgressTickets}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityTickets}</p>
              </div>
              <div className="text-red-600 text-sm">🔥 Urgent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{ticket.issue}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      ticket.status === "open" ? "destructive" :
                      ticket.status === "in-progress" ? "default" :
                      "secondary"
                    }>
                      {ticket.status}
                    </Badge>
                    <Badge variant={
                      ticket.priority === "high" ? "destructive" :
                      ticket.priority === "medium" ? "default" :
                      "secondary"
                    }>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{ticket.customer}</p>
                <p className="text-sm text-gray-600">{ticket.phone}</p>
              </div>
              
              <p className="text-sm text-gray-700">{ticket.description}</p>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>Assigned: {ticket.assignedTo}</span>
                <span>Updated: {ticket.updatedDate}</span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Select
                  value={ticket.status}
                  onValueChange={(value) => handleStatusChange(ticket.id, value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">No tickets found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

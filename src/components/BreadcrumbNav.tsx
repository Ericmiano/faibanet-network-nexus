
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  activeTab: string;
}

export const BreadcrumbNav = ({ activeTab }: BreadcrumbNavProps) => {
  const getTabTitle = (tab: string) => {
    const titles = {
      dashboard: "Dashboard",
      customers: "Customer Management",
      packages: "Package Management", 
      payments: "Payment Tracking",
      support: "Support Tickets",
      network: "Network Monitoring",
      reports: "Financial Reports"
    };
    return titles[tab] || tab;
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Faibanet ISP</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{getTabTitle(activeTab)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

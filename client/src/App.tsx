import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SelectUserType from "./pages/SelectUserType";
import RegisterCompany from "./pages/company/RegisterCompany";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import RegisterEmployee from "./pages/employee/RegisterEmployee";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import RegisterProfessional from "./pages/professional/RegisterProfessional";
import ProfessionalsList from "./pages/professional/ProfessionalsList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/select-user-type"} component={SelectUserType} />
      
      {/* Company Routes */}
      <Route path={"/company/register"} component={RegisterCompany} />
      <Route path={"/company/dashboard"} component={CompanyDashboard} />
      
      {/* Employee Routes */}
      <Route path={"/employee/register"} component={RegisterEmployee} />
      <Route path={"/employee/dashboard"} component={EmployeeDashboard} />
      
      {/* Professional Routes */}
      <Route path={"/professional/register"} component={RegisterProfessional} />
      <Route path={"/professional/profile"} component={ProfessionalsList} />
      <Route path={"/professionals"} component={ProfessionalsList} />
      
      {/* Admin Routes */}
      <Route path={"/admin/dashboard"} component={AdminDashboard} />
      <Route path={"/admin/users"} component={UserManagement} />
      
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

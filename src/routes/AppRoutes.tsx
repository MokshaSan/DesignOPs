import { Route, Routes } from "react-router-dom";
import { RoleLayout } from "@/components/layout/RoleLayout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { VisitorPass } from "@/pages/visitor/VisitorPass";
import { VisitorRequest } from "@/pages/visitor/VisitorRequest";

import { ResidentDashboard } from "@/pages/resident/Dashboard";
import { ResidentScenes } from "@/pages/resident/Scenes";
import { ResidentAutomation } from "@/pages/resident/Automation";
import { ResidentEnergy } from "@/pages/resident/Energy";
import { ResidentAccess } from "@/pages/resident/Access";
import { ResidentVisitors } from "@/pages/resident/Visitors";
import { ResidentFacilities } from "@/pages/resident/Facilities";
import { ResidentNotifications } from "@/pages/resident/Notifications";
import { ResidentProfile } from "@/pages/resident/Profile";

import { OperatorDashboard } from "@/pages/operator/Dashboard";
import { OperatorDevices } from "@/pages/operator/Devices";
import { OperatorAlerts } from "@/pages/operator/Alerts";
import { OperatorMaintenance } from "@/pages/operator/Maintenance";
import { OperatorVisitors } from "@/pages/operator/Visitors";
import { OperatorCCTV } from "@/pages/operator/CCTV";
import { OperatorServices } from "@/pages/operator/Services";
import { OperatorFloorPlan } from "@/pages/operator/FloorPlan";

import { DeveloperDashboard } from "@/pages/developer/Dashboard";
import { DeveloperAnalytics } from "@/pages/developer/Analytics";
import { DeveloperProperties } from "@/pages/developer/Properties";
import { DeveloperConfiguration } from "@/pages/developer/Configuration";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/visitor/request" element={<VisitorRequest />} />
      <Route path="/visitor/pass/:id" element={<VisitorPass />} />

      <Route path="/resident" element={<RoleLayout role="resident" />}>
        <Route index element={<ResidentDashboard />} />
        <Route path="scenes" element={<ResidentScenes />} />
        <Route path="automation" element={<ResidentAutomation />} />
        <Route path="energy" element={<ResidentEnergy />} />
        <Route path="access" element={<ResidentAccess />} />
        <Route path="visitors" element={<ResidentVisitors />} />
        <Route path="facilities" element={<ResidentFacilities />} />
        <Route path="notifications" element={<ResidentNotifications />} />
        <Route path="profile" element={<ResidentProfile />} />
      </Route>

      <Route path="/operator" element={<RoleLayout role="operator" />}>
        <Route index element={<OperatorDashboard />} />
        <Route path="devices" element={<OperatorDevices />} />
        <Route path="alerts" element={<OperatorAlerts />} />
        <Route path="maintenance" element={<OperatorMaintenance />} />
        <Route path="visitors" element={<OperatorVisitors />} />
        <Route path="cctv" element={<OperatorCCTV />} />
        <Route path="floor-plan" element={<OperatorFloorPlan />} />
        <Route path="services" element={<OperatorServices />} />
      </Route>

      <Route path="/developer" element={<RoleLayout role="developer" />}>
        <Route index element={<DeveloperDashboard />} />
        <Route path="analytics" element={<DeveloperAnalytics />} />
        <Route path="properties" element={<DeveloperProperties />} />
        <Route path="configuration" element={<DeveloperConfiguration />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

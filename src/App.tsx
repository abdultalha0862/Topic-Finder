import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import TopicFinder from "@/pages/TopicFinder";
import AdminTopics from "@/pages/AdminTopics";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/topics/check" replace />} />
        <Route path="/topics" element={<Navigate to="/topics/check" replace />} />
        <Route path="/topics/check" element={<TopicFinder />} />
        <Route path="/admin/topics" element={<AdminTopics />} />
        <Route path="*" element={<Navigate to="/topics/check" replace />} />
      </Route>
    </Routes>
  );
}

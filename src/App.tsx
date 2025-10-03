import { Toaster } from "./component/ui/toaster";
import { Toaster as Sonner } from "./component/ui/sonner";
import { TooltipProvider } from "./component/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { FloatingButtons } from "./component/FloatingButtons";
import Home from "./pages/Home";
import UserInfoForm from "./pages/UserInfoForm";
import Chat from "./pages/Chat";
import MealPlan from "./pages/MealPlan";
import Records from "./pages/Records";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserDataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FloatingButtons />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/user-info" element={<UserInfoForm />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/meal-plan" element={<MealPlan />} />
              <Route path="/records" element={<Records />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserDataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

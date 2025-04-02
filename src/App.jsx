import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/userContext"; 
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";
import Invoices from "./components/Invoices/Invoices";
import InvoicesForm from './components/InvoicesForm/InvoicesForm';
import PaidInvoices from './components/PaidInvoices/PaidInvoices';
import UnpaidInvoices from './components/UnpaidInvoices/UnpaidInvoices';
import DraftInvoices from './components/DraftInvoices/DraftInvoices';

function App() {
  useEffect(() => {
    console.log("App component loaded");
  }, []);

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/new" element={<InvoicesForm />} />
          <Route path="/paid" element={<PaidInvoices />} />
          <Route path="/unpaid" element={<UnpaidInvoices />} />
          <Route path="/draft" element={<DraftInvoices />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation"
import Chat from "./pages/Chat"
import ChatConversation from "./pages/ChatConversation"
import History from "./pages/History"
import Index from "./pages/Index"
import Profile from "./pages/Profile"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<ChatConversation />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Navigation />
    </Router>
  )
}

export default App
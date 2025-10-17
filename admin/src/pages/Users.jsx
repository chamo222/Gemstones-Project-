import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:4000/api/user")
      .then(res => setUsers(res.data.users))
      .catch(err => toast.error("Failed to fetch users"));
  }, []);

  const toggleSelect = (email) => {
    setSelectedEmails(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const sendBulkEmail = async () => {
    if (!subject || !message) return toast.error("Enter subject and message");
    if (!selectedEmails.length) return toast.error("Select at least one user");

    try {
      const res = await axios.post("http://localhost:4000/api/user/send-offer", {
  emails: [selectedEmail], // or multiple emails
  subject: "Test Offer",
  message: "This is a test offer message",
});

      // Log results in console
      console.log(res.data.results);
      toast.success("Bulk emails processed! Check console for details.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send emails");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <input
        type="text"
        placeholder="Enter email subject..."
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <textarea
        placeholder="Enter email message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={sendBulkEmail}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
      >
        Send Bulk Email
      </button>

      <ul className="space-y-2">
        {users.map(user => (
          <li key={user._id} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="checkbox"
              checked={selectedEmails.includes(user.email)}
              onChange={() => toggleSelect(user.email)}
            />
            <span>{user.name} - {user.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
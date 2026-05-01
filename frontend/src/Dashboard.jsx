import { useEffect, useState } from "react";
import API from "./api/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert("Unauthorized");
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          {task.title} - {task.status}
        </div>
      ))}
    </div>
  );
}
import { useEffect, useState } from "react";
import API from "./api/api";
import { useAuth } from "./context/AuthContext";
import Button from "./components/Button";
import Input from "./components/Input";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Task State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', project_id: '', assigned_to: user?.id, due_date: '' });
  
  // New Project State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/users")
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", newTask);
      setShowTaskModal(false);
      setNewTask({ title: '', project_id: '', assigned_to: user?.id, due_date: '' });
      fetchData();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", newProject);
      setShowProjectModal(false);
      setNewProject({ name: '' });
      fetchData();
    } catch (err) {
      alert("Failed to create project");
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Team Task Manager
          </h1>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <p className="input-label" style={{ paddingLeft: '0.5rem', marginBottom: '1rem' }}>PROJECTS</p>
            <ul style={{ listStyle: 'none' }}>
              {projects.map(p => (
                <li key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', transition: 'var(--transition)', marginBottom: '0.25rem' }} className="btn-outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span style={{ fontWeight: '500' }}>{p.name}</span>
                </li>
              ))}
              {user?.role === 'admin' && (
                <li 
                  onClick={() => setShowProjectModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', marginTop: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600', border: '1px dashed rgba(99, 102, 241, 0.4)', background: 'rgba(99, 102, 241, 0.05)', transition: 'var(--transition)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  New Project
                </li>
              )}
            </ul>
          </div>
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name?.[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</p>
            </div>
          </div>
          <Button variant="outline" onClick={logout} style={{ width: '100%', padding: '0.5rem' }}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem' }}>Overview</h2>
            <p style={{ color: 'var(--text-muted)' }}>Manage your team's progress and tasks</p>
          </div>
          {user?.role === 'admin' && (
            <Button onClick={() => setShowTaskModal(true)}>
              + Create New Task
            </Button>
          )}
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Tasks', value: tasks.length },
            { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length },
            { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length },
            { label: 'Completed', value: tasks.filter(t => t.status === 'done').length },
            { label: 'Overdue', value: tasks.filter(t => t.status !== 'done' && new Date(t.due_date) < new Date(new Date().setHours(0,0,0,0))).length },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Task Grid */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Active Tasks</h3>
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className={`status-badge status-${task.status}`}>{task.status.replace('-', ' ')}</span>
                <span style={{ fontSize: '0.75rem', color: task.status !== 'done' && new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0)) ? '#ef4444' : 'var(--text-muted)', fontWeight: task.status !== 'done' && new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0)) ? 'bold' : 'normal' }}>Due {new Date(task.due_date).toLocaleDateString()}</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{task.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Project: <span style={{ color: 'var(--text-main)' }}>{task.project_name}</span>
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                    {task.assignee_name?.[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.8rem' }}>{task.assignee_name}</span>
                </div>
                {(user?.role === 'admin' || user?.id === task.assigned_to) ? (
                  <select 
                    value={task.status} 
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    style={{ background: 'transparent', color: 'var(--text-muted)', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                    {task.status.replace('-', ' ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <Input label="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              
              <div className="input-group">
                <label className="input-label">Project</label>
                <select className="input-field" value={newTask.project_id} onChange={e => setNewTask({...newTask, project_id: e.target.value})} required>
                  <option value="">Select a project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Assign To</label>
                <select className="input-field" value={newTask.assigned_to} onChange={e => setNewTask({...newTask, assigned_to: e.target.value})} required>
                  <option value="">Select a member</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>

              <Input label="Due Date" type="date" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} required />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Button type="button" variant="outline" onClick={() => setShowTaskModal(false)} style={{ flex: 1 }}>Cancel</Button>
                <Button type="submit" style={{ flex: 1 }}>Create Task</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>New Project</h3>
            <form onSubmit={handleCreateProject}>
              <Input label="Project Name" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <Button type="button" variant="outline" onClick={() => setShowProjectModal(false)} style={{ flex: 1 }}>Cancel</Button>
                <Button type="submit" style={{ flex: 1 }}>Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
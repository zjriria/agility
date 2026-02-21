import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams, Link } from 'react-router-dom';
import taskService from '../../services/taskService';
import authService from '../../services/authService';

const COLUMNS = {
  TODO: { id: 'TODO', title: 'To Do', className: 'bg-light' },
  IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', className: 'bg-warning bg-opacity-10' },
  DONE: { id: 'DONE', title: 'Done', className: 'bg-success bg-opacity-10' },
};

const PRIORITY_COLORS = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
  CRITICAL: 'dark',
};

function KanbanBoard() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectId || null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', type: 'USER_STORY', priority: 'MEDIUM' });
  const user = authService.getCurrentUser();

  useEffect(() => {
    taskService.getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProject) loadTasks();
  }, [selectedProject]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ projectId: selectedProject });
      const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
      data.forEach(task => {
        if (grouped[task.status]) grouped[task.status].push(task);
      });
      setTasks(grouped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const sourceCol = [...tasks[source.droppableId]];
    const destCol = [...tasks[destination.droppableId]];
    const [movedTask] = sourceCol.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    destCol.splice(destination.index, 0, movedTask);

    setTasks(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));

    try {
      await taskService.updateTask(draggableId, { ...movedTask, status: destination.droppableId });
    } catch (err) {
      console.error(err);
      loadTasks();
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask({ ...newTask, projectId: parseInt(selectedProject), status: 'TODO' });
      setShowModal(false);
      setNewTask({ title: '', description: '', type: 'USER_STORY', priority: 'MEDIUM' });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid py-3">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom mb-3 px-3">
        <span className="navbar-brand fw-bold text-primary">Agility</span>
        <div className="d-flex gap-2">
          <Link to="/timesheet" className="btn btn-outline-secondary btn-sm">Timesheet</Link>
          <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">Dashboard</Link>
          <button className="btn btn-outline-danger btn-sm" onClick={() => { authService.logout(); window.location.href = '/login'; }}>Logout</button>
        </div>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select form-select-sm"
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <h4 className="mb-0">Kanban Board</h4>
        </div>
        {selectedProject && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
            + Add Task
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row g-3">
            {Object.values(COLUMNS).map(col => (
              <div key={col.id} className="col-md-4">
                <div className={`card h-100 ${col.className}`}>
                  <div className="card-header fw-semibold d-flex justify-content-between">
                    <span>{col.title}</span>
                    <span className="badge bg-secondary">{tasks[col.id].length}</span>
                  </div>
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`card-body p-2 ${snapshot.isDraggingOver ? 'bg-light' : ''}`}
                        style={{ minHeight: '400px' }}
                      >
                        {tasks[col.id].map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`card mb-2 ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                              >
                                <div className="card-body p-2">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <p className="mb-1 fw-semibold small">{task.title}</p>
                                    <span className={`badge bg-${PRIORITY_COLORS[task.priority]} ms-1`} style={{ fontSize: '0.65rem' }}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  <span className="badge bg-info text-dark" style={{ fontSize: '0.65rem' }}>{task.type}</span>
                                  {task.estimation && (
                                    <span className="badge bg-secondary ms-1" style={{ fontSize: '0.65rem' }}>{task.estimation}h</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Task</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleCreateTask}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input className="form-control" value={newTask.title}
                      onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={newTask.description}
                      onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                  </div>
                  <div className="row">
                    <div className="col mb-3">
                      <label className="form-label">Type</label>
                      <select className="form-select" value={newTask.type}
                        onChange={e => setNewTask({ ...newTask, type: e.target.value })}>
                        {['USER_STORY', 'BUG', 'TECHNICAL_TASK', 'SUPPORT', 'MEETING', 'TRAINING'].map(t => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col mb-3">
                      <label className="form-label">Priority</label>
                      <select className="form-select" value={newTask.priority}
                        onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estimation (hours)</label>
                    <input type="number" className="form-control" value={newTask.estimation || ''}
                      onChange={e => setNewTask({ ...newTask, estimation: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;

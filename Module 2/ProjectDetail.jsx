// src/pages/ProjectDetail.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { getProject as getProjectById, createTask } from "../services/api";

const defaultBoard = {
  tasks: {},
  columns: {},
  columnOrder: [],
};

export default function ProjectDetail() {
  const location = useLocation();
  const params = useParams();
  const projectFromState = location.state?.project;
  const projectId = params.projectId;

  const [project, setProject] = useState(projectFromState || null);
  const [board, setBoard] = useState(defaultBoard);
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [user, setUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const s = localStorage.getItem("pmapp_user");
    if (s) {
      try {
        setUser(JSON.parse(s));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // ✅ Load project and tasks from backend
  useEffect(() => {
    (async () => {
      try {
        const res = await getProjectById(projectId);
        if (res.status === 200) {
          const { project, tasks } = res.data;
          setProject(project);

          // Convert DB tasks to Kanban structure
          const taskMap = {};
          const todo = [];
          const inProgress = [];
          const done = [];

          tasks.forEach((t) => {
            taskMap[t.id] = { id: t.id.toString(), content: t.title };

            if (t.status === "IN_PROGRESS") inProgress.push(t.id.toString());
            else if (t.status === "DONE") done.push(t.id.toString());
            else todo.push(t.id.toString());
          });

          setBoard({
            tasks: taskMap,
            columns: {
              "column-1": { id: "column-1", title: "To Do", taskIds: todo },
              "column-2": { id: "column-2", title: "In Progress", taskIds: inProgress },
              "column-3": { id: "column-3", title: "Done", taskIds: done },
            },
            columnOrder: ["column-1", "column-2", "column-3"],
          });

          setSelectedColumn("column-1");
        }
      } catch (err) {
        console.error("Error loading project:", err);
      }
    })();
  }, [projectId]);

  // ✅ Access control (Manager or assigned team member only)
  useEffect(() => {
    if (!project || !user) return;

    const isManager = user.role === "PROJECT_MANAGER";
    const isAssigned = (project.teamMembers || []).includes(user.email);

    if (!isManager && !isAssigned) {
      setAccessDenied(true);
    } else {
      setAccessDenied(false);
    }
  }, [project, user]);

  // ✅ Handle DnD rearrange
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, taskIds: newTaskIds };
      setBoard((prev) => ({
        ...prev,
        columns: { ...prev.columns, [newColumn.id]: newColumn },
      }));
      return;
    }

    // Move task between columns
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  // ✅ Create new task and save in backend
  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!newTaskText.trim()) return;

    try {
      const payload = {
        title: newTaskText.trim(),
        description: "",
        status: "TODO",
        assignee: null,
      };

      const res = await createTask(project.id, payload);
      if (res.status === 201 || res.status === 200) {
        const saved = res.data;
        const taskId = saved.id.toString();

        setBoard((prev) => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            [taskId]: { id: taskId, content: saved.title },
          },
          columns: {
            ...prev.columns,
            "column-1": {
              ...prev.columns["column-1"],
              taskIds: [...prev.columns["column-1"].taskIds, taskId],
            },
          },
        }));

        setNewTaskText("");
      } else {
        console.warn("Unexpected response creating task:", res);
      }
    } catch (err) {
      console.error("❌ Error saving task:", err);
      alert("Task create failed. Check backend logs.");
    }
  };

  // 🔹 Loading / Access states
  if (!project) {
    return <div className="p-8 text-gray-600">Loading project...</div>;
  }

  if (accessDenied) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Main UI
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Project header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Team:</strong>{" "}
              {(project.teamMembers || []).join(", ") || "No members"}
            </p>
          </div>
        </div>

        {/* Add task form */}
        <form
          onSubmit={handleAddTask}
          className="bg-white p-4 rounded-2xl shadow mb-6 flex gap-3 items-center"
        >
          <input
            type="text"
            placeholder="New task title..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="flex-1 border rounded-lg p-2 focus:ring focus:ring-blue-300 outline-none"
          />
          <select
            value={selectedColumn || ""}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="border rounded-lg p-2"
          >
            {board.columnOrder.map((colId) => (
              <option key={colId} value={colId}>
                {board.columns[colId].title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>

        {/* Task board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6">
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

              return (
                <div
                  key={column.id}
                  className="bg-white shadow-md rounded-2xl p-4 w-1/3"
                >
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    {column.title}
                  </h2>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px] bg-gray-100 rounded-xl p-2"
                      >
                        {tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="bg-white p-3 mb-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
                              >
                                {task.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export const filterAndSortTasks = (tasks,searchTerm:string, sortBy: string) => {
  return tasks
    .filter((task) => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "assignedDateAsc") return new Date(a.assignedDate) - new Date(b.assignedDate);
      if (sortBy === "assignedDateDesc") return new Date(b.assignedDate) - new Date(a.assignedDate);
      if (sortBy === "dueDateAsc") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "dueDateDesc") return new Date(b.dueDate) - new Date(a.dueDate);
      return 0;
    });
};

export function countDueSoon(tasks, days = 7) {
  const today = new Date();

  return tasks.filter((task) => {
    const due = new Date(task.dueDate); 
    const diffTime = due.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= days;
  }).length;
}

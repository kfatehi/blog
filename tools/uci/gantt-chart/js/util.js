Util = {}

/**
 * @param string name name of the class
 * @param date from class start date
 * @param date to class end date
 * @param array events assignments, quizzes, etc
 *
 * Two types of tasks. Assignment:
 * { name: "name of assignment", from: date, to: date }
 *
 * Milestone:
 * { name: "name of assignment", on: date }
 */
Util.classGantt = function(name, from, to, tasks) {
  var id = Math.random().toString(24).substring(2);
  var rows = [];
  rows.push({ id: id, name: name, from: new Date(from), to: new Date(to) })
  _.each(tasks, function(task) {
    if (task.on) {
      // milestones
      rows.push({ parent: id, name: task.name, tasks: [{ color: 'magenta', from: new Date(task.on), to: new Date(task.on) }] })
    } else {
      // assignments
      rows.push({ parent: id, name: task.name, tasks: [{ color: 'green', from: new Date(task.from), to: new Date(task.to) }] })
    }
  })
  return rows;
}


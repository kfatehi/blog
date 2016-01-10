var data = [];

data = data.concat(
  Util.classGantt('INF 151: Project Management', '01/04/2016', '03/18/2016', [
    { name: 'Setup File Structure',                         from: "01/04/2016", to: "01/06/2016" },
    { name: 'Quiz 1',                                       on: "01/06/2016" },
    { name: 'Communication Covenant',                       from: "01/06/2016", to: "01/11/2016" },
    { name: 'Gantt Chart of the Quarter',                   from: "01/06/2016", to: "01/11/2016" },
    { name: 'Group Photo',                                  from: "01/06/2016", to: "01/13/2016" },
    { name: 'Quiz 2',                                       on: "01/13/2016" },
    { name: 'Project Description',                          from: "01/06/2016", to: "01/18/2016" },
    { name: 'Business Case',                                from: "01/13/2016", to: "01/20/2016" },
    { name: 'Quiz 3',                                       on: "01/20/2016" },
    { name: 'Scope Statement and Work Breakdown',           from: "01/20/2016", to: "01/25/2016" },
    { name: 'Quiz 4',                                       on: "01/25/2016" },
    { name: 'Gantt Chart for Project',                      from: "01/25/2016", to: "02/01/2016" },
    { name: 'Quiz 5',                                       on: "02/01/2016" },
    { name: 'Midterm',                                      from: "02/08/2016", to: "02/08/2016" },
    { name: 'Quiz 6',                                       on: "02/10/2016" },
    { name: 'Quiz 7',                                       on: "02/17/2016" },
    { name: 'Quiz 8',                                       on: "02/22/2016" },
    { name: 'Cost, Quality, and Risk Management',           from: "02/17/2016", to: "02/22/2016" },
    { name: 'Quiz 9',                                       on: "02/29/2016" },
    { name: 'Quiz 10',                                      on: "03/02/2016" },
    { name: 'Lessons Learned',                              from: "01/06/2016", to: "03/09/2016" },
    { name: 'Final',                                        on: "03/18/2016" }
  ])
)

data = data.concat(
  Util.classGantt('INF 131: Human Computer Interaction', '01/04/2016', '03/18/2016', [
    { name: 'Deliverable 1',                         from: "01/11/2016", to: "01/29/2016" },
    { name: 'Deliverable 2',                         from: "01/27/2016", to: "02/12/2016" },
    { name: 'Deliverable 3',                         from: "02/10/2016", to: "03/04/2016" },
    { name: 'Final',                                        on: "03/16/2016" }
  ])
)

data = data.concat(
  Util.classGantt('INF 141: Information Retreival', '01/04/2016', '03/18/2016', [
    { name: 'Text processing functions',                         from: "01/11/2016", to: "01/20/2016" },
    { name: 'Crawler',                         from: "01/14/2016", to: "02/12/2016" },
    { name: "Quiz", on: "02/02/2016" },
    { name: 'Search Engine',                         from: "01/26/2016", to: "02/22/2016" },
    { name: "Quiz", on: "03/08/2016" },
    { name: 'Final',                                        on: "03/15/2016" }
  ])
)

data = data.concat(
  Util.classGantt('INF 113: Requirements Engineering & Analysis', '01/04/2016', '03/18/2016', [
    { name: "HW1", from: "01/12/2016", to: "01/15/2016" },
    { name: "HW2", from: "01/14/2016", to: "01/25/2016" },
    { name: "HW3", from: "01/28/2016", to: "02/05/2016" },
    { name: 'Midterm',                                        on: "02/09/2016" },
    { name: "HW4", from: "02/09/2016", to: "02/11/2016" },
    { name: "HW5", from: "02/11/2016", to: "02/16/2016" },
    { name: "HW6", from: "02/16/2016", to: "02/20/2016" },
    { name: "HW7", from: "02/16/2016", to: "02/27/2016" },
    { name: 'Final',                                        on: "03/17/2016" }
  ])
)

angular.module("app", [
  'gantt',
  'gantt.tooltips',
  'gantt.bounds',
  'gantt.progress',
  'gantt.table',
  'gantt.tree',
  'gantt.groups',
  'gantt.resizeSensor'
])

.controller("MainCtrl", function($scope) {
  $scope.options = {
    headersFormats: {
      'year': 'YYYY', 
      'quarter': '[Q]Q YYYY', 
      month: 'MMMM YYYY', 
      week: 'w', 
      day: 'D', 
      hour: 'h', 
      minute:'HH:mm'
    }
  }
  $scope.data = window.data
})

function iCalToGantt(rawData) {
  var data = ICAL.parse(rawData)
  var vevents = _.filter(data[2], i=>i[0] === 'vevent');
  vevents = _.map(vevents, i=>i[1]);
  return _.reduce(vevents, (acc, vevent) => {
    var name = vevent.find( i => i[0] === "summary" )[3];
    var from = moment(vevent.find( i => i[0] === "dtstart" )[3]);
    var to = moment(vevent.find( i => i[0] === "dtend" )[3]);
    var location = vevent.find( i => i[0] === "location" )[3];
    var recur = vevent.find( i => i[0] === "rrule" );
    var tasks = Task.buildAll(name+" @ "+location, from, to, recur ? recur[3] : null);
    acc.push({ name: name, tasks: tasks })
    return acc;
  }, [])
}

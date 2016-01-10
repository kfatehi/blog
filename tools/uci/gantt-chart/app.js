window.data = [
  { id: 'PM',     name: 'INF 151',                                                from: new Date("01/04/2016"), to: new Date("03/18/2016") },
  { parent: 'PM', name: 'Setup File Structure',                         tasks: [{ from: new Date("01/04/2016"), to: new Date("01/06/2016") }] },
  { parent: 'PM', name: 'Quiz 1',                                       tasks: [{ from: new Date("01/06/2016"), to: new Date("01/06/2016") }] },
  { parent: 'PM', name: 'Communication Covenant',                       tasks: [{ from: new Date("01/06/2016"), to: new Date("01/11/2016") }] },
  { parent: 'PM', name: 'Gantt Chart of the Quarter',                   tasks: [{ from: new Date("01/06/2016"), to: new Date("01/11/2016") }] },
  { parent: 'PM', name: 'Group Photo',                                  tasks: [{ from: new Date("01/06/2016"), to: new Date("01/13/2016") }] },
  { parent: 'PM', name: 'Quiz 2',                                       tasks: [{ from: new Date("01/13/2016"), to: new Date("01/13/2016") }] },
  { parent: 'PM', name: 'Project Description',                          tasks: [{ from: new Date("01/06/2016"), to: new Date("01/18/2016") }] },
  { parent: 'PM', name: 'Business Case',                                tasks: [{ from: new Date("01/13/2016"), to: new Date("01/20/2016") }] },
  { parent: 'PM', name: 'Quiz 3',                                       tasks: [{ from: new Date("01/20/2016"), to: new Date("01/20/2016") }] },
  { parent: 'PM', name: 'Scope Statement and Work Breakdown Structure', tasks: [{ from: new Date("01/20/2016"), to: new Date("01/25/2016") }] },
  { parent: 'PM', name: 'Quiz 4',                                       tasks: [{ from: new Date("01/25/2016"), to: new Date("01/25/2016") }] },
  { parent: 'PM', name: 'Gantt Chart for Project',                      tasks: [{ from: new Date("01/25/2016"), to: new Date("02/01/2016") }] },
  { parent: 'PM', name: 'Quiz 5',                                       tasks: [{ from: new Date("02/01/2016"), to: new Date("02/01/2016") }] },
  { parent: 'PM', name: 'Midterm',                                      tasks: [{ from: new Date("02/08/2016"), to: new Date("02/08/2016") }] },
  { parent: 'PM', name: 'Quiz 6',                                       tasks: [{ from: new Date("02/10/2016"), to: new Date("02/10/2016") }] },
  { parent: 'PM', name: 'Quiz 7',                                       tasks: [{ from: new Date("02/17/2016"), to: new Date("02/17/2016") }] },
  { parent: 'PM', name: 'Quiz 8',                                       tasks: [{ from: new Date("02/22/2016"), to: new Date("02/22/2016") }] },
  { parent: 'PM', name: 'Cost, Quality, and Risk Management',           tasks: [{ from: new Date("02/17/2016"), to: new Date("02/22/2016") }] },
  { parent: 'PM', name: 'Quiz 9',                                       tasks: [{ from: new Date("02/29/2016"), to: new Date("02/29/2016") }] },
  { parent: 'PM', name: 'Quiz 10',                                      tasks: [{ from: new Date("03/02/2016"), to: new Date("03/02/2016") }] },
  { parent: 'PM', name: 'Lessons Learned',                              tasks: [{ from: new Date("01/06/2016"), to: new Date("03/09/2016") }] },
  { parent: 'PM', name: 'Final',                                        tasks: [{ from: new Date("03/18/2016"), to: new Date("03/18/2016") }] },
]

/*
  },{
    name: "Communication Covenant",
 * */

/*window.data = [
    // Order is optional. If not specified it will be assigned automatically
    {
        name: 'Milestones',
        height: '3em',
        sortable: false,
        classes: 'gantt-row-milestone',
        color: '#45607D',
        tasks: [
            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
            {
                name: 'Kickoff',
                color: '#93C47D',
                from: '2013-10-07T09:00:00',
                to: '2013-10-07T10:00:00',
                data: 'Can contain any custom data or object'
            }, {
                name: 'Concept approval',
                color: '#93C47D',
                from: new Date(2013, 9, 18, 18, 0, 0),
                to: new Date(2013, 9, 18, 18, 0, 0),
                est: new Date(2013, 9, 16, 7, 0, 0),
                lct: new Date(2013, 9, 19, 0, 0, 0)
            }, {
                name: 'Development finished',
                color: '#93C47D',
                from: new Date(2013, 10, 15, 18, 0, 0),
                to: new Date(2013, 10, 15, 18, 0, 0)
            }, {
                name: 'Shop is running',
                color: '#93C47D',
                from: new Date(2013, 10, 22, 12, 0, 0),
                to: new Date(2013, 10, 22, 12, 0, 0)
            }, {
                name: 'Go-live',
                color: '#93C47D',
                from: new Date(2013, 10, 29, 16, 0, 0),
                to: new Date(2013, 10, 29, 16, 0, 0)
            }
        ],
        data: 'Can contain any custom data or object'
    }, {
        name: 'Status meetings',
        tasks: [{
            name: 'Demo #1',
            color: '#9FC5F8',
            from: new Date(2013, 9, 25, 15, 0, 0),
            to: new Date(2013, 9, 25, 18, 30, 0)
        }, {
            name: 'Demo #2',
            color: '#9FC5F8',
            from: new Date(2013, 10, 1, 15, 0, 0),
            to: new Date(2013, 10, 1, 18, 0, 0)
        }, {
            name: 'Demo #3',
            color: '#9FC5F8',
            from: new Date(2013, 10, 8, 15, 0, 0),
            to: new Date(2013, 10, 8, 18, 0, 0)
        }, {
            name: 'Demo #4',
            color: '#9FC5F8',
            from: new Date(2013, 10, 15, 15, 0, 0),
            to: new Date(2013, 10, 15, 18, 0, 0)
        }, {
            name: 'Demo #5',
            color: '#9FC5F8',
            from: new Date(2013, 10, 24, 9, 0, 0),
            to: new Date(2013, 10, 24, 10, 0, 0)
        }]
    }, {
        name: 'Kickoff',
        movable: {
            allowResizing: false
        },
        tasks: [{
            name: 'Day 1',
            color: '#9FC5F8',
            from: new Date(2013, 9, 7, 9, 0, 0),
            to: new Date(2013, 9, 7, 17, 0, 0),
            progress: {
                percent: 100,
                color: '#3C8CF8'
            },
            movable: false
        }, {
            name: 'Day 2',
            color: '#9FC5F8',
            from: new Date(2013, 9, 8, 9, 0, 0),
            to: new Date(2013, 9, 8, 17, 0, 0),
            progress: {
                percent: 100,
                color: '#3C8CF8'
            }
        }, {
            name: 'Day 3',
            color: '#9FC5F8',
            from: new Date(2013, 9, 9, 8, 30, 0),
            to: new Date(2013, 9, 9, 12, 0, 0),
            progress: {
                percent: 100,
                color: '#3C8CF8'
            }
        }]
    }, {
        name: 'Create concept',
        tasks: [{
            name: 'Create concept',
            priority: 20,
            content: '<i class="fa fa-cog" ng-click="scope.handleTaskIconClick(task.model)"></i> {{task.model.name}}',
            color: '#F1C232',
            from: new Date(2013, 9, 10, 8, 0, 0),
            to: new Date(2013, 9, 16, 18, 0, 0),
            est: new Date(2013, 9, 8, 8, 0, 0),
            lct: new Date(2013, 9, 18, 20, 0, 0),
            progress: 100
        }]
    }, {
        name: 'Finalize concept',
        tasks: [{
            id: 'Finalize concept',
            name: 'Finalize concept',
            priority: 10,
            color: '#F1C232',
            from: new Date(2013, 9, 17, 8, 0, 0),
            to: new Date(2013, 9, 18, 18, 0, 0),
            progress: 100
        }]
    }, {
        name: 'Development',
        children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
        content: '<i class="fa fa-file-code-o" ng-click="scope.handleRowIconClick(row.model)"></i> {{row.model.name}}'
    }, {
        name: 'Sprint 1',
        tooltips: false,
        tasks: [{
            id: 'Product list view',
            name: 'Product list view',
            color: '#F1C232',
            from: new Date(2013, 9, 21, 8, 0, 0),
            to: new Date(2013, 9, 25, 15, 0, 0),
            progress: 25,
            dependencies: [{
                to: 'Order basket'
            }, {
                from: 'Finalize concept'
            }]
        }]
    }, {
        name: 'Sprint 2',
        tasks: [{
            id: 'Order basket',
            name: 'Order basket',
            color: '#F1C232',
            from: new Date(2013, 9, 28, 8, 0, 0),
            to: new Date(2013, 10, 1, 15, 0, 0),
            dependencies: {
                to: 'Checkout'
            }
        }]
    }, {
        name: 'Sprint 3',
        tasks: [{
            id: 'Checkout',
            name: 'Checkout',
            color: '#F1C232',
            from: new Date(2013, 10, 4, 8, 0, 0),
            to: new Date(2013, 10, 8, 15, 0, 0),
            dependencies: {
                to: 'Login & Signup & Admin Views'
            }
        }]
    }, {
        name: 'Sprint 4',
        tasks: [{
            id: 'Login & Signup & Admin Views',
            name: 'Login & Signup & Admin Views',
            color: '#F1C232',
            from: new Date(2013, 10, 11, 8, 0, 0),
            to: new Date(2013, 10, 15, 15, 0, 0),
            dependencies: [{
                to: 'HW'
            }, {
                to: 'SW / DNS/ Backups'
            }]
        }]
    }, {
        name: 'Hosting'
    }, {
        name: 'Setup',
        tasks: [{
            id: 'HW',
            name: 'HW',
            color: '#F1C232',
            from: new Date(2013, 10, 18, 8, 0, 0),
            to: new Date(2013, 10, 18, 12, 0, 0)
        }]
    }, {
        name: 'Config',
        tasks: [{
            id: 'SW / DNS/ Backups',
            name: 'SW / DNS/ Backups',
            color: '#F1C232',
            from: new Date(2013, 10, 18, 12, 0, 0),
            to: new Date(2013, 10, 21, 18, 0, 0)
        }]
    }, {
        name: 'Server',
        parent: 'Hosting',
        children: ['Setup', 'Config']
    }, {
        name: 'Deployment',
        parent: 'Hosting',
        tasks: [{
            name: 'Depl. & Final testing',
            color: '#F1C232',
            from: new Date(2013, 10, 21, 8, 0, 0),
            to: new Date(2013, 10, 22, 12, 0, 0),
            'classes': 'gantt-task-deployment'
        }]
    }, {
        name: 'Workshop',
        tasks: [{
            name: 'On-side education',
            color: '#F1C232',
            from: new Date(2013, 10, 24, 9, 0, 0),
            to: new Date(2013, 10, 25, 15, 0, 0)
        }]
    }, {
        name: 'Content',
        tasks: [{
            name: 'Supervise content creation',
            color: '#F1C232',
            from: new Date(2013, 10, 26, 9, 0, 0),
            to: new Date(2013, 10, 29, 16, 0, 0)
        }]
    }, {
        name: 'Documentation',
        tasks: [{
            name: 'Technical/User documentation',
            color: '#F1C232',
            from: new Date(2013, 10, 26, 8, 0, 0),
            to: new Date(2013, 10, 28, 18, 0, 0)
        }]
    }
];
*/


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
  //$.get('calendar.ics', function(data){
  //  $scope.$apply(function() {
  //    $scope.data = window.data
  //  })
  //})
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

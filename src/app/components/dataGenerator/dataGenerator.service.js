(function() {
  'use strict';

  angular
    .module('cimMockup')
    .factory('dataGenerator', dataGenerator);

  /** @ngInject */
  function dataGenerator($q, $interval, $timeout) {

    var packages, robots, shelves;

    var service = {
      getPackages: function(){ return packages; },
      getRobots: function(){ return robots; },
      getShelves: function(){ return shelves; },
      // demo
      toggleRobotBrokenStatus: toggleRobotBrokenStatus,
      createPackage: simulatePackageArrives,
      retrievePackage: simulatePackageLeaves
    };

    var lastPackageId;

    init();
    generatePackages();
    generateShelves();
    assignPackages();

    return service;


    function init() {
      packages = [];

      robots = [
        {id: 0, pos: 0, avg: '7m', broken: false, idle: true, retrieving: false, storing: false, package: null},
        {id: 1, pos: 0, avg: '5m', broken: false, idle: true, retrieving: false, storing: false, package: null}
      ];

      shelves = [
        {id: 0, colsCount: [], rows: []},
        {id: 1, colsCount: [], rows: []},
        {id: 2, colsCount: [], rows: []}
      ];
    }
    function generatePackages() {
      var sixMonthsAgo = moment().subtract(6, 'months');
      var sixMonthsAgoSubSevenDays = sixMonthsAgo.subtract(7, 'days').toDate();
      var sixMonthsAgoPlusSevenDays = sixMonthsAgo.add(7, 'days').toDate();
      for (var i = 0; i < 50; i++) {
        var _package = {};

        _package.id = i;
        _package.ingress = randomDate(sixMonthsAgoSubSevenDays, sixMonthsAgoPlusSevenDays);
        _package.egress = moment(_package.ingress).add(6, 'months').toDate();
        _package.location = {};

        packages.push(_package);
      }
      lastPackageId = i;
    }
    function generateShelves() {

      var MAX_ROWS = 5;
      var MAX_COLS = 6;

      for (var i = 0; i < shelves.length; i++) {
        for (var j = 0; j < MAX_ROWS; j++) {
          var row = {};
          row.id = j;
          row.cells = [];
          for (var k = 0; k < MAX_COLS; k++) {
            var cell = {};
            cell.id = k;
            cell.package = null;
            row.cells.push(cell);
            if (j === 0) shelves[i].colsCount.push(0);
          }
          shelves[i].rows.push(row);
        }
      }
    }

    function assignPackages() {
      for (var i = 0; i < packages.length; i++) {
        var shelf = getShelfWithRoom(shelves);
        var row = getShelfRowfWithRoom(shelf.rows);
        var cell = getShelfCellWithRoom(row.cells);

        cell.package = packages[i];
        packages[i].location = {
          shelf: shelf,
          row: row,
          cell: cell
        };
        shelf.colsCount[cell.id]++;
      }
    }

    // Utils
    function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    function randomFromList(list) {
      return list[ Math.floor(Math.random() * list.length) ];
    }

    function getShelfWithRoom(shelves) {
      var shelvesWithRoom = shelves.filter(shelfHasRoom);
      return randomFromList(shelvesWithRoom);
    }

    function getShelfRowfWithRoom(rows) {
      var shelfRowsWithRoom = rows.filter(shelfRowHasRoom);
      return randomFromList(shelfRowsWithRoom);
    }

    function getShelfCellWithRoom(cells) {
      var shelfCellsWithRoom = cells.filter(shelfCellHasRoom);
      return randomFromList(shelfCellsWithRoom);
    }

    function negate(predicate) {
      return function () {
        return !predicate.apply({}, arguments);
      };
    }

    function shelfHasRoom(shelf) {
      return shelf.rows.some(shelfRowHasRoom);
    }

    function shelfRowHasRoom(row) {
      return row.cells.some(shelfCellHasRoom);
    }

    function shelfCellHasRoom(cell) {
      return cell.package === null;
    }

    function getAvailableRobot() {
      var availableRobots= robots.filter(robotIsAvailable);
      return randomFromList(availableRobots);
    }

    function robotIsAvailable(robot) {
      return !robot.broken && robot.idle;
    }

    // Demo
    function toggleRobotBrokenStatus(robot) {
      robot.broken = !robot.broken;
    }

    function createPackage() {
      var _package = {};

      _package.id = lastPackageId++;
      _package.ingress = new Date();
      _package.egress = moment(_package.ingress).add(6, 'months').toDate();
      _package.location = {};

      packages.push(_package);
      return _package;
    }

    function assignPackage() {
      var shelf = getShelfWithRoom(shelves);
      var row = getShelfRowfWithRoom(shelf.rows);
      var cell = getShelfCellWithRoom(row.cells);

      return {
        shelf: shelf,
        row: row,
        cell: cell
      }
    }

    function assignRobot(location) {
      if (location.shelf.id === 0) {
        return robots[0];
      } else if (location.shelf.id === 2) {
        return robots[1];
      } else {
        return randomFromList(robots);
      }
    }

    function robotSetStoringStatus(robot) {
      robot.idle = false;
      robot.storing = true;
      robot.retrieving = false;
      return robot;
    }

    function robotSetRetrievingStatus(robot) {
      robot.idle = false;
      robot.storing = false;
      robot.retrieving = true;
      return robot;
    }

    function robotSetIdleStatus(robot) {
      robot.idle = true;
      robot.storing = false;
      robot.retrieving = false;
      return robot;
    }

    function robotGoToConveyor(task) {
      var robotSpeed = 0.1,
        intervalSpeed = 50;

      var robot = task.robot;

      var interval = $interval( function () {
        if (robot.pos > 0) {
          robot.pos -= robotSpeed * intervalSpeed;
        }

        if (robot.pos < 1) {
          robot.pos = 0;
          $interval.cancel(interval);
        }

      }, intervalSpeed);

      return $timeout( function () {
        return task;
      }, robot.pos / robotSpeed);
    }

    function robotPickupPackage(task) {
      var robotPickupSpeed = 3000;

      var robot = task.robot;

      return $timeout( function () {
        robot.package = task._package;
        if (task._package.location && task._package.location.cell) {
          task._package.location.cell.package = null;
          task._package.location.shelf.colsCount[task._package.location.cell.id]--;
          task._package.location = {};
        }
        return task;
      }, robotPickupSpeed);
    }

    function robotGoToLocation(task) {
      var robotSpeed = 0.1,
        intervalSpeed = 50;

      var robot = task.robot;
      var shelfCol = document.getElementsByClassName('shelf-col')[0] || {};
      var endPos = task.location.cell.id * (shelfCol.offsetWidth || 110);  // gg

      var interval = $interval( function () {
        if (robot.pos <= endPos) {
          robot.pos += robotSpeed * intervalSpeed;
        }

        if (robot.pos > endPos) {
          robot.pos = endPos;
          $interval.cancel(interval);
        }

      }, intervalSpeed);

      return $timeout( function () {
        return task;
      }, (endPos - robot.pos) / robotSpeed);
    }

    function robotStorePackageOnLocation(task) {
      var robotStoreSpeed = 3000;

      var robot = task.robot;
      var _package = task._package;
      var shelf = task.location.shelf;
      var row = task.location.row;
      var cell = task.location.cell;

      return $timeout( function () {
        robot.package = null;
        cell.package = _package;
        _package.location = task.location;
        ++shelf.colsCount[cell.id];
        return task;
      }, robotStoreSpeed);
    }

    function robotLeavePackageOnConveyor(task) {
      var robotStoreSpeed = 3000;

      var robot = task.robot;
      var _package = task._package;
      var shelf = task.location.shelf;
      var row = task.location.row;
      var cell = task.location.cell;

      return $timeout( function () {
        robot.package = null;
        packages.splice(packages.indexOf(_package), 1);
        return task;
      }, robotStoreSpeed);
    }



    function robotFinishTask(task) {
      return $timeout( function () {
        robotSetIdleStatus(task.robot);
      })
    }


    function simulatePackageArrives() {
      var _package = createPackage();
      var location = assignPackage(_package);
      var robot = assignRobot(location);

      robotSetStoringStatus(robot);

      var task = {
        _package: _package,
        location: location,
        robot: robot
      };

      robotGoToConveyor(task)
        .then(robotPickupPackage)
        .then(robotGoToLocation)
        .then(robotStorePackageOnLocation)
        .then(robotGoToConveyor)
        .then(robotFinishTask);
    }

    function simulatePackageLeaves(_package) {
      var location = _package.location;
      var robot = assignRobot(location);

      robotSetRetrievingStatus(robot);

      var task = {
        _package: _package,
        location: location,
        robot: robot
      };

      robotGoToLocation(task)
        .then(robotPickupPackage)
        .then(robotGoToConveyor)
        .then(robotLeavePackageOnConveyor)
        .then(robotFinishTask);
    }
  }
})();

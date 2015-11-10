(function() {
  'use strict';

  angular
    .module('cimMockup')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    vm.packages = [];
    vm.robots = [
      {id: 0, pos: 0, idle: true},
      {id: 1, pos: 90, idle: false}
    ];
    vm.shelves = [
      {id: 0, colsCount: [], rows: []},
      {id: 1, colsCount: [], rows: []},
      {id: 2, colsCount: [], rows: []}
    ];

    activate();

    function activate() {
      generatePackages();
      generateShelves();
      assignPackages();
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

        vm.packages.push(_package);
      }
    }
    function generateShelves() {

      var MAX_ROWS = 5;
      var MAX_COLS = 6;

      for (var i = 0; i < vm.shelves.length; i++) {
        for (var j = 0; j < MAX_ROWS; j++) {
          var row = {};
          row.id = j;
          row.cells = [];
          for (var k = 0; k < MAX_COLS; k++) {
            var cell = {};
            cell.id = k;
            cell.package = null;
            row.cells.push(cell);
            if (j === 0) vm.shelves[i].colsCount.push(0);
          }
          vm.shelves[i].rows.push(row);
        }
      }
    }

    function assignPackages() {
      for (var i = 0; i < vm.packages.length; i++) {
        var shelf = getShelfWithRoom(vm.shelves);
        var row = getShelfRowfWithRoom(shelf.rows);
        var cell = getShelfCellWithRoom(row.cells);

        cell.package = vm.packages[i];
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
      return typeof cell.package !== 'null';
    }
  }
})();

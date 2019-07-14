scheduleApp.controller("datePickerCtrl", function($scope, $log) {

    
    $scope.today = function() {
        $scope.startDate = new Date();
    };
    $scope.today();
    
    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: false
    };

    $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        // if to start on Sunday on on monday
        startingDay: 0
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        //return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        return mode === 'day' && date.getDay() === 6;
    }

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open = function() {
        $scope.popup.opened = true;
    };

    

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    //$scope.format = $scope.formats[0];
    $scope.format = 'dd-MMMM-yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup = {
        opened: false
    };


    function getDayClass(data) {
    var date = data.date,
        mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
    /************ Generic logic for time picker - to move to generic script */
    // logic to insure that hours retrieved from date will be set on valid formet
    $scope.addZero = function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    // test fuction for setting the hours and minutes from date
    $scope.getTimeFromDate  = function(dateObj) {
        
        var time = "";
        var h = $scope.addZero(dateObj.getHours());
        var m = $scope.addZero(dateObj.getMinutes());
        time = h + ":" + m;
        return time;
    }

    $scope.setTimeFromStr = function(timeStr){
        var date = new Date();
        var timeArr = timeStr.split(":");
        date.setHours(timeArr[0]);
        date.setMinutes(timeArr[1]);
        return date;
    }

})
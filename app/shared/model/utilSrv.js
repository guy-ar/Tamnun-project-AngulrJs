
scheduleApp.factory("utilSrv", function() {

   function formatDate(date){
        return moment(date).format('DD-MM-YYYY')
    }

    return {
        formatDate: formatDate
    }
});
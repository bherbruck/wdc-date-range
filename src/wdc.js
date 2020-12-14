getDateRange = function (start, end) {
    for (
        var dates = [], date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
    ) {
        dates.push(new Date(date));
    }
    return dates;
};

(function () {
    var dateConnector = tableau.makeConnector();

    dateConnector.getSchema = (schemaCallback) => {
        let cols = [
            {
                id: 'Date',
                dataType: tableau.dataTypeEnum.date,
            },
            {
                id: 'Timestamp',
                dataType: tableau.dataTypeEnum.int,
            },
        ];

        let tableSchema = {
            id: 'Dates',
            alias: 'Dates',
            columns: cols,
        };
        schemaCallback([tableSchema]);
    };

    dateConnector.getData = (table, doneCallback) => {
        let connectionData = JSON.parse(tableau.connectionData);
        let startDate = new Date(connectionData.startDate);
        let endDate = new Date(connectionData.endDate);

        dates = getDateRange(startDate, endDate);
        rows = dates.map((date) => {
            return {
                Date: date,
                Timestamp: date.valueOf(),
            };
        });

        table.appendRows(rows);
        doneCallback();
    };

    setupConnector = function () {
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();

        if (startDate && endDate) {
            let connectionData = {
                startDate: startDate,
                endDate: endDate,
            };
            tableau.connectionData = JSON.stringify(connectionData);
            tableau.submit();
        }
    };

    tableau.registerConnector(dateConnector);

    $(document).ready(() => {
        $('#submitButton').click(function () {
            tableau.connectionName = 'DateRange';
            setupConnector();
        });
    });
})();

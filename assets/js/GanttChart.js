
export default class GanttChartClass {

    dates = [];
    dateRange = [];
    batchSize = 20;
    currentBatch = 10;
    count = 0;
    sortDataList = [];


    constructor(wrapper, date) {

        this.ganttChart = document.querySelector(`${wrapper}`);
        this.dataList = date;

        this.createTable(this.dataList)
    };
    
    sortTable(quantity) {
        this.ganttChart.innerHTML = "";
        this.count = 0;

        this.sortDataList = this.dataList.slice(0, quantity);
        console.log(this.sortDataList);
        this.createTable(this.sortDataList);
            
    }

    createTable(data) {
        this.dates = [];
        this.dateRange = [];
        
        const fragment = document.createDocumentFragment();

        const wrapperElement = this.createElement('div','gantt-chart__wrapper');
        const tableElement = this.createElement('table',"table");
        tableElement.classList.add('table-bordered','gantt-chart__table','styled-scrollbars')

        const theadElement = this.createTableHeader(data);
        const tbodyElement = this.createTableBody(data);

        tableElement.appendChild(theadElement);
        tableElement.appendChild(tbodyElement);

        wrapperElement.appendChild(tableElement);
        fragment.appendChild(wrapperElement);
        
        this.ganttChart.appendChild(fragment);
    };

    createTableHeader(data) {
        const theadElement = this.createElement('thead','gantt-chart__head');
        const trElement  = this.createElement('tr','gantt-chart__header');
        const thElement1 = this.createElement('th',`text-center,d-flex,mt-4`,'№');
        const thElement2 = this.createElement('th','text-center','Наименование заказа');

        data.forEach(item => this.dates.push(new Date(item.schedule)));

        const startDate = this.checkStartDate(this.dates);
        const endDate = this.checkEndDate(this.dates);

        this.dateRange = [];
        let currentDate = startDate;

        trElement.appendChild(thElement1);
        trElement.appendChild(thElement2);

        while (currentDate <= endDate) {
            this.dateRange.push(currentDate.format());
            currentDate.add(1, 'day');
        };

        this.dateRange.forEach(time => {
            const thElement3 = this.createColTh(moment(time).format('DD MMM YYYY'));
            trElement.appendChild(thElement3);
        });

        theadElement.appendChild(trElement);

        return theadElement;
    };

    createTableBody(data) {
        let endIndex = Math.min(this.currentBatch + this.batchSize, data.length);
        let batch = data.slice(0, endIndex);
        const tbodyElement = this.createElement('tbody','gantt-chart__wrapper-items');
        batch.forEach((item) => tbodyElement.appendChild(this.createColTd(item, this.count++)));
        
        return tbodyElement

    };

    renderCols(selector, dataList) {
        const tbody = this.ganttChart.querySelector(`${selector}`);
        dataList.forEach((item) => tbody.appendChild(this.createColTd(item, this.count++)));
    }

    addElementsTbody() {
        let data = !this.sortDataList.length ? this.dataList : this.sortDataList;
        let endIndex = Math.min(this.currentBatch + this.batchSize, data.length);
        let batch = data.slice(this.currentBatch, endIndex);
        
        this.renderCols('.gantt-chart__wrapper-items', batch);
    
        this.currentBatch += this.batchSize;
    };

    createElement(nameElem, nameClass, textContent = '') {
        const element = document.createElement(`${nameElem}`);
        element.classList.add(`${nameClass}`);
        if(nameElem === 'th' || nameElem === 'td' || nameElem === 'li' || nameElem === 'time' || nameElem === 'h4') element.textContent = textContent;    

        return element;
    };

    createColTh(time) {
        return this.createElement('th', 'text-center', time);
    };

    createColTd(item, count) {
        const trElement1 = this.createElement('tr','gantt-chart__row');
        const tdElement1 = this.createElement('td','gantt-chart__col', ++count);
        const tdElement2 = this.createElement('td','gantt-chart__col', item.name);

        trElement1.appendChild(tdElement1);
        trElement1.appendChild(tdElement2);
        
        for (let i = 0; i < this.dateRange.length; i++) {
            
            const date1 = moment(item.schedule);
            const date2 = moment(this.dateRange[i]);

            const operations = item.operations;


            // const ulElement1 = this.createElement('table','gantt-chart__table-operation');
            const tableOperationsElement1 = this.createElement('table','gantt-chart__table-operation');
            tableOperationsElement1.classList.add('table-bordered');
            const theadOperationsElement1 = this.createElement('thead','gantt-chart__thead-operation');
            const tbodyOperationsElement1 = this.createElement('tbody','gantt-chart__tbody-operation');
            const trOperationsElement1 = this.createElement('tr','gantt-chart__tr-operation');

            const thOperationsElement1 = this.createElement('th','gantt-chart__th-operation', '№');
            const thOperationsElement2 = this.createElement('th','gantt-chart__th-operation', 'Наименование операции');



            trOperationsElement1.appendChild(thOperationsElement1);
            trOperationsElement1.appendChild(thOperationsElement2);
            theadOperationsElement1.appendChild(trOperationsElement1);

            tableOperationsElement1.appendChild(theadOperationsElement1);
            tableOperationsElement1.appendChild(tbodyOperationsElement1);


            
            // operations.forEach(operation => {
            //     hoursArray.push(this.millisecondsToHours(operation.compliance_rate));
            //     const liElement1 = this.createElement('th','gantt-chart__info-item', `${operation.name} - ${this.millisecondsToHours(operation.compliance_rate)} ч.` );
            //     trOperationsElement1.appendChild(liElement1);


            // });

            let hoursArray = []
            operations.forEach(item => hoursArray.push(this.millisecondsToHours(item.compliance_rate)));
            let maxHours = Math.max(...hoursArray);

            for (let i = 0; i < maxHours; i++) {
                const thElement1 = this.createElement('th','gantt-chart__info-item', `${date1.utc().hours(i).format('h:00')}`);
                trOperationsElement1.appendChild(thElement1);
            }

            operations.forEach((item, count) => {
                const trOperationsElement = this.createElement('tr','gantt-chart__tr-operation');
                let time = this.millisecondsToHours(item.compliance_rate);
                const tdElement1 = this.createElement('td','gantt-chart__info-item', ++count);
                const tdElement2 = this.createElement('td','gantt-chart__info-item', item.name);
                trOperationsElement.appendChild(tdElement1);
                trOperationsElement.appendChild(tdElement2);
                for (let i = 0; i < time; i++) {
                    const tdElement3 = this.createElement('td','gantt-chart__info-item');
                    tdElement3.style.background = "red";
                    trOperationsElement.appendChild(tdElement3);
                }
                tbodyOperationsElement1.appendChild(trOperationsElement);
            });


            // while (currentDate <= endDate) {
            //     this.dateRange.push(currentDate.format());
            //     currentDate.add(1, 'day');
            // };

    
            console.log(date1)
            console.log(date1.utc().format('h:mm a'))
            if(date1.format('YYYY-MM-DD') === date2.format('YYYY-MM-DD')) {
                const tdElement = this.createElement('td','gantt-chart__col--active');
                tdElement.setAttribute('data-date', `${this.dateRange[i]}`);

                const divElement1 = this.createElement('div', "card");
                divElement1.classList.add("gantt-chart__info");
                const divElement2 = this.createElement('div',`card-body`);
                const h4Element1 = this.createElement('h4',`mb-2`, item.name); 
                const timeElement1 = this.createElement('time',"mb-2", date1.utc().format('Do MMMM YYYY, h:00 a'));
                timeElement1.classList.add("d-block");

                divElement2.appendChild(h4Element1);
                divElement2.appendChild(timeElement1);
                divElement2.appendChild(tableOperationsElement1);

                divElement1.appendChild(divElement2);
                tdElement.appendChild(divElement1);

                trElement1.appendChild(tdElement);

            } else {
                const tdElement = this.createElement('td','gantt-chart__col');
                tdElement.setAttribute('data-date', `${this.dateRange[i]}`);
                trElement1.appendChild(tdElement);
            };
        };

        return trElement1;
    };

    checkStartDate(dates) {
        return moment(new Date(Math.min.apply(null, dates)));
    };

    checkEndDate(dates) {
        return moment(new Date(Math.max.apply(null, dates)));
    };

    checkDate(data) {
        data.forEach(item => this.dates.push(new Date(item.schedule)));
    };

    millisecondsToHours(milliseconds) {
        let hours = milliseconds / 3600000
        hours = Math.round(hours);
        return hours
    }

}

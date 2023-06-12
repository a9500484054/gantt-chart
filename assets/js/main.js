import ganttChart from './GanttChart.js';
import { dataList121 }  from './orders.js';

// Создаем Экземпляр класса
const GanttChart = new ganttChart('.gantt-chart', dataList121);
let lastScrollTop = 0;

const ganttChartBtnView = document.querySelector('.gantt-chart__btn-view');
const viewCard = document.querySelector('.view-card');
const viewCardBtnClose = viewCard.querySelector('.view-card__btn-close');
const viewCardNumber = viewCard.querySelector('.view-card__number');
const viewCardRange = viewCard.querySelector('.view-card__range');

document.addEventListener('DOMContentLoaded', (event) =>  {

    // Добавление обработчика события прокрутки страницы
    window.addEventListener('scroll', handleScroll);





    ganttChartBtnView.addEventListener('click', ()=> {
        viewCard.classList.add('view-card--active');
    })
    viewCardBtnClose.addEventListener('click', ()=> {
        viewCard.classList.remove('view-card--active');
    })

    viewCard.addEventListener('input', (event)=> {
        if(event.target.closest('.view-card__number')) {
            viewCardRange.value = event.target.value;
            GanttChart.sortTable(event.target.value);
        };
        if(event.target.closest('.view-card__range')) {
            viewCardNumber.value = event.target.value;
            GanttChart.sortTable(event.target.value);
        };
    });

});


function handleScroll() {
    let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;


    if (currentScrollTop > lastScrollTop && isEndOfPage()) {
        GanttChart.addElementsTbody();
        checkRow();
        
    }   

    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
}

function isEndOfPage() {
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
}

function checkRow() {
    let countRow = document.querySelector('.gantt-chart__wrapper-items').querySelectorAll('tr').length
    viewCardRange.value = countRow;
    viewCardNumber.value = countRow;
}
// Image move
const start_main_body_x = -50;
const start_main_body_y = -60;
const main_body_x_limit = 30;
const main_body_y_limit = 30;
const speed_coeffi = 0.5;
const speed_limit = 0.03; // less or equal 1

var main_body = document.querySelector("#main-body-img");
var main_body_mover = document.querySelector("#main-body");
const main_body_x = main_body_x_limit - start_main_body_x;
const main_body_y = main_body_y_limit - start_main_body_y;

function simetrical_boundary(x, boundary_from_0) {
  return Math.min(Math.max(x, -boundary_from_0), boundary_from_0);
}

main_body_mover.addEventListener("mousemove", function (e) {
  let main_body_css = getComputedStyle(main_body);
  let main_body_positions = main_body_css.objectPosition
    .toString()
    .split(" ");
  main_body_positions[0] = parseFloat(main_body_positions[0].slice(0, -2));
  main_body_positions[1] = parseFloat(main_body_positions[1].slice(0, -2));

  main_body_positions[0] +=
    2 *
    main_body_x *
    simetrical_boundary(
      (parseFloat(e.movementX) / main_body_css.width.slice(0, -2)) *
        speed_coeffi,
      speed_limit
    );
  main_body_positions[1] +=
    2 *
    main_body_y *
    simetrical_boundary(
      (parseFloat(e.movementY) / main_body_css.height.slice(0, -2)) *
        speed_coeffi,
      speed_limit
    );

  main_body_positions[0] = simetrical_boundary(
    main_body_positions[0],
    main_body_x
  );
  main_body_positions[1] = simetrical_boundary(
    main_body_positions[1],
    main_body_y
  );

  main_body.style.objectPosition =
    main_body_positions[0] + "px " + main_body_positions[1] + "px";
});

// ===========================================================
// Time


function make_percentes () {
  let date = new Date();
  if (date.getHours() >= 17 - 1) {
    document.querySelector("#work-percent-pie-value").innerHTML = "100%";
    document.querySelector("#work-percent-pie-diagram").style.setProperty("--percenteges", 1);
    return;
  } else if (date.getHours() < 9) {
    document.querySelector("#work-percent-pie-value").innerHTML = "0%";
    document.querySelector("#work-percent-pie-diagram").style.setProperty("--percenteges", 0);
    return;
  }
  const work_seconds = (17 - 9) * 3600;
  let percent = Math.round(((date.getSeconds() - 60) + (date.getMinutes() - 60) * 60 + (date.getHours() - 9) * 3600) / work_seconds * 100);
  document.querySelector("#work-percent-pie-value").innerHTML = percent + "%";
  document.querySelector("#work-percent-pie-diagram").style.setProperty("--percenteges", percent / 100);
}

function set_clock () {
    let date = new Date();
    let hour = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    
    if (hour.length == 1) hour = "0" + hour;
    if (minutes.length == 1) minutes = "0" + minutes;
    
    document.querySelector("#right-upper-text").innerHTML = hour + ":" + minutes;
    make_percentes();
    setTimeout(set_clock, Math.max(60 - date.setSeconds(), 0) * 1000);
}

function make_calendar_table () {
  let date = new Date();
  let calendar = []

  let year = date.getFullYear();
  let month = date.getMonth();
  let today_in_array = 0;

  let day_of_week = (new Date(year, month, 1)).getDay() - 1;
  if (day_of_week < 0) {
    day_of_week = 0;
  }
  let last_month_days = new Date(year, month, 0).getDate();
  for (let i = 0; i < day_of_week; i++) {
      calendar.unshift(last_month_days);
      last_month_days--;
  }

  today_in_array = calendar.length + date.getDate() - 1;

  for (let i = 1; i <= (new Date(year, month + 1, 0).getDate()); ++i) {
      calendar.push(i);
  }
  for (let i = 1; calendar.length < 42; i++) {
      calendar.push(i);
  }
  return [calendar, today_in_array, today_in_array % 7]; // calendar, today in array, today day week
}

function make_calendar () {
let calendar = make_calendar_table();
let calendar_HTML = `
  <div class="day-week" id="calendar-01">Пн</div>
  <div class="day-week" id="calendar-02">Вт</div>
  <div class="day-week" id="calendar-03">Ср</div>
  <div class="day-week" id="calendar-04">Чт</div>
  <div class="day-week" id="calendar-05">Пт</div>
  <div class="day-week" id="calendar-06">Сб</div>
  <div class="day-week" id="calendar-07">Нд</div>
`

for (let i = 0; i < calendar[0].length; ++i) {
  calendar_HTML += '<div class="month-day' + (Math.random() < 0.65 ? ' selected-month-day'  : '') 
                   + '" id="calendar-' + (i) + '">' + calendar[0][i] + '</div>\n';
}
document.querySelector("#calendar").innerHTML = calendar_HTML;

document.querySelector("#calendar-0" + (calendar[2] + 1)).classList.add("today-day-week");
document.querySelector("#calendar-" + (calendar[1])).classList.add("today-day");

}

function set_data () {
    let date = new Date();
    let year = date.getFullYear();
    let month = ["Січень", "Лютий", "Березень", "Квітень", "Травень", 
                 "Червень", "Липень", "Серпень", "Вересень", "Жовтень", 
                 "Листопад", "Грудень"][parseInt(date.getMonth())];
    let day = date.getDate().toString();
    if (day.length == 1) day = "0" + day;
    document.querySelector("#status-main-day").innerHTML = day;
    document.querySelector("#status-main-month").innerHTML = month;
    document.querySelector("#status-main-year").innerHTML = year;
    make_calendar();
    setTimeout(set_data, (Math.max(60 - date.getSeconds(), 0) + Math.max(60 - date.getMinutes(), 0) * 60 +
                           Math.max(23 - date.getHours(), 0) * 3600) * 1000);
}

set_clock();
set_data();
